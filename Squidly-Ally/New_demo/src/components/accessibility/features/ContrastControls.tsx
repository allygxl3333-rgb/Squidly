"use client";
import React from "react";
import { Eye, Contrast, Droplet } from "lucide-react";
import { useAcc } from "../AccProvider";

export default function ContrastControls() {
  const { state, setState } = useAcc();

  return (
    <section className="rounded-xl border border-slate-300 p-3 bg-white/80">
      <Row
        icon={<Eye className="h-[18px] w-[18px]" />}
        title="Color vision aid"
        desc="Apply color-safe palette adjustments."
      >
        <Switch
          checked={state.colorSafe}
          onToggle={() => setState((s)=>({ ...s, colorSafe: !s.colorSafe }))}
        />
      </Row>

      <div className="mt-2 rounded-xl border border-slate-300 p-3 bg-white/60">
        <Row
          icon={<Contrast className="h-[18px] w-[18px]" />}
          title="High contrast"
          desc="Choose a style that matches user comfort."
        >
          <Switch
            checked={state.highContrast}
            onToggle={() => setState((s)=>({ ...s, highContrast: !s.highContrast }))}
          />
        </Row>
        <select
          className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-60"
          disabled={!state.highContrast}
          value={state.contrastStyle}
          onChange={(e)=>setState((s)=>({ ...s, contrastStyle: e.target.value as any }))}
        >
          <option value="standard">Standard boost</option>
          <option value="photophobia">Photophobia (FL-41-like rose)</option>
          <option value="migraine_soft">Migraine low-glare</option>
          <option value="cvi_high">CVI high-contrast (forced dark)</option>
          <option value="mtbi_boost">mTBI boosted contrast</option>
        </select>
      </div>

      <Row
        icon={<Droplet className="h-[18px] w-[18px]" />}
        title="Black & White"
        desc="Render the interface in grayscale colors."
      >
        <Switch
          checked={state.grayscale}
          onToggle={() => setState((s)=>({ ...s, grayscale: !s.grayscale }))}
        />
      </Row>
    </section>
  );
}

function Row({icon, title, desc, children}:{icon:React.ReactNode; title:string; desc:string; children:React.ReactNode}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-300 p-3 bg-white/60">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-violet-700">{icon}</div>
        <div>
          <div className="text-slate-950 font-medium leading-5">{title}</div>
          <div className="text-[12.5px] text-slate-600 leading-5">{desc}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
function Switch({checked, onToggle}:{checked:boolean; onToggle:()=>void}){
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${checked ? "bg-violet-700" : "bg-slate-400"}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
