import React, { useRef, useState } from "react";
import heroImg from "../Photo/hero-image.png";
import overlayImg from "../Photo/hero-card-2-with-cursor.png";
/**
 * ImageCompareSection.tsx (full‑bleed, 3 wide columns)
 * – Section stretches edge‑to‑edge (full‑bleed)
 * – Three large cards sit side‑by‑side on desktop
 * – Card size scales with viewport width using aspect‑ratio
 */
// 复用在每个卡片里的浏览器顶栏
import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Globe,
  Lock,
  Star,
} from "lucide-react";

/** 顶栏（放在卡片容器内部，绝对定位在顶部） */
function BrowserTopBar({ url = "squidly.app/#demo" }: { url?: string }) {
  return (
    <div className="absolute left-0 right-0 top-0 z-20 h-14 rounded-t-3xl border-b border-slate-900/10 bg-gradient-to-b from-white to-slate-50/70 px-3">
      <div className="flex h-full items-center gap-2">
        <div className="mr-2 flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <button className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:bg-slate-900/5">
          <ChevronLeft size={14} />
        </button>
        <button className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:bg-slate-900/5">
          <ChevronRight size={14} />
        </button>
        <button className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:bg-slate-900/5">
          <RefreshCcw size={14} />
        </button>

        <div className="ml-1 flex h-9 flex-1 items-center gap-2 rounded-full border border-slate-900/10 bg-white px-3 shadow-inner">
          <Globe size={14} className="text-slate-500" />
          <span className="truncate text-[12px] font-semibold text-slate-900 sm:text-[13px]">
            {url}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Lock size={14} className="text-emerald-500" />
            <Star size={14} className="text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImageCompareSection() {
  return (
    <section className="relative full-bleed py-16 overflow-x-hidden" aria-label="Feature trio section">
      {/* full‑bleed helper */}
      <style>{`.full-bleed{position:relative;width:100dvw;margin-left:calc(50% - 50dvw);margin-right:calc(50% - 50dvw)}@supports not (width:100dvw){.full-bleed{width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw)}}`}</style>

      <div className="mx-auto w-full px-4 md:px-12 xl:px-20">
        {/* Heading */}
        <h2 className="mb-4 text-center text-3xl md:text-4xl font-semibold text-slate-800">
          Invisible to screen share
        </h2>
        <p className="mx-auto mb-10 max-w-4xl text-center text-slate-600">
          Drag the split slider to compare two states. Sliding left reveals more of the right image.
        </p>

        {/* 3 columns that grow with viewport */}
        <div className="grid grid-cols-12 items-start gap-6 md:gap-8 xl:gap-10">
          <div className="col-span-12 md:col-span-4">
            <ShowcaseCard
              ratio="4/3"
              src={heroImg}
              alt="Participants list"
              line1="Never joins your meetings or appears on the attendee list."
              line2="No bots, no extra participants."
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <CompareSlider
              leftSrc="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop"
              rightSrc="https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop"
              leftLabel="Squidly"
              rightLabel="Common Webmeeting"
              initial={50}
              ratio="4/3"
              line1="Left shows your private view; right shows what others see."
              line2="Drag the handle to compare."
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <ShowcaseCard
              ratio="4/3"
              src={overlayImg}
              alt="Floating overlay"
              line1="Lightweight floating overlay for quick actions."
              line2="Move or hide it anytime."
            />
          </div>
        </div>

      </div>
    </section>
  );
}






function ShowcaseCard({
  src,
  alt = "",
  ratio = "16/10",
  className = "",
  url = "squidly.app/#preview",
  title,
  line1,
  line2,
}: {
  src: string;
  alt?: string;
  ratio?: `${number}/${number}` | string;
  className?: string;
  url?: string;
  title?: string;
  line1?: string;
  line2?: string;
}) {
  return (
    <figure>
      <div
        className={`relative select-none overflow-hidden rounded-3xl bg-white shadow-md ${className}`}
        style={{ aspectRatio: ratio }}
      >
        {/* 顶栏 */}
        <BrowserTopBar url={url} />

        {/* 顶栏下的“外框” */}
        <div className="absolute inset-x-0 bottom-0 top-14 p-2 sm:p-3">
          <div className="h-full w-full overflow-hidden rounded-2xl bg-white/90 ring-1 ring-slate-900/10 shadow-[0_8px_24px_rgba(16,24,40,0.06)]">
            <img src={src} alt={alt} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* 外壳描边 */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10" />
      </div>

      {(title || line1 || line2) && (
        <figcaption className="mt-4 text-center">
          {/* 如果有 title 也想同样样式，就一起用同样的类名 */}
          {title && (
            <div className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
              {title}
            </div>
          )}
          {line1 && (
            <p className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
              {line1}
            </p>
          )}
          {line2 && (
            <p className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
              {line2}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}






export function CompareSlider({
  leftSrc,
  rightSrc,
  leftLabel = "Left",
  rightLabel = "Right",
  initial = 50,
  ratio = "16/10",
  className = "",
  url = "squidly.app/#compare",
  title,
  line1,
  line2,
}: {
  leftSrc: string;
  rightSrc: string;
  leftLabel?: string;
  rightLabel?: string;
  initial?: number;
  ratio?: `${number}/${number}` | string;
  className?: string;
  url?: string;
  title?: string;
  line1?: string;
  line2?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const [pos, setPos] = useState<number>(clamp(initial));
  const [drag, setDrag] = useState(false);

  const setFromClientX = (clientX: number) => {
    const el = ref.current; if (!el) return;
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
    <figure>
      <div
        className={`relative select-none overflow-hidden rounded-3xl bg-white shadow-md ${className}`}
        style={{ aspectRatio: ratio }}
      >
        {/* 顶栏 */}
        <BrowserTopBar url={url} />

        {/* 顶栏下的“外框”；滑块内容放在内框的绝对层里 */}
        <div className="absolute inset-x-0 bottom-0 top-14 p-2 sm:p-3">
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/90 ring-1 ring-slate-900/10 shadow-[0_8px_24px_rgba(16,24,40,0.06)]">
            <div
              ref={ref}
              className="absolute inset-0 touch-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
            >
              {/* 右图 */}
              <img src={rightSrc} alt="right" className="absolute inset-0 h-full w-full object-cover" />
              {/* 左图裁切 */}
              <img
                src={leftSrc}
                alt="left"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ clipPath: `inset(0 ${rightClip}% 0 0)` }}
              />

              {/* 标签（自然在顶栏下方） */}
              <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
                {leftLabel}
              </div>
              <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
                {rightLabel}
              </div>

              {/* 中线 + 拖拽把手 */}
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
                  if (e.key === 'ArrowLeft') setPos((p) => clamp(p - 2));
                  if (e.key === 'ArrowRight') setPos((p) => clamp(p + 2));
                  if (e.key === 'Home') setPos(0);
                  if (e.key === 'End') setPos(100);
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700"><path d="M15 18l-6-6 6-6"/></svg>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="-ml-1 text-slate-700"><path d="M9 6l6 6-6 6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 外壳描边 */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10" />
      </div>

      {(title || line1 || line2) && (
        <figcaption className="mt-4 text-center">
          {/* 如果有 title 也想同样样式，就一起用同样的类名 */}
          {title && (
            <div className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
              {title}
            </div>
          )}
          {line1 && (
            <p className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
              {line1}
            </p>
          )}
          {line2 && (
            <p className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
              {line2}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}
