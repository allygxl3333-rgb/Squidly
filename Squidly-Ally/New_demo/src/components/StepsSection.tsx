// src/components/StepsSection.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  Volume2,
  Search,
  X,
} from "lucide-react";

// （这里保留 meta 文案，方便左侧列表展示）
export type StepKey = "setup" | "launch" | "communicate";
const STEP_COPY: Record<StepKey, { title: string; bullets: string[] }> = {
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
    bullets: ["Create a session and get a shareable link", "Invite participants with one tap", "Start the call"],
  },
  communicate: {
    title: "Communicate",
    bullets: ["Use the Tool Bar for quick actions", "Eye Gaze pointer & messaging together", "Natural, smooth collaboration"],
  },
};

/* ───────── 进场动画 Variants ───────── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const fromLeft = {
  initial: { opacity: 0, x: -48 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const fromRight = {
  initial: { opacity: 0, x: 48 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
// 列表逐条错峰
const listContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const listItem = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ───────── 左侧可选步骤列表 ───────── */
type StepItem = { title: string; descs: string[] };

function SelectableSteps({
  steps,
  active,
  onChange,
}: {
  steps: StepItem[];
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
  }, []); // eslint-disable-line

  useEffect(() => {
    updateHighlight(active);
  }, [active, steps.length]); // eslint-disable-line

  return (
    <div ref={containerRef} className="relative flex flex-col gap-6" style={{ isolation: "isolate" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 z-0 rounded-2xl border border-violet-200 bg-violet-50/70 shadow-md transition-all duration-300"
        style={{ top: highlight.top, height: highlight.height }}
      />
      {steps.map((s, i) => {
        const activeItem = i === active;
        return (
          <motion.div
            variants={listItem}
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
          </motion.div>
        );
      })}
    </div>
  );
}

/* ───────── 右侧固定 UI 面板（仿截图） ───────── */
function RightPanel() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_46px_rgba(17,24,39,.08)]">
        {/* 顶部条 */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 bg-gradient-to-b from-[#FAFAFF] to-[#F3F1FF] px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-200/80 text-rose-700 ring-1 ring-rose-300">
              <X className="h-3.5 w-3.5" />
            </span>
            <div className="hidden text-sm font-medium text-slate-700 md:block">Board</div>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Search className="h-4 w-4" />
            <Volume2 className="h-4 w-4" />
          </div>
        </div>

        {/* 中间主体：左侧网格 + 右侧视频条 */}
        <div className="grid grid-cols-[1fr,auto] gap-3 px-4 py-4 md:gap-4 md:px-6 md:py-6">
          {/* 左：AAC 网格 */}
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {[
              { t: "Yes", c: "from-emerald-300 to-emerald-500" },
              { t: "No", c: "from-rose-300 to-rose-500" },
              { t: "Help", c: "from-amber-300 to-amber-500" },
              { t: "More", c: "from-violet-300 to-violet-500" },
              { t: "Drink", c: "from-sky-300 to-sky-500" },
              { t: "Eat", c: "from-orange-300 to-orange-500" },
              { t: "Toilet", c: "from-blue-300 to-blue-500" },
              { t: "Home", c: "from-pink-300 to-pink-500" },
              { t: "Happy", c: "from-lime-300 to-lime-500" },
              { t: "Sad", c: "from-indigo-300 to-indigo-500" },
              { t: "Like", c: "from-teal-300 to-teal-500" },
              { t: "Dislike", c: "from-fuchsia-300 to-fuchsia-500" },
              { t: "Nurse", c: "from-cyan-300 to-cyan-500" },
              { t: "Clean", c: "from-stone-300 to-stone-500" },
              { t: "Call", c: "from-slate-300 to-slate-500" },
              { t: "More…", c: "from-purple-300 to-purple-500" },
            ].map((b, i) => (
              <button
                key={i}
                className={[
                  "aspect-square rounded-xl p-2 text-[13px] font-semibold text-white shadow ring-1 ring-black/10",
                  "bg-gradient-to-br",
                  b.c,
                ].join(" ")}
              >
                {b.t}
              </button>
            ))}
          </div>

          {/* 右：视频竖条 */}
          <div className="flex w-[120px] shrink-0 flex-col gap-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="relative h-[120px] overflow-hidden rounded-xl ring-1 ring-slate-200"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(180deg,#fde1e8, #ffffff)"
                      : "linear-gradient(180deg,#e0e7ff, #ffffff)",
                }}
              >
                <div className="absolute inset-0 grid place-items-center text-sm font-medium text-slate-600/80">
                  {i === 0 ? "Dallas (host)" : "Visitor"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部按钮条：Sign in + Console */}
        <div className="flex items-center gap-3 border-t border-slate-200 px-4 py-3 md:px-6 md:py-4">
          <button
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#6F72FF] px-4 py-2.5 text-sm font-bold text-white shadow-sm ring-1 ring-[#5E61E6] transition hover:brightness-105 active:brightness-95"
          >
            Sign in
          </button>
          <button
            className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#6F72FF] ring-1 ring-[#CFCBFF] transition hover:bg-[#F8F7FF]"
          >
            Console
          </button>
        </div>
      </div>

      {/* 右下角小提示气泡（可选） */}
      <div className="pointer-events-none absolute -bottom-4 right-6 hidden md:block">
        <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs text-slate-700 ring-1 ring-violet-200 shadow">
          <MessageSquareText className="h-4 w-4 text-violet-700" />
          Eye-gaze & messages work together
        </div>
      </div>
    </div>
  );
}

/* ───────── Section（左列表 + 右侧固定面板 + 进场动画） ───────── */
export default function StepsSection(): JSX.Element {
  const order: StepKey[] = ["setup", "launch", "communicate"];
  const [active, setActive] = useState<number>(0);

  // 左列数据
  const steps: StepItem[] = order.map<StepItem>((key) => ({
    title: STEP_COPY[key].title,
    descs: STEP_COPY[key].bullets,
  }));

  return (
    <motion.section
      className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-20"
      aria-label="Steps to setup"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.32 }} // 视口 32% 触发一次
    >
      {/* 头部：自上而下淡入 */}
      <motion.header className="mx-auto max-w-3xl" variants={fadeUp}>
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#2A2F3A] md:text-5xl">Steps to setup</h2>
      </motion.header>

      {/* 主体：左从左进入 + 右从右进入 */}
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-10 md:mt-12 md:grid-cols-2 md:gap-12">
        <motion.div variants={fromLeft} className="min-w-0">
          <motion.div variants={listContainer}>
            <SelectableSteps steps={steps} active={active} onChange={setActive} />
          </motion.div>
        </motion.div>

        <motion.div variants={fromRight} className="min-w-0">
          <RightPanel />
        </motion.div>
      </div>
    </motion.section>
  );
}
