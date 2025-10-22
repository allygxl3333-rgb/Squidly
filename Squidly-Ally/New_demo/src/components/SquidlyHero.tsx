'use client';
import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type Props = { bgSrc?: string; onGetStarted?: () => void };

const EXTRA = 12;       // 让背景顶到导航后面再上提 12px
const SOFT_EDGE = 70;   // 渐变起点向上扩 40px，避免出现硬边

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

export default function SquidlyHero({ bgSrc, onGetStarted }: Props) {
    const [navH, setNavH] = useState(0);
    const [vhUnit, setVhUnit] = useState<'svh'|'dvh'|'vh'>('vh');

    const sectionRef = useRef<HTMLElement | null>(null);
    const titleRef   = useRef<HTMLHeadingElement | null>(null);
    const ctaWrapRef = useRef<HTMLDivElement | null>(null);

    const [ctaBottom, setCtaBottom]   = useState<number | null>(null);
    const [overlayTop, setOverlayTop] = useState<number>(0);

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

    // 计算 CTA 与标题基线对齐、以及渐变起点
    useEffect(() => {
        const calc = () => {
            const sec = sectionRef.current;
            const h1  = titleRef.current;
            if (!sec || !h1) return;

            const secRect = sec.getBoundingClientRect();
            const h1Rect  = h1.getBoundingClientRect();

            // 渐变从标题顶部“往上再抬 40px”，避免硬边
            const startTop = Math.max(0, h1Rect.top - secRect.top - SOFT_EDGE);
            setOverlayTop(startTop);

            // CTA 与 "for Every Voice" 基线持平（近似用 h1 的 bottom 作基线）
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

    const BG = bgSrc ?? "src/Photo/Herobg.png";

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
            {/* 背景图 */}
            <div className="absolute inset-0 -z-10">
                <img
                    src={BG}
                    alt="Accessible video call running on a laptop"
                    className="w-full h-full object-cover object-center"
                    draggable={false}
                />
            </div>

            {/* 全宽渐变遮罩：从透明→微白→更深黑，左下更黑；无“矩形边界” */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5]"
                style={{
                    top: overlayTop, // 保持从标题上方一点点开始
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

            {/* 左下文案 */}
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

            {/* 右下 CTA（与标题基线持平） */}
            <div ref={ctaWrapRef} className="absolute right-6 md:right-16" style={{ bottom: ctaBottom ?? 16 }}>
                <CTA href="#get-started" onClick={onGetStarted}>Get started for free</CTA>
            </div>
        </section>
    );
}
