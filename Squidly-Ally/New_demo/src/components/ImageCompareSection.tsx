import React, { useRef, useState } from "react";
import heroImg from "../Photo/hero-image.png";
import overlayImg from "../Photo/hero-card-2-with-cursor.png";

/* ─ Circle Toggle Button ─ */
function CircleToggle({
  open,
  onClick,
  className = "",
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Collapse" : "Expand"}
      className={`grid h-10 w-10 place-items-center rounded-full bg-[#1c1f2a] text-white shadow-md transition-all hover:scale-[1.03] active:scale-[0.98] ${className}`}
    >
      <span className="text-xl leading-none">{open ? "–" : "+"}</span>
    </button>
  );
}

/* ─ Compare Slider (keeps your behavior) ─ */
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
      <img src={rightSrc} alt="right" className="absolute inset-0 h-full w-full object-cover" />
      <img
        src={leftSrc}
        alt="left"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${rightClip}% 0 0)` }}
      />

      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
        {leftLabel}
      </div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
        {rightLabel}
      </div>

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

/* ─ Generic Feature Card ─ */
function FeatureCard({
  title,
  media,
  children,
  open,
  onToggle,
}: {
  title: React.ReactNode;
  media: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      aria-expanded={open}
      className={[
        "relative rounded-3xl bg-white shadow-[0_18px_46px_rgba(17,24,39,.10)] ring-1 ring-black/5",
        "transition-all duration-300",
        open ? "scale-[1.01]" : "scale-[1.0]",
      ].join(" ")}
    >
      <div className="p-5 md:p-6">
        <div
          className={[
            "rounded-2xl ring-1 ring-black/10 overflow-hidden transition-transform duration-300",
            open ? "scale-[1.02]" : "scale-100",
          ].join(" ")}
        >
          {media}
        </div>

        <h3 className="mt-5 text-[22px] md:text-[24px] font-extrabold tracking-tight text-slate-900">
          {title}
        </h3>

        <div
          className={`mt-3 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-2xl bg-slate-50/70 p-4 ring-1 ring-black/5">
              <div className="space-y-3 text-[15px] leading-7 text-slate-600">{children}</div>
            </div>
          </div>
        </div>

        <CircleToggle open={open} onClick={onToggle} className="absolute bottom-4 right-4" />
      </div>
    </article>
  );
}

/* ─ Section ─ */
export default function ImageCompareSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-20" aria-label="Undetectable by design">
      <header className="mx-auto max-w-3xl text-center">
        {/* 顶部胶囊标签 —— 与 PrivacySection 一致的风格 */}
        <span className="inline-block rounded-full bg-[#F1EDFF] px-3 py-1 text-xs font-semibold text-[#6F57FF] ring-1 ring-[#E3DDFF]">
          Features
        </span>

        {/* 大标题 —— 字重/字号/行高与 PrivacySection 对齐 */}
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#2A2F3A]">
          Eye Gaze Control
        </h2>

        {/* 副标题 —— 与 PrivacySection 一致的字号/颜色 */}
        <p className="mt-3 text-[17px] leading-7 text-slate-600">
          Drag the split slider to compare two states. Sliding left reveals more of the right image.
        </p>
      </header>


      {/* ✅ 改为 flex：每张卡独立决定高度；并在有卡展开时给其余卡加轻微模糊/降不透明 */}
      <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-start">
        {/* Card 1 wrapper：在非激活时添加淡淡的模糊与透明度 */}
        <div
          className={`basis-full md:basis-1/3 transition-all duration-300 ${
            openIdx !== null && openIdx !== 0 ? "blur-[1px] opacity-80" : "blur-0 opacity-100"
          }`}
        >
          <FeatureCard
            title={
              <>
                Patient Care Meets
                <br /> Simplicity
              </>
            }
            media={
              <img
                src={heroImg}
                alt="Participants list"
                className="block h-full w-full object-cover"
                style={{ aspectRatio: "4/3" }}
              />
            }
            open={openIdx === 0}
            onToggle={() => setOpenIdx(openIdx === 0 ? null : 0)}
          >
            <p>Never shows on the attendee list. No bots, no extra participants.</p>
          </FeatureCard>
        </div>

        {/* Card 2 */}
        <div
          className={`basis-full md:basis-1/3 transition-all duration-300 ${
            openIdx !== null && openIdx !== 1 ? "blur-[1px] opacity-80" : "blur-0 opacity-100"
          }`}
        >
          <FeatureCard
            title={
              <>
                AAC, Integrated and 
                <br /> Ready-to-Go
              </>
            }
            media={
              <CompareSlider
                leftSrc="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop"
                rightSrc="https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop"
                leftLabel="Squidly"
                rightLabel="Common Webmeeting"
                initial={50}
                ratio="4/3"
              />
            }
            open={openIdx === 1}
            onToggle={() => setOpenIdx(openIdx === 1 ? null : 1)}
          >
            <p>Left shows your private view; right shows what others see. Drag the handle to compare.</p>
            <p>
              Squidly never shows up in shared screens, recordings, or external meeting tools. Use the handle to see
              exactly what’s visible to others.
            </p>
          </FeatureCard>
        </div>

        {/* Card 3 */}
        <div
          className={`basis-full md:basis-1/3 transition-all duration-300 ${
            openIdx !== null && openIdx !== 2 ? "blur-[1px] opacity-80" : "blur-0 opacity-100"
          }`}
        >
          <FeatureCard
            title={
              <>
                Say Goodbye to Scheduling 
                <br /> Headaches
              </>
            }
            media={
              <img
                src={overlayImg}
                alt="Floating overlay"
                className="block h-full w-full object-cover"
                style={{ aspectRatio: "4/3" }}
              />
            }
            open={openIdx === 2}
            onToggle={() => setOpenIdx(openIdx === 2 ? null : 2)}
          >
            <p>Lightweight floating overlay for quick actions. Move or hide it anytime.</p>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
