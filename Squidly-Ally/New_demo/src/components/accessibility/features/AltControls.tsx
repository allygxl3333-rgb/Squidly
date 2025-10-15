"use client";
import React from "react";
import { MousePointer } from "lucide-react";
import { useAcc } from "../AccProvider";

export default function AltControls() {
  const { state, setState } = useAcc();
  return (
    <section className="rounded-xl border border-slate-300 p-3 bg-white/80">
      <div className="flex items-center gap-2 text-slate-950 font-medium">
        <MousePointer className="h-[18px] w-[18px] text-violet-700" />
        Alt tooltip for images
        <button
          onClick={() => setState((s)=>({ ...s, altTooltip: !s.altTooltip }))}
          role="switch"
          aria-checked={state.altTooltip}
          className={`ml-auto relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${state.altTooltip ? "bg-violet-700" : "bg-slate-400"}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${state.altTooltip ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      <p className="text-[12.5px] text-slate-600 leading-5 mt-1">
        将 <code>alt</code> 内容显示为浏览器悬浮提示；缺失 alt 的图片会以红色虚线边框高亮，方便开发时修正。
      </p>
    </section>
  );
}
