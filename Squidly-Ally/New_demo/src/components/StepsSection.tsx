import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageSquareText,
  MonitorSmartphone,
  Link as LinkIcon,
  UserPlus,
  Mic,
  Video,
  ScreenShare,
  PhoneOff,
  Settings as Cog,
} from "lucide-react";

// ===== Step original images (Setup uses a real image; Launch/Communicate are code-rendered) =====
import setupImg from "../Photo/Setup.jpg";

// ===== Step meta (copy unchanged) =====
export type StepKey = "setup" | "launch" | "communicate";
const ORDER: Record<StepKey, number> = { setup: 1, launch: 2, communicate: 3 };
const STEPS: Record<StepKey, { title: string; bullets: string[] }> = {
  setup: {
    title: "Setup",
    bullets: [
      "Create an account or sign in",
      "Choose a mode: Eye Gaze / Tool Bar / Schedule",
      "Quick preferences: camera, mic, accessibility",
    ],
  },
  launch: {
    title: "Launch",
    bullets: [
      "Create a session and get a shareable link",
      "Invite participants with one tap",
      "Start the call",
    ],
  },
  communicate: {
    title: "Communicate",
    bullets: [
      "Use the Tool Bar for quick actions",
      "Eye Gaze pointer & messaging together",
      "Natural, smooth collaboration",
    ],
  },
};

/* ─ Circle Toggle Button (inherit original behavior) ─ */
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

/* ─ Device frame and screens (code-rendered visuals for Launch/Communicate) ─ */
function DeviceFrame({ children, stepNo }: { children: React.ReactNode; stepNo: number }) {
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="relative rounded-[2.1rem] bg-gradient-to-br from-white via-violet-100 to-white p-[1px]">
        <div className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-violet-200">
          <div className="flex h-12 items-center justify-between gap-2 border-b border-violet-200/60 bg-violet-50 px-4">
            <div className="flex items-center gap-2 text-neutral-700">
              <MonitorSmartphone className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium">squidly.com.au/#home-page</span>
            </div>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
              STEP {stepNo}
            </span>
          </div>
          <div className="relative h-[560px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ScreenLaunch() {
  return (
    <div className="absolute inset-0 p-6">
      <div
        className="absolute inset-0 rounded-[1.75rem]"
        style={{
          background:
            "radial-gradient(60% 55% at 65% 0%, rgba(99,102,241,.18), transparent 60%), radial-gradient(60% 50% at 20% 85%, rgba(168,85,247,.16), transparent 65%)",
        }}
      />
      <div className="relative flex h-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white/90 p-4 ring-1 ring-violet-200">
            <div className="flex items-center gap-2 font-medium text-neutral-800">
              <LinkIcon className="h-4 w-4 text-violet-600" />
              Share link
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm ring-1 ring-violet-200">
              <span className="truncate text-neutral-800">https://squidly.com/s/abc-123</span>
              <button className="ml-auto rounded-md bg-white px-2 py-1 text-xs text-violet-700 ring-1 ring-violet-200">
                Copy
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-white/90 p-4 ring-1 ring-violet-200">
            <div className="flex items-center gap-2 font-medium text-neutral-800">
              <UserPlus className="h-4 w-4 text-violet-600" />
              Invite teammates
            </div>
            <div className="mt-3 flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 ring-2 ring-white/70" />
              ))}
              <button className="ml-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="grid flex-1 place-items-center">
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="group inline-flex items-center gap-4 rounded-[22px] bg-white px-6 py-4 shadow-[0_10px_28px_rgba(0,0,0,.06)] ring-1 ring-black/5 transition-all duration-200">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#6F72FF] shadow-[inset_0_-2px_8px_rgba(0,0,0,.08)]" aria-hidden="true">
              <Video className="h-6 w-6 text-white" />
            </span>
            <span className="text-[18px] font-extrabold tracking-wide text-[#2A2F3A]">HOST MEETING</span>
          </motion.button>
        </div>
        <div className="rounded-xl bg-white/90 p-4 ring-1 ring-violet-200">
          <div className="font-medium text-neutral-800">Quick preferences</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Cam", "Mic", "Subtitles"].map((t) => (
              <button key={t} className="rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-700 ring-1 ring-violet-200">
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenCommunicate() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="grid flex-1 grid-cols-1 gap-3 p-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#d9d6ff] to-white ring-1 ring-violet-200">
          <div className="absolute inset-0 grid place-items-center font-medium text-neutral-700/70">Host video</div>
          <div className="absolute bottom-3 left-3 rounded-md bg-white/85 px-2 py-1 text-xs ring-1 ring-violet-200">host</div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#e8f8f2] to-white ring-1 ring-violet-200">
          <div className="absolute inset-0 grid place-items-center font-medium text-neutral-700/70">Participant</div>
          <div className="absolute bottom-3 left-3 rounded-md bg-white/85 px-2 py-1 text-xs ring-1 ring-violet-200">participant</div>
        </div>
      </div>
      <div className="bg-white/85 p-3 ring-1 ring-violet-200 backdrop-blur">
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "camera", Icon: Video },
            { label: "mic", Icon: Mic, active: true },
            { label: "share", Icon: ScreenShare },
            { label: "settings", Icon: Cog },
            { label: "end", Icon: PhoneOff },
          ].map(({ label, Icon, active }) => (
            <button
              key={label}
              className={[
                "flex h-16 w-full flex-col items-center justify-center gap-1 rounded-xl ring-1 text-sm",
                active
                  ? "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white ring-emerald-300/40 shadow-[0_10px_24px_rgba(16,185,129,.25)]"
                  : "bg-white text-neutral-800 ring-violet-200",
              ].join(" ")}
            >
              <Icon className={active ? "h-5 w-5 text-white" : "h-5 w-5 text-violet-600"} />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-24 right-4 flex items-center gap-2">
        <div className="rounded-full bg-violet-100 p-2 ring-1 ring-violet-200">
          <MessageSquareText className="h-4 w-4 text-violet-700" />
        </div>
        <div className="max-w-[240px] rounded-2xl bg-white px-3 py-2 text-sm text-neutral-800 ring-1 ring-violet-200">
          Messages and eye-gaze pointer work together.
        </div>
      </div>
    </div>
  );
}

/* ─ Feature Card (same interactions as original) ─ */
function FeatureCard({
  title,
  media,
  children,
  open,
  onToggle,
  dimmed,
  onHoverOpen,
  layoutId,
}: {
  title: React.ReactNode;
  media: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  dimmed?: boolean;
  onHoverOpen?: () => void; // trigger overlay enlarge on hover
  layoutId: string; // for shared layout animation
}) {
  return (
    <article
      aria-expanded={open}
      className={[
        "relative rounded-3xl bg-white shadow-[0_18px_46px_rgba(17,24,39,.10)] ring-1 ring-black/5",
        "transition-all duration-300",
        open ? "scale-[1.01]" : "scale-[1.0]",
        dimmed ? "opacity-80 blur-[1px]" : "opacity-100 blur-0",
      ].join(" ")}
    >
      <div className="p-5 md:p-6">
        <motion.div
          layoutId={layoutId}
          className="overflow-hidden rounded-2xl ring-1 ring-black/10"
          onMouseEnter={onHoverOpen}
        >
          {media}
        </motion.div>

        <h3 className="mt-5 text-[22px] md:text-[24px] font-extrabold tracking-tight text-slate-900">{title}</h3>

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

/* ─ Media blocks for cards and overlay ─ */
function CardMedia({ step }: { step: StepKey }) {
  if (step === "setup") {
    return (
      <img
        src={setupImg}
        alt="Setup preview"
        className="block h-full w-full object-cover"
        style={{ aspectRatio: "4/3" }}
      />
    );
  }
  return (
    <div className="relative" style={{ aspectRatio: "4/3" }}>
      <div className="absolute inset-0 scale-[.78] md:scale-[.9]">
        <DeviceFrame stepNo={ORDER[step]}>
          {step === "launch" ? <ScreenLaunch /> : <ScreenCommunicate />}
        </DeviceFrame>
      </div>
    </div>
  );
}

function OverlayMedia({ step }: { step: StepKey }) {
  if (step === "setup") {
    return (
      <img
        src={setupImg}
        alt="Setup large"
        className="block h-full w-full rounded-2xl object-cover"
        style={{ aspectRatio: "16/9" }}
      />
    );
  }
  return (
    <div className="relative" style={{ aspectRatio: "16/9" }}>
      <div className="absolute inset-0">
        <DeviceFrame stepNo={ORDER[step]}>
          {step === "launch" ? <ScreenLaunch /> : <ScreenCommunicate />}
        </DeviceFrame>
      </div>
    </div>
  );
}

/* ─ Section: 3 images (no compare) + hover-to-enlarge for ALL three ─ */
export default function StepsSection() {
  const order: StepKey[] = ["setup", "launch", "communicate"];
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null); // 0/1/2 or null

  // 锁滚动与事件拦截（与原交互一致）
  useEffect(() => {
    const active = expandedIdx !== null;
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const prevent = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
    };
  }, [expandedIdx]);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-20" aria-label="Steps">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-[#F1EDFF] px-3 py-1 text-xs font-semibold text-[#6F57FF] ring-1 ring-[#E3DDFF]">
          Steps
        </span>
        <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#2A2F3A] md:text-5xl">
          Three simple ways to get started
        </h2>
        <p className="mt-3 text-[17px] leading-7 text-slate-600">Hover any card to enlarge. Click + for details.</p>
      </header>

      <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-start">
        {order.map((k, idx) => (
          <div key={k} className="basis-full transition-all duration-300 md:basis-1/3">
            <FeatureCard
              title={<>{STEPS[k].title}</>}
              media={<CardMedia step={k} />}
              open={openIdx === idx}
              onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
              dimmed={openIdx !== null && openIdx !== idx}
              onHoverOpen={() => setExpandedIdx(idx)}
              layoutId={`steps-enlarge-media-${idx}`}
            >
              {STEPS[k].bullets.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </FeatureCard>
          </div>
        ))}
      </div>

      {/* 放大层：三张图片都支持；Launch/Communicate 使用代码渲染的设备框 */}
      <AnimatePresence>
        {expandedIdx !== null && (
          <motion.div key="steps-overlay" className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setExpandedIdx(null)} />
            <div className="relative z-[80] flex h-full items-start justify-center px-4 pt-[14vh]">
              <motion.div
                layoutId={`steps-enlarge-media-${expandedIdx}`}
                className="w-[min(1200px,96vw)] rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/10"
                onMouseLeave={() => setExpandedIdx(null)}
                initial={{ opacity: 0.98, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.98, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                <OverlayContent step={order[expandedIdx]} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function OverlayContent({ step }: { step: StepKey }) {
  return (
    <div className="relative">
      <OverlayMedia step={step} />
    </div>
  );
}
