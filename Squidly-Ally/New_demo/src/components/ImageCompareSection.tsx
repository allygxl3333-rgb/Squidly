import React, { useRef, useState } from "react";

// === 你原来的本地资源（保持不变） ===
import heroImg from "../Photo/hero-image.png";
import overlayImg from "../Photo/hero-card-2-with-cursor.png";

/* ───────── CompareSlider（中间把手左右对比，互不影响外层拖动） ───────── */
type CompareSliderProps = {
  leftSrc: string;
  rightSrc: string;
  leftLabel?: string;
  rightLabel?: string;
  initial?: number;
  ratio?: `${number}/${number}` | string;
  className?: string;
};

function CompareSlider({
  leftSrc,
  rightSrc,
  leftLabel = "Left",
  rightLabel = "Right",
  initial = 50,
  ratio = "16/9",
  className = "",
}: CompareSliderProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<number>(initial);
  const [drag, setDrag] = useState<boolean>(false);
  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width);
    setPos(clamp((x / r.width) * 100));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDrag(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag && (e.buttons & 1) === 0) return;
    setFromClientX(e.clientX);
  };
  const endDrag = () => setDrag(false);

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
      <img src={rightSrc} alt="right" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
      {/* 左图（裁切） */}
      <img
        src={leftSrc}
        alt="left"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
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
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
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

/* ───────── 3 卡片横向滚动（丝滑拖动 + 惯性；无自动吸附） ───────── */

type Step = {
  title: string;
  caption: string;
  media: React.ReactNode;
};

const STEPS: Step[] = [
  {
    title: "Patient Care Meets Simplicity",
    caption: "Never shows on attendee list. No extra participants.",
    media: <img src={heroImg} alt="participants" className="block h-full w-full object-cover pointer-events-none" />,
  },
  {
    title: "AAC, Integrated and Ready-to-Go",
    caption: "Swipe left for private view; right for public view",
    media: (
      <CompareSlider
        leftSrc="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop"
        rightSrc="https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop"
        leftLabel="Squidly"
        rightLabel="Common webmeeting"
        initial={50}
        ratio="16/9"
      />
    ),
  },
  {
    title: "Say Goodbye to Scheduling Headaches",
    caption: "Quick actions overlay you can move or hide anytime.",
    media: <img src={overlayImg} alt="overlay" className="block h-full w-full object-cover pointer-events-none" />,
  },
];

// —— 隐藏滚动条（Firefox/Chrome/Safari/旧 Edge 全覆盖）——
const HIDE_SCROLLBAR_CSS = `
  [data-no-scrollbar]{
    scrollbar-width: none;        /* Firefox */
    -ms-overflow-style: none;     /* IE/Edge legacy */
  }
  [data-no-scrollbar]::-webkit-scrollbar{ /* Chrome/Safari */
    display: none;
    width: 0;
    height: 0;
  }
`;

export default function ImageCompareSection(): JSX.Element {
  const railRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const [kinetic, setKinetic] = useState<boolean>(false);

  // 拖动/惯性状态
  const dragRef = useRef<{
    down: boolean;
    startX: number;
    startLeft: number;
    targetLeft: number;
    lastX: number;
    lastT: number;
    vx: number; // px/ms
    raf: number | 0;
    kinetic: boolean;
  }>({
    down: false,
    startX: 0,
    startLeft: 0,
    targetLeft: 0,
    lastX: 0,
    lastT: 0,
    vx: 0,
    raf: 0,
    kinetic: false,
  });

  const cardStep = (): number => {
    const el = firstCardRef.current;
    if (!el) return 0;
    const gap = 24; // gap-6
    return el.offsetWidth + gap;
  };

  // 动画循环：拖动时直接跟随 targetLeft；松手后根据 vx 做惯性并衰减
  const animate = () => {
    const rail = railRef.current;
    if (!rail) return;

    const now = performance.now();
    const state = dragRef.current;

    const cur = rail.scrollLeft;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);

    if (state.down) {
      rail.scrollLeft = Math.min(max, Math.max(0, state.targetLeft)); // 直接跟随
      state.raf = requestAnimationFrame(animate);
      return;
    }

    if (state.kinetic) {
      const dt = Math.max(1, now - state.lastT); // ms
      state.lastT = now;
      const next = cur - state.vx * dt;
      rail.scrollLeft = Math.min(max, Math.max(0, next));
      const c = 0.004; // 阻尼（越大停得越快）
      state.vx *= Math.exp(-c * dt);

      if (Math.abs(state.vx) > 0.02 && rail.scrollLeft > 0 && rail.scrollLeft < max) {
        state.raf = requestAnimationFrame(animate);
      } else {
        state.kinetic = false;
        state.raf = 0;
        setKinetic(false);
        // 不自动吸附
      }
      return;
    }

    state.raf = 0;
  };

  const ensureRAF = () => {
    if (!dragRef.current.raf) dragRef.current.raf = requestAnimationFrame(animate);
  };

  const go = (to: number) => {
    const rail = railRef.current;
    const stepW = cardStep();
    if (!rail || !stepW) return;
    const next = Math.max(0, Math.min(STEPS.length - 1, to));
    rail.scrollTo({ left: next * stepW, behavior: "smooth" });
    setIndex(next);
  };
  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const rail = e.currentTarget;
    const stepW = cardStep();
    if (!stepW) return;
    setIndex(Math.round(rail.scrollLeft / stepW));
  };

  // 允许把整个 section 当作“拖拽区”
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;

    if (dragRef.current.raf) cancelAnimationFrame(dragRef.current.raf);

    setDragging(true);
    setKinetic(false);

    const x = e.clientX;
    dragRef.current = {
      ...dragRef.current,
      down: true,
      startX: x,
      startLeft: rail.scrollLeft,
      targetLeft: rail.scrollLeft,
      lastX: x,
      lastT: performance.now(),
      vx: 0,
      raf: 0,
      kinetic: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

    ensureRAF();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const s = dragRef.current;
    if (!rail || !s.down) return;

    e.preventDefault();

    const now = performance.now();
    const dx = e.clientX - s.startX; // 鼠标往哪边，内容就往哪边（左移鼠标→向右滚）

    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    s.targetLeft = Math.min(max, Math.max(0, s.startLeft - dx));

    // 速度（仅用于惯性阶段），拖动时直接跟随
    const instVx = (e.clientX - s.lastX) / Math.max(1, now - s.lastT); // px/ms
    s.vx = s.vx * 0.7 + instVx * 0.3;

    s.lastX = e.clientX;
    s.lastT = now;

    ensureRAF();
  };

  const onPointerUp = () => {
    const rail = railRef.current;
    const s = dragRef.current;
    if (!rail) return;

    setDragging(false);
    s.down = false;

    // 惯性阶段
    const vx = Math.max(-1.6, Math.min(1.6, s.vx));
    if (Math.abs(vx) > 0.05) {
      s.vx = vx;
      s.kinetic = true;
      s.lastT = performance.now();
      setKinetic(true);
      ensureRAF();
    } else {
      setKinetic(false);
      // 不自动吸附
    }
  };

  // 鼠标滚轮（纵向→横向）
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    e.preventDefault();
    const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.9;
    rail.scrollBy({ left: delta, behavior: "auto" });
  };

  return (
    // full-bleed
    <section
      className="relative w-screen py-16 md:py-20"
      style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      aria-label="Invisible to screen share"
    >
      {/* 注入隐藏滚动条的样式 */}
      <style>{HIDE_SCROLLBAR_CSS}</style>

      {/* 头部 */}
      <header className="mx-auto max-w-3xl px-6 text-center select-none">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#2A2F3A] md:text-5xl">
          Invisible to screen share
        </h2>
        <p className="mt-3 text-[17px] leading-7 text-slate-600">
          Designed alongside clinicians and users, Squidly makes remote sessions effective and accessible.
        </p>
      </header>

      {/* 轨道 */}
      <div className="relative mt-8 md:mt-10">
        <div
          ref={railRef}
          data-no-scrollbar
          className={[
            "flex gap-6 overflow-x-auto pb-4 px-6 md:px-10 select-none",
            dragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "none", // ★ 完全由我们接管指针事件，拖动更稳定
            // 拖拽/惯性阶段禁用 smooth，避免回拽；其他阶段开启 smooth 提升体验
            scrollBehavior: dragging || kinetic ? "auto" : "smooth",
          }}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onWheel={onWheel}
        >
          {STEPS.map((s, i) => (
            <div
              key={i}
              ref={i === 0 ? firstCardRef : undefined}
              className="flex-none w-[85vw] sm:w-[78vw] md:w-[62vw] lg:w-[48vw] xl:w-[42vw] 2xl:w-[38vw]"
            >
              <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_46px_rgba(17,24,39,.08)]">
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200">
                    <div className="relative aspect-[16/10] md:aspect-[16/9]">
                      <div className="absolute inset-0">{s.media}</div>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-center text-[15px] font-semibold text-slate-800">{s.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 左右箭头 */}
        <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 hidden md:block">
          <button
            onClick={prev}
            className="pointer-events-auto rounded-full bg-white/95 p-2 shadow ring-1 ring-slate-200 transition hover:bg-white"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden md:block">
          <button
            onClick={next}
            className="pointer-events-auto rounded-full bg-white/95 p-2 shadow ring-1 ring-slate-200 transition hover:bg-white"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 底部紫色圆点（保留） */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to card ${i + 1}`}
              className={[
                "h-2.5 rounded-full transition-all",
                i === index ? "w-6 bg-violet-600" : "w-2.5 bg-slate-300 hover:bg-slate-400",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
