"use client";
import React from "react";
import { createPortal } from "react-dom";

const Z = 2147483647;
const LS_ENABLED = "acc:inlineMagnifier:enabled";
const ACCENT = "#A78BFA";        // 浅紫
const PAD_X = 18;                // 左右 padding（和样式保持一致）
const PAD_Y = 16;                // 上下 padding
const MIN_W = 600;               // 固定宽度（保持卡片视觉稳定）
const MIN_H = 120;               // 最小高度

// —— 单例护栏 —— //
if (typeof window !== "undefined") {
    const w = window as any;
    if (w.__ACC_MAGNIFIER_SIDE_TL__) {
        console.warn("[A11y] SideTopLeft magnifier already mounted — skip.");
    } else {
        w.__ACC_MAGNIFIER_SIDE_TL__ = true;
    }
}

export default function AccMagnifierSideTopLeft() {
    const [enabled, setEnabled] = React.useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        return (localStorage.getItem(LS_ENABLED) ?? "true") === "true";
    });

    const sideRef = React.useRef<HTMLDivElement | null>(null);
    const sideTextRef = React.useRef<HTMLDivElement | null>(null);

    // 覆盖层（Grammarly、自身面板等）仅在取词时临时关闭 pointer-events
    const OVERLAY_SELECTOR = [
        "#acc-inline-side",
        "[data-grammarly-shadow-root]",
        "grammarly-desktop-integration",
        '[class*="grammarly"]',
        '[id*="grammarly"]',
    ].join(",");

    function withOverlaysDisabled<T>(fn: () => T): T {
        const overlays = Array.from(document.querySelectorAll<HTMLElement>(OVERLAY_SELECTOR));
        const prev: string[] = [];
        for (const el of overlays) { prev.push(el.style.pointerEvents); el.style.pointerEvents = "none"; }
        try { return fn(); } finally { overlays.forEach((el, i) => (el.style.pointerEvents = prev[i] ?? "")); }
    }

    function isSkip(el: Element | null): boolean {
        if (!el) return true;
        if (el.closest("#acc-inline-side")) return true;
        if (el.tagName.startsWith("GRAMMARLY") || (el as HTMLElement).hasAttribute?.("data-grammarly-shadow-root")) return true;
        return false;
    }

    function nearestTextFrom(el: HTMLElement): string | null {
        const s = (el.innerText || el.textContent || "").trim();
        if (s) return s.length > 200 ? s.slice(0, 200) + "…" : s;
        const q: ChildNode[] = [...el.childNodes];
        while (q.length) {
            const n = q.shift()!;
            if (n.nodeType === Node.TEXT_NODE) {
                const t = (n as Text).data.trim();
                if (t) return t.length > 200 ? t.slice(0, 200) + "…" : t;
            } else if ((n as Element).childNodes?.length) q.push(...(n as Element).childNodes);
        }
        return null;
    }

    function expandFromTextNode(node: Text, offset: number): string | null {
        try {
            const value = node.data || "";
            let i = Math.max(0, Math.min(offset, value.length));
            if (/\s/.test(value.charAt(i))) while (i > 0 && /\s/.test(value.charAt(i))) i--;
            let s = i, e = i;
            const isWord = (ch: string) => /\w|\p{L}|\p{M}/u.test(ch);
            while (s > 0 && isWord(value.charAt(s - 1))) s--;
            while (e < value.length && isWord(value.charAt(e))) e++;
            if (s === e) {
                const left = Math.max(0, i - 40), right = Math.min(value.length, i + 80);
                const snippet = value.slice(left, right).trim();
                return snippet || null;
            }
            const ctxL = Math.max(0, s - 40), ctxR = Math.min(value.length, e + 80);
            return value.slice(ctxL, ctxR).trim() || null;
        } catch { return null; }
    }

    function getTextAt(x: number, y: number): string | null {
        return withOverlaysDisabled(() => {
            const doc: any = document;
            try {
                if (doc.caretRangeFromPoint) {
                    const r: Range | null = doc.caretRangeFromPoint(x, y);
                    if (r?.startContainer?.nodeType === Node.TEXT_NODE) {
                        const t = expandFromTextNode(r.startContainer as Text, r.startOffset);
                        if (t) return t;
                    }
                } else if (doc.caretPositionFromPoint) {
                    const pos = doc.caretPositionFromPoint(x, y);
                    if (pos?.offsetNode?.nodeType === Node.TEXT_NODE) {
                        const t = expandFromTextNode(pos.offsetNode as Text, pos.offset);
                        if (t) return t;
                    }
                }
            } catch {}

            const stack = (document.elementsFromPoint(x, y) as HTMLElement[]) || [];
            const target = stack.find((e) => !isSkip(e)) as HTMLElement | undefined;
            if (target) {
                const t = nearestTextFrom(target);
                if (t) return t;
            }

            const offsets = [0, 6, -6, 12, -12];
            for (const dx of offsets) for (const dy of offsets) {
                if (dx === 0 && dy === 0) continue;
                const s2 = (document.elementsFromPoint(x + dx, y + dy) as HTMLElement[]) || [];
                const t2 = s2.find((e) => !isSkip(e)) as HTMLElement | undefined;
                if (t2) {
                    const txt = nearestTextFrom(t2);
                    if (txt) return txt;
                }
            }

            const el = document.elementFromPoint(x, y) as HTMLElement | null;
            if (el && !isSkip(el)) return nearestTextFrom(el);
            return null;
        });
    }

    // —— 自动高度（随内容增减，带上限） —— //
    const applyAutoSize = React.useCallback(() => {
        const box = sideRef.current;
        const txt = sideTextRef.current;
        if (!box || !txt) return;

        // 视口相关上限
        const MAX_H = Math.floor(Math.min(window.innerHeight * 0.55, 560)); // 你可调 0.55 / 560
        const contentH = Math.ceil(txt.scrollHeight);                        // 文本真实高度
        const desiredH = Math.max(MIN_H, Math.min(MAX_H, contentH + PAD_Y * 2));

        box.style.height = desiredH + "px";
        // 内容是否需要滚动
        txt.style.maxHeight = desiredH - PAD_Y * 2 + "px";
        txt.style.overflow = contentH + PAD_Y * 2 > desiredH ? "auto" : "hidden";
    }, []);

    // 指针事件（捕获阶段）：更新文本 -> 触发 ResizeObserver 自动调高
    function onPointer(ev: PointerEvent) {
        if (!enabled) return;
        const target = ev.target as HTMLElement | null;
        if (target && target.closest("#acc-inline-side")) return; // 面板内允许滚动，不取词
        const t = getTextAt(ev.clientX, ev.clientY);
        if (t && sideTextRef.current) {
            sideTextRef.current.textContent = t;
            // 保险：有些环境下 RO 有延迟，这里同步一次
            applyAutoSize();
        }
    }

    // 初始显隐
    React.useEffect(() => {
        const s = sideRef.current!, sb = sideTextRef.current!;
        if (!s || !sb) return;

        if (enabled) {
            sb.textContent = "Side box READY — hover text to update";
            s.style.display = "block";
            requestAnimationFrame(() => { s.style.opacity = "1"; });
            applyAutoSize();
        } else {
            s.style.display = "none";
        }
    }, [enabled, applyAutoSize]);

    // 监听文本尺寸变化 & 窗口变化，动态调整高度
    React.useEffect(() => {
        const txt = sideTextRef.current;
        if (!txt) return;

        const ro = new ResizeObserver(() => applyAutoSize());
        ro.observe(txt);

        const onResize = () => applyAutoSize();
        window.addEventListener("resize", onResize);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [applyAutoSize]);

    // 捕获阶段监听
    React.useEffect(() => {
        const opts: AddEventListenerOptions = { passive: true, capture: true };
        window.addEventListener("pointermove", onPointer, opts);
        window.addEventListener("pointerover", onPointer, opts);
        return () => {
            window.removeEventListener("pointermove", onPointer, opts);
            window.removeEventListener("pointerover", onPointer, opts);
        };
    }, [enabled, applyAutoSize]);

    // 接受按钮事件（只看 enabled）
    React.useEffect(() => {
        const onCustom = (e: Event) => {
            const d = (e as CustomEvent).detail || {};
            if (typeof d.enabled === "boolean") {
                setEnabled(d.enabled);
                try { localStorage.setItem(LS_ENABLED, String(d.enabled)); } catch {}
            }
        };
        window.addEventListener("acc:inlineMagnifier", onCustom as EventListener);
        return () => window.removeEventListener("acc:inlineMagnifier", onCustom as EventListener);
    }, []);

    if (typeof window === "undefined") return null;

    // —— 左上角磨砂白面板（固定宽度、自动高度） —— //
    return createPortal(
        <div
            id="acc-inline-side"
            ref={sideRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                zIndex: Z,
                display: "none",
                top: 68,
                left: 24,
                width: MIN_W,                 // 固定视觉宽度（更稳）；需要自适应宽度再说
                // 高度由 JS 动态写入：box.style.height = ...
                padding: `${PAD_Y}px ${PAD_X}px`,
                color: ACCENT,
                background: "rgba(255,255,255,.72)",
                border: `1px solid rgba(167,139,250,.35)`,
                borderRadius: 16,
                boxShadow:
                    "0 12px 40px rgba(135,106,255,.20), 0 2px 10px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6)",
                backdropFilter: "saturate(160%) blur(14px)",
                WebkitBackdropFilter: "saturate(160%) blur(14px)",
                opacity: 0,
                transition: "opacity .12s ease, height .18s ease",
                pointerEvents: "auto",
                contain: "layout paint size",
            }}
        >
            <div
                ref={sideTextRef}
                style={{
                    fontWeight: 900,
                    lineHeight: 1.18,
                    letterSpacing: ".005em",
                    fontSize: "clamp(22px, 2.4vw, 40px)",
                    // maxHeight / overflow 运行时会被 JS 动态写入
                    textShadow: "0 1px 0 rgba(255,255,255,.35)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}
            />
        </div>,
        document.body
    );
}
