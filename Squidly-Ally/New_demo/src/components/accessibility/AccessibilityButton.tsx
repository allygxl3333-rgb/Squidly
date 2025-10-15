"use client";
import React, { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccProvider from "./AccProvider";
import TextControls from "./features/TextControls";
import ContrastControls from "./features/ContrastControls";
import LinkControls from "./features/LinkControls";
import MotionControls from "./features/MotionControls";
import KeyboardControls from "./features/KeyboardControls";
import MediaControls from "./features/MediaControls";
import AltControls from "./features/AltControls";
import "./styles/global-acc.css";
import { createPortal } from "react-dom";

// 懒加载放大镜（只在客户端执行，避免 SSR 报错）
const AccMagnifierSideTopLeft = React.lazy(() => import("../AccMagnifierUltra"));

const LS_ENABLED = "acc:inlineMagnifier:enabled";

function Portal({ children }: { children: React.ReactNode }) {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
}

const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 380, damping: 34 } },
    exit:   { x: "100%", transition: { type: "tween",  duration: 0.25 } },
};

// 内联小图标，避免外部依赖
const EyeIcon = ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="block">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
);

export default function AccessibilityButton() {
    const [open, setOpen] = useState(false);

    // —— 屏幕放大镜：抽屉里的开关状态 —— //
    const [lensEnabled, setLensEnabled] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        const raw = localStorage.getItem(LS_ENABLED);
        return raw == null ? true : raw === "true";
    });

    // 同步：把当前状态广播给放大镜
    useEffect(() => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new CustomEvent("acc:inlineMagnifier", { detail: { enabled: lensEnabled }}));
    }, []); // 初次挂载同步一次

    // 监听来自别处的变化（保持 UI 和实际一致）
    useEffect(() => {
        const onCustom = (e: Event) => {
            const d = (e as CustomEvent).detail || {};
            if (typeof d.enabled === "boolean") setLensEnabled(d.enabled);
        };
        const onStorage = (e: StorageEvent) => {
            if (e.key === LS_ENABLED && e.newValue != null) setLensEnabled(e.newValue === "true");
        };
        window.addEventListener("acc:inlineMagnifier", onCustom as EventListener);
        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener("acc:inlineMagnifier", onCustom as EventListener);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    // 切换开关
    const toggleLens = () => {
        const next = !lensEnabled;
        setLensEnabled(next);
        try { localStorage.setItem(LS_ENABLED, String(next)); } catch {}
        window.dispatchEvent(new CustomEvent("acc:inlineMagnifier", { detail: { enabled: next }}));
    };

    return (
        <AccProvider>
            <Portal>
                {/* 放大镜：全局挂一次（懒加载） */}
                <Suspense fallback={null}>
                    <AccMagnifierSideTopLeft />
                </Suspense>

                {/* 触发按钮 */}
                <button
                    type="button"
                    data-acc-ui
                    aria-label="Accessibility options"
                    onClick={() => setOpen(true)}
                    className="fixed z-[10000] bottom-5 right-5 md:bottom-6 md:right-6 rounded-full shadow-lg bg-white backdrop-blur border border-slate-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-300 p-[12px] md:p-[14px] text-violet-700"
                    style={{ fontSize: 14 }}
                >
                    <EyeIcon />
                </button>

                {/* （可选）你的旧遮罩 */}
                <div
                    data-acc-ui
                    className="acc-lens-mask fixed inset-0 pointer-events-none z-[9998]"
                    aria-hidden="true"
                />

                {/* 抽屉：右侧 1/3 宽 */}
                <AnimatePresence>
                    {open && (
                        <>
                            <motion.button
                                type="button"
                                aria-hidden
                                className="fixed inset-0 z-[10002] bg-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setOpen(false)}
                            />

                            <motion.div
                                role="dialog"
                                aria-label="Accessibility settings"
                                className="fixed top-0 right-0 h-screen w-[33.333vw] min-w-[360px] max-w-[720px] z-[10003]"
                                variants={drawerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div
                                    data-acc-ui
                                    className="h-full flex flex-col bg-white border-l border-slate-200 shadow-2xl overflow-hidden"
                                >
                                    {/* 顶栏 */}
                                    <div className="acc-header flex items-center justify-between h-12 px-4">
                                        <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-900">
                                            <span className="text-violet-700"><EyeIcon size={18} /></span>
                                            Accessibility
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                                            aria-label="Close"
                                            className="p-1.5 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-300"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-700">
                                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* 内容：滚动区域 */}
                                    <div className="flex-1 overflow-y-auto p-4 grid gap-4 text-[14px]">
                                        {/* === Screen Magnifier（新增开关） === */}
                                        <section className="grid gap-2">
                                            <div className="acc-section-title">Screen Magnifier</div>

                                            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                                                <div className="flex flex-col">
                                                    <div className="font-semibold text-slate-900">Magnifier</div>
                                                    <div className="text-[12px] text-slate-500">
                                                        Show a frosted white panel that mirrors text under the cursor.
                                                    </div>
                                                </div>

                                                {/* Switch */}
                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={lensEnabled}
                                                    onClick={toggleLens}
                                                    className={`relative inline-flex h-[30px] w-[56px] items-center rounded-full transition-colors
                                      ${lensEnabled ? "bg-violet-600" : "bg-slate-300"}`}
                                                >
                          <span
                              className={`inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow transition-transform
                                        ${lensEnabled ? "translate-x-[28px]" : "translate-x-[3px]"}`}
                          />
                                                    <span className="sr-only">Toggle screen magnifier</span>
                                                </button>
                                            </div>
                                        </section>

                                        {/* 其余原有设置 */}
                                        <section className="grid gap-2">
                                            <div className="acc-section-title">Text size</div>
                                            <TextControls />
                                        </section>

                                        <section className="grid gap-2">
                                            <div className="acc-section-title">Reduce color intensity</div>
                                        </section>

                                        <section className="grid gap-2">
                                            <div className="acc-section-title">Colour contrast</div>
                                            <ContrastControls />
                                        </section>

                                        <section className="grid gap-3">
                                            <div className="grid grid-cols-3 gap-3">
                                                <MediaControls />
                                                <KeyboardControls />
                                                <MotionControls />
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <LinkControls />
                                                <AltControls />
                                            </div>
                                        </section>

                                        <div className="pt-1">
                                            <button
                                                type="button"
                                                onClick={() => alert("Settings saved")}
                                                className="w-full h-11 rounded-full bg-violet-700 text-white font-semibold shadow hover:bg-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-300"
                                            >
                                                Save settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </Portal>
        </AccProvider>
    );
}
