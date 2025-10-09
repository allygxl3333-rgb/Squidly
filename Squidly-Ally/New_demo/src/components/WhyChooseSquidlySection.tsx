// src/components/WhyChooseSquidlySection.tsx
import React, { useEffect, useRef, useState } from "react";
import { EyeOff, MapPin, CheckCircle2 } from "lucide-react";

// 左侧第一个条目的本地图标（你已有）
import hugIcon from "../Photo/hug.png"; 
import aiIcon from "../Photo/ai-brain.png";
import stethoscopeIcon from "../Photo/stethoscope.png";

// 右侧对应的三张图片（用你的真实文件名）
import imgVoice from "../Photo/why-voice.jpg";
import imgCare from "../Photo/why-care.png";
import imgAI from "../Photo/why-ai.png";

/** 主组件 */
export default function WhyChooseSquidlySection() {
  const steps: Step[] = [
    {
      title: "Video Calls for Every Voice",
      desc:
        "Built to make communication extraordinarily inclusive, Squidly is the best way to make accessible video calls.",
      iconImg: hugIcon,     // 左侧图标：本地图片
      image: imgVoice,      // 右侧大图
      imageAlt: "Accessible video calls preview",
    },
    {
      title: "Patient Care Meets Simplicity",
      desc:
        "Designed alongside clinicians and users, Squidly makes remote sessions effective and accessible.",
      iconImg: stethoscopeIcon,   // 等你下载完护理图标后换成对应的 SVG/PNG 路径
      image: imgCare,
      imageAlt: "Remote patient care with Squidly",
    },
    {
      title: "Frontier Intelligence",
      desc:
        "Powered by a mix of purpose-built and frontier AI models, Squidly is smart and fast.",
      iconImg: aiIcon,   // 等你下载完 AI 图标后换
      image: imgAI,
      imageAlt: "Frontier AI models powering Squidly",
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <section aria-label="Why choose Squidly" className="py-16 md:py-24">
      <style>{`
        @keyframes floaty { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } }
        .chip-float-1{ animation: floaty 4.2s ease-in-out infinite; }
        .chip-float-2{ animation: floaty 4.6s ease-in-out infinite; animation-delay:.2s; }
      `}</style>

      {/* 头部 */}
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm font-semibold text-violet-700">Why Squidly</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Why choose Squidly
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-slate-600">
          Squidly works the way you need — invisible to screen share, fast to set up, and designed to stay out of your way while you focus.
        </p>
      </div>

      {/* 主体两列 */}
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:gap-12">
        {/* 左：可点击步骤 + 滑动高亮 */}
        <SelectableSteps steps={steps} active={active} onChange={setActive} />

        {/* 右：展示卡片（图片随 active 切换） */}
        <RightShowcase steps={steps} active={active} />
      </div>
    </section>
  );
}

/* ================= 类型 ================= */
type Step = {
  title: string;
  desc: string;
  iconImg?: string;      // 左侧小图标（本地图片）
  image: string;         // 右侧大图
  imageAlt?: string;
};

/* ================= 左列：可选择步骤 & 滑动高亮 ================= */
function SelectableSteps({
  steps,
  active,
  onChange,
}: {
  steps: Step[];
  active: number;
  onChange: (i: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [highlight, setHighlight] = useState<{ top: number; height: number }>({
    top: 0,
    height: 0,
  });

  // 计算高亮位置
  const updateHighlight = (index = active) => {
    const container = containerRef.current;
    const el = itemRefs.current[index];
    if (!container || !el) return;
    const c = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setHighlight({ top: r.top - c.top, height: r.height });
  };

  useEffect(() => {
    updateHighlight(active);
    const onResize = () => updateHighlight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateHighlight(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, steps.length]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-6"
      style={{ isolation: "isolate" }}
    >
      {/* 滑动高亮背景 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 z-0 rounded-2xl border border-violet-200 bg-violet-50/70 shadow-md transition-all duration-300"
        style={{ top: highlight.top, height: highlight.height }}
      />

      {steps.map((s, i) => {
        const activeItem = i === active;
        return (
          <div
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            role="button"
            tabIndex={0}
            onClick={() => onChange(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(i);
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                onChange(Math.max(0, active - 1));
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                onChange(Math.min(steps.length - 1, active + 1));
              }
            }}
            className={[
              "relative z-10 cursor-pointer rounded-2xl border px-5 py-5 transition-colors md:px-6 md:py-6",
              activeItem
                ? "border-transparent"
                : "border-slate-200 bg-white hover:bg-slate-50",
            ].join(" ")}
          >
            <div className="flex items-start gap-4">
              {/* 序号 + 图标 */}
              <div className="relative mt-1">
                <span
                  className={[
                    "absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full text-[11px] font-extrabold text-white shadow ring-2 ring-white transition-colors",
                    activeItem
                      ? "bg-gradient-to-b from-violet-500 to-violet-700"
                      : "bg-gradient-to-b from-violet-400 to-violet-600",
                  ].join(" ")}
                >
                  {i + 1}
                </span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow ring-1 ring-slate-200">
                  {s.iconImg ? (
                    <img
                      src={s.iconImg}
                      alt=""
                      className="h-6 w-6 object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div className="h-6 w-6 rounded bg-gradient-to-b from-violet-300 to-violet-500 opacity-70" />
                  )}
                </div>
              </div>

              {/* 文案 */}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                  {s.desc}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= 右列：展示卡片（图片随 active 切换） ================= */
function RightShowcase({ steps, active }: { steps: Step[]; active: number }) {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_46px_rgba(17,24,39,.08)]">

        {/* 右侧主图：跟随 active 切换（淡入淡出） */}
        <div className="px-6 pt-6 md:px-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-100">
            {steps.map((s, i) => (
              <img
                key={i}
                src={s.image}
                alt={s.imageAlt || s.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                draggable={false}
              />
            ))}
          </div>
        </div>

        {/* 右侧文字：跟随 active 显示对应标题与描述 */}
        <div className="space-y-5 px-6 py-6 md:px-8">
          <BlockTitle>HIGHLIGHTS</BlockTitle>

          {/* 标题（作为一条高亮项） */}
          <FeatureItem text={steps[active].title} />

          {/* 具体描述（你的左侧那句描述） */}
          <FeatureItem text={steps[active].desc} />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
              Sign up
            </button>
            <button className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-b from-violet-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(111,87,255,.35)] ring-1 ring-violet-500/30 hover:brightness-105">
              Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= 小组件 ================= */
function Chip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 text-[13px] font-semibold text-slate-800 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </p>
  );
}

function FeatureItem({
  text,
  iconSize = 20, // 统一图标尺寸（px）
}: {
  text: string;
  iconSize?: number;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm">
      {/* 固定尺寸 + 不允许收缩，避免被压缩变小 */}
      <CheckCircle2
        className="mt-0.5 text-violet-600 shrink-0"
        style={{ width: iconSize, height: iconSize }}
      />
      <p className="text-[15px] leading-relaxed">{text}</p>
    </div>
  );
}

