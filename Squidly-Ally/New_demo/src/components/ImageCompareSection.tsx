import React, { useEffect, useRef, useState } from "react";

// === Original assets/content (unchanged) ===
import heroImg from "../Photo/hero-image.png";
import overlayImg from "../Photo/hero-card-2-with-cursor.png";

/* ───────────── Compare Slider (kept as-is) ───────────── */
function CompareSlider({
  leftSrc,
  rightSrc,
  leftLabel = "Left",
  rightLabel = "Right",
  initial = 50,
  ratio = "16/10",
  className = "",
}: {
  leftSrc: string;
  rightSrc: string;
  leftLabel?: string;
  rightLabel?: string;
  initial?: number;
  ratio?: `${number}/${number}` | string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(initial);
  const [drag, setDrag] = useState(false);
  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width);
    setPos(clamp((x / r.width) * 100));
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    setDrag(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!drag && (e.buttons & 1) === 0) return;
    setFromClientX(e.clientX);
  };
  const endDrag: React.PointerEventHandler<HTMLDivElement> = () => setDrag(false);

  const rightClip = 100 - pos;

  return (
    <div
      ref={ref}
      className={`relative select-none overflow-hidden rounded-xl bg-slate-100 touch-none ${className}`}
      style={{ aspectRatio: ratio }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {/* 右图（全幅） */}
      <img src={rightSrc} alt="right" className="absolute inset-0 h-full w-full object-cover" />
      {/* 左图（裁切） */}
      <img
        src={leftSrc}
        alt="left"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${rightClip}% 0 0)` }}
      />

      {/* 标签 */}
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
        {leftLabel}
      </div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
        {rightLabel}
      </div>

      {/* 分割线 + 把手 */}
      <div className="absolute top-0" style={{ left: `calc(${pos}% - 1px)` }} aria-hidden>
        <div className="h-full w-[2px] bg-white/95 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
      </div>
      <div
        role="slider"
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        className="absolute top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize"
        style={{ left: `${pos}%` }}
        onDoubleClick={() => setPos(50)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => clamp(p - 2));
          if (e.key === "ArrowRight") setPos((p) => clamp(p + 2));
          if (e.key === "Home") setPos(0);
          if (e.key === "End") setPos(100);
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10">
          <span className="text-2xl leading-none text-slate-700">–</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────── New Why-Choose style layout (structure swap) ───────────── */

type Step = {
  title: string;
  descs: string[]; // keep ALL original copy; no changes to wording
  media: React.ReactNode; // image or CompareSlider
};

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
  const [highlight, setHighlight] = useState<{ top: number; height: number }>({ top: 0, height: 0 });

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
    <div ref={containerRef} className="relative flex flex-col gap-6" style={{ isolation: "isolate" }}>
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
              activeItem ? "border-transparent" : "border-slate-200 bg-white hover:bg-slate-50",
            ].join(" ")}
          >
            <div className="flex items-start gap-4">
              {/* 序号圆点 */}
              <div className="relative mt-1">
                <span
                  className={[
                    "grid h-8 w-8 place-items-center rounded-full text-[12px] font-extrabold text-white shadow ring-2 ring-white transition-colors",
                    activeItem ? "bg-gradient-to-b from-violet-500 to-violet-700" : "bg-gradient-to-b from-violet-400 to-violet-600",
                  ].join(" ")}
                >
                  {i + 1}
                </span>
              </div>

              {/* 文案（保持原始内容） */}
              <div className="min-w-0">
                <h3 className="whitespace-pre-line text-lg font-semibold text-slate-900">{s.title}</h3>
                {s.descs.length > 0 && (
                  <ul className="mt-2 space-y-1 text-[15px] leading-relaxed text-slate-600">
                    {s.descs.map((d, k) => (
                      <li key={k} className="list-disc pl-4 marker:text-violet-500">
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RightShowcase({ current }: { current: Step }) {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_46px_rgba(17,24,39,.08)]">
        {/* 媒体区：图或对比滑块 */}
        <div className="px-6 pt-6 md:px-8">
          <div className="relative overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
            <div className="relative aspect-[16/10] md:aspect-[4/3]">
              <div className="absolute inset-0">{current.media}</div>
            </div>
          </div>
        </div>

        {/* 文字区（右侧重复展示：一条高亮标题 + 所有描述） */}
        <div className="space-y-3 px-6 py-6 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">HIGHLIGHTS</p>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm">
            <p className="whitespace-pre-line text-[15px] font-semibold">{current.title}</p>
          </div>
          {current.descs.map((d, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm">
              <p className="text-[15px] leading-relaxed">{d}</p>
            </div>
          ))}

          {/* CTA buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[15px] font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Sign up
            </a>
            <a
              href="/console"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 px-4 py-2.5 text-[15px] font-semibold text-white shadow-md ring-1 ring-violet-600/40 transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              Console
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Section export ───────────── */
export default function ImageCompareSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-20" aria-label="Undetectable by design">
      {/* 原『Features』头部保留 */}
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-[#F1EDFF] px-3 py-1 text-xs font-semibold text-[#6F57FF] ring-1 ring-[#E3DDFF]">
          Features
        </span>
        <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#2A2F3A] md:text-5xl">
          Eye Gaze Control
        </h2>
        <p className="mt-3 text-[17px] leading-7 text-slate-600">
          Drag the split slider to compare two states. Sliding left reveals more of the right image.
        </p>
      </header>

      {/* Why-Choose 风格的两列结构（左侧选择项 + 右侧媒体卡） */}
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-10 md:mt-12 md:grid-cols-2 md:gap-12">
        <SelectableSteps steps={STEPS} active={active} onChange={setActive} />
        <RightShowcase current={STEPS[active]} />
      </div>
    </section>
  );
}

/* ───────────── Steps data assembled from ORIGINAL card content ───────────── */
const STEPS: Step[] = [
  {
    title: "Patient Care MeetsSimplicity",
    descs: ["Never shows on the attendee list. No bots, no extra participants."],
    media: (
      <img src={heroImg} alt="Participants list" className="block h-full w-full object-cover" />
    ),
  },
  {
    title: "AAC, Integrated and Ready-to-Go",
    descs: [
      "Left shows your private view; right shows what others see. Drag the handle to compare.",
      "Squidly never shows up in shared screens, recordings, or external meeting tools. Use the handle to see exactly what’s visible to others.",
    ],
    media: (
      <CompareSlider
        leftSrc="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop"
        rightSrc="https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop"
        leftLabel="Squidly"
        rightLabel="Common Webmeeting"
        initial={50}
        ratio="16/9"
      />
    ),
  },
  {
    title: "Say Goodbye to Scheduling Headaches",
    descs: ["Lightweight floating overlay for quick actions. Move or hide it anytime."],
    media: (
      <img src={overlayImg} alt="Floating overlay" className="block h-full w-full object-cover" />
    ),
  },
];
