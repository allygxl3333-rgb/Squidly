import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ===== Use images/text from your Why-Choose section =====
// Replace/extend these imports to match your actual WhyChoose assets
// 右侧对应的三张图片（用你的真实文件名）
import imgVoice from "../Photo/why-voice.jpg";
import imgCare from "../Photo/why-care.png";
import imgAI from "../Photo/why-ai.png";

// If your Why Choose has a third distinct image, import it here and update MEDIA[2]
// import thirdImg from "../Photo/why-choose-3.png";

// ===== Content pulled from your earlier Why-Choose copy (you can edit freely) =====
const ITEMS: { title: string; bullets: string[] }[] = [
  {
    title: "Video Calls for Every Voice",
    bullets: [
      "Built to make communication extraordinarily inclusive, Squidly is the best way to make accessible video calls.",
    ],
  },
  {
    title: "Patient Care Meets Simplicity",
    bullets: [
      "Designed alongside clinicians and users, Squidly makes remote sessions effective and accessible.",
    ],
  },
  {
    title: "Frontier Intelligence",
    bullets: [
      "Powered by a mix of purpose-built and frontier AI models, Squidly is smart and fast.",
    ],
  },
];

const MEDIA: React.ReactNode[] = [
  <img key="m0" src={imgVoice} alt="Why choose — item 1" className="block h-auto w-full object-cover" />,
  <img key="m1" src={imgCare} alt="Why choose — item 2" className="block h-auto w-full object-cover" />,
  // thirdImg ? <img key="m2" src={thirdImg} .../> :
  <img key="m2" src={imgAI} alt="Why choose — item 3" className="block h-auto w-full object-cover" />,
];

const ACCENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-indigo-500 to-violet-500",
  "from-emerald-500 to-teal-500",
];

export default function WhyChooseSquidlySection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-20 lg:py-28" aria-label="Why choose Squidly">
      <div className="grid items-start gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
        {/* Left: Steps-style vertical list */}
        <div>
          <h2 className="mb-8 text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-[#7A5CFF]">
            Why choose
            <span className="ml-2 text-slate-900">Squidly</span>
          </h2>

          <ol className="relative">
            {ITEMS.map((s, idx) => {
              const isActive = active === idx;
              return (
                <li key={idx} className="relative">
                  <button
                    type="button"
                    onClick={() => setActive(idx)}
                    className={[
                      "flex w-full items-center gap-4 py-4 transition-colors",
                      "text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F57FF]/40 rounded-md",
                      isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "grid h-9 w-9 place-items-center rounded-full text-white text-[13px] font-semibold",
                        "bg-gradient-to-br",
                        ACCENTS[idx % ACCENTS.length],
                        "shadow-[0_8px_18px_rgba(122,59,255,.15)]",
                      ].join(" ")}
                    >
                      {idx + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="text-[20px] font-semibold leading-none whitespace-pre-line">{s.title}</div>
                      <div
                        className={[
                          "mt-2 h-[4px] w-24 rounded-full",
                          isActive ? `bg-gradient-to-r ${ACCENTS[idx % ACCENTS.length]}` : "bg-slate-200/70",
                        ].join(" ")}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key={`panel-${idx}`}
                        initial={{ height: 0, opacity: 0, y: -6 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -6 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pl-[52px] pr-2 pb-6">
                          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#F1EDFF] px-3 py-1 text-xs font-semibold text-[#6F57FF] ring-1 ring-[#E3DDFF]">
                            REASON {idx + 1}
                          </div>
                          <ul className="space-y-2 text-[16px] text-slate-800">
                            {s.bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-[9px] inline-block h-[6px] w-[6px] rounded-full bg-slate-400/80" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {idx < ITEMS.length - 1 && (
                    <div className="my-1 h-px w-full bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Right: Single media panel that switches with active item */}
        <div className="relative self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={`media-${active}`}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mx-auto w-full max-w-[650px]"
            >
              <figure className="overflow-hidden rounded-[24px] bg-white ring-1 ring-violet-200 shadow-[0_30px_80px_rgba(122,59,255,.12)]">
                {MEDIA[active]}
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
