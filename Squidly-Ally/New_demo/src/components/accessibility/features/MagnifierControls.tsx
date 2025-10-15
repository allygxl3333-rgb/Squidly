"use client";
import React from "react";
import { Search, Plus, Minus } from "lucide-react";
import { useAcc } from "../AccProvider";

export default function MagnifierControls() {
  const { state, setState, setMagScale } = useAcc();

  return (
    <section className="rounded-xl border border-slate-300 p-3 bg-white/80">
      <div className="flex items-center gap-2 text-slate-950 font-medium">
        <Search className="h-[18px] w-[18px] text-violet-700" />
        Magnifier (cursor-centric)
        <button
          onClick={() => setState((s)=>({ ...s, magnifier: !s.magnifier }))}
          role="switch"
          aria-checked={state.magnifier}
          className={`ml-auto relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${state.magnifier ? "bg-violet-700" : "bg-slate-400"}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${state.magnifier ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      <p className="text-[12.5px] text-slate-600 leading-5 mt-1">鼠标跟随圆形镜头（Alt+M）。下方可调整放大倍率。</p>
      <div className="mt-2 flex items-center gap-2">
        <button
          className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
          aria-label="Decrease magnifier zoom"
          onClick={() => setMagScale(-1)}
          disabled={!state.magnifier}
        >
          <Minus className="h-[16px] w-[16px]" />
        </button>
        <div className="text-[12.5px] text-slate-600 select-none">{state.magScale.toFixed(1)}×</div>
        <button
          className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
          aria-label="Increase magnifier zoom"
          onClick={() => setMagScale(1)}
          disabled={!state.magnifier}
        >
          <Plus className="h-[16px] w-[16px]" />
        </button>
      </div>
    </section>
  );
}
