'use client';
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";

/** 从 Drive 链接取出 fileId，并拼出 preview 地址（用于 iframe） */
function getDriveFileId(input?: string | null): string | null {
    if (!input) return null;
    try {
        const u = new URL(input);
        const m = u.pathname.match(/\/file\/d\/([^/]+)/);
        if (m?.[1]) return m[1];
        const id = u.searchParams.get("id");
        if (id) return id;
        const m2 = u.search.match(/[?&]id=([^&]+)/);
        if (m2?.[1]) return m2[1];
    } catch {}
    return null;
}
function buildDrivePreviewUrl(driveUrl: string) {
    const id = getDriveFileId(driveUrl);
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

type Props = {
    /** 必填：Google Drive 分享链接（设为“拥有链接的任何人可查看”） */
    driveUrl: string;
    /** 可选：<video> 的海报（iframe 不使用，但保留 props 以不破坏调用方） */
    posterUrl?: string;
    onGetStarted?: () => void;
};

const EXTRA = 12;
const SOFT_EDGE = 70;

function CTA({
                 children, href = "#", onClick
             }: { children: React.ReactNode; href?: string; onClick?: () => void }) {
    const prefers = useReducedMotion();
    return (
        <motion.a
            href={href}
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-[28px] px-7 h-14 font-semibold
                 text-white bg-[#A087DD] shadow-[0_10px_30px_rgba(133,84,255,.35)]"
            whileHover={prefers ? {} : { scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.985 }}
        >
            {children}
            <ChevronRight className="h-5 w-5" />
        </motion.a>
    );
}

export default function SquidlyHero({ driveUrl, posterUrl, onGetStarted }: Props) {
    const [navH, setNavH] = useState(0);
    const [vhUnit, setVhUnit] = useState<'svh'|'dvh'|'vh'>('vh');

    const sectionRef = useRef<HTMLElement | null>(null);
    const titleRef   = useRef<HTMLHeadingElement | null>(null);
    const ctaWrapRef = useRef<HTMLDivElement | null>(null);

    const [ctaBottom, setCtaBottom]   = useState<number | null>(null);
    const [overlayTop, setOverlayTop] = useState<number>(0);

    const previewUrl = useMemo(() => buildDrivePreviewUrl(driveUrl), [driveUrl]);

    useEffect(() => {
        const el = document.querySelector("header") as HTMLElement | null;
        if (!el) return;
        const update = () => setNavH(el.offsetHeight);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        window.addEventListener("resize", update);
        return () => { ro.disconnect(); window.removeEventListener("resize", update); };
    }, []);

    useEffect(() => {
        // @ts-ignore
        const sup = (p: string) => typeof CSS !== 'undefined' && CSS.supports && CSS.supports(p);
        if (sup('height: 100svh')) setVhUnit('svh'); else
        if (sup('height: 100dvh')) setVhUnit('dvh'); else setVhUnit('vh');
    }, []);

    // 计算 CTA 与标题基线对齐、以及渐变起点（保留原逻辑）
    useEffect(() => {
        const calc = () => {
            const sec = sectionRef.current;
            const h1  = titleRef.current;
            if (!sec || !h1) return;

            const secRect = sec.getBoundingClientRect();
            const h1Rect  = h1.getBoundingClientRect();

            const startTop = Math.max(0, h1Rect.top - secRect.top - SOFT_EDGE);
            setOverlayTop(startTop);

            const baselineY = h1Rect.bottom;
            const ctaH =  ctaWrapRef.current?.firstElementChild instanceof HTMLElement
                ? ctaWrapRef.current.firstElementChild.offsetHeight : 56;
            const bottom = Math.max(12, secRect.bottom - baselineY - ctaH / 2);
            setCtaBottom(bottom);
        };

        const raf = () => requestAnimationFrame(calc);
        raf();
        window.addEventListener('resize', raf);
        const ro = new ResizeObserver(raf);
        if (sectionRef.current) ro.observe(sectionRef.current);
        if (titleRef.current)   ro.observe(titleRef.current);
        return () => { window.removeEventListener('resize', raf); ro.disconnect(); };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden -mt-20 pt-20 md:-mt-24 md:pt-24"
            style={{
                marginTop: navH ? -(navH + EXTRA) : undefined,
                paddingTop: navH ?  (navH + EXTRA) : undefined,
                minHeight: `calc(100${vhUnit} + ${navH + EXTRA}px)`,
            }}
        >
            {/* 背景层：Drive 预览 iframe（最稳） */}
            <div className="absolute inset-0 -z-10 bg-black">
                {previewUrl && (
                    <iframe
                        key="drive-iframe"
                        src={`${previewUrl}?autoplay=1&mute=1&controls=0&loop=1`}
                        title="Drive Video"
                        allow="autoplay"
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 0, pointerEvents: "none" }}
                    />
                )}
            </div>

            {/* 全宽渐变遮罩（保留原效果） */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5]"
                style={{
                    top: overlayTop,
                    background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.00)   0%,
            rgba(0,0,0,0.15)   10%,
            rgba(0,0,0,0.50)   28%,
            rgba(0,0,0,0.88)   58%,
            rgba(0,0,0,0.98)  100%
          )`,
                }}
            />

            {/* 左下文案（原样保留） */}
            <div className="absolute left-6 md:left-12 bottom-28 md:bottom-32 max-w-[min(48rem,60vw)]">
                <h1
                    ref={titleRef}
                    className="font-extrabold leading-[1.04] text-white drop-shadow-[0_12px_28px_rgba(0,0,0,.35)]
                     text-[clamp(36px,6.2vw,68px)] tracking-[-.015em]"
                >
                    Video calls
                    <br />
                    for Every Voice
                </h1>
                <p className="mt-5 text-white/95 text-[clamp(16px,2vw,22px)]">
                    Squidly — accessible video calls for every way of communicating
                </p>
            </div>

            {/* 右下 CTA（原样保留） */}
            <div ref={ctaWrapRef} className="absolute right-6 md:right-16" style={{ bottom: ctaBottom ?? 16 }}>
                <CTA href="#get-started" onClick={onGetStarted}>Get started for free</CTA>
            </div>
        </section>
    );
}
