"use client";
import React from "react";
import { Type, Plus, Minus } from "lucide-react";
import { useAcc } from "../AccProvider";
import { SCALE_STEPS } from "../state";

export default function TextControls() {
  const { state, setState, setScaleRelative } = useAcc();
  const currIdx = Math.max(0, SCALE_STEPS.indexOf(state.textScale));

  return (
    <section className="rounded-xl border border-slate-300 p-3 bg-white/80">
      <div className="flex items-center gap-2 text-slate-950 font-medium">
        <Type className="h-[18px] w-[18px] text-violet-700" />
        Text size
        <span className="ml-2 text-[12.5px] text-slate-600">{state.textScale}%</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
          aria-label="Decrease text size"
          onClick={() => setScaleRelative(-1)}
        >
          <Minus className="h-[16px] w-[16px]" />
        </button>
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={SCALE_STEPS.length - 1}
            step={1}
            value={currIdx}
            onChange={(e) =>
              setState((s) => ({ ...s, textScale: SCALE_STEPS[parseInt(e.target.value, 10)] }))
            }
            className="mt-1 w-full accent-violet-700"
            aria-valuetext={`${state.textScale}%`}
          />
          <label className="mt-2 flex items-center gap-2 text-[12.5px] text-slate-600 select-none">
            <input
              type="checkbox"
              className="accent-violet-700 h-4 w-4"
              checked={state.pageZoom}
              onChange={() => setState((s)=>({ ...s, pageZoom: !s.pageZoom }))}
            />
            Apply to entire page (px text too; panel keeps same size)
          </label>
        </div>
        <button
          className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
          aria-label="Increase text size"
          onClick={() => setScaleRelative(1)}
        >
          <Plus className="h-[16px] w-[16px]" />
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        <Toggle
          label="Readable font"
          desc="Switch to a more legible system font stack."
          checked={state.readableFont}
          onToggle={() => setState((s)=>({ ...s, readableFont: !s.readableFont }))}
        />
        <Toggle
          label="Dyslexia-friendly text"
          desc="Increase letter & word spacing."
          checked={state.dyslexia}
          onToggle={() => setState((s)=>({ ...s, dyslexia: !s.dyslexia }))}
          icon={<Type className="h-[16px] w-[16px]" />}        />
      </div>
    </section>
  );
}

function Toggle({ label, desc, checked, onToggle, icon }:{label:string; desc:string; checked:boolean; onToggle:()=>void; icon?:React.ReactNode}){
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-300 p-3 bg-white/60">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-violet-700">{icon}</div>}
        <div>
          <div className="text-slate-950 font-medium">{label}</div>
          <div className="text-[12.5px] text-slate-600">{desc}</div>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${checked ? "bg-violet-700" : "bg-slate-400"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
