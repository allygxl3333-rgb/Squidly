// src/components/accessibility/features/LinkControls.tsx
"use client";
import React from "react";
import { Underline } from "lucide-react";
import { useAcc } from "../AccProvider";

export default function LinkControls() {
    const { state, setState } = useAcc();

    // 两者都开才算“开”
    const bothOn = state.underlineLinks && state.highlightLinks;

    const toggleBoth = () => {
        setState((s) => {
            const next = !(s.underlineLinks && s.highlightLinks);
            return { ...s, underlineLinks: next, highlightLinks: next };
        });
    };

    return (
        <section className="rounded-xl border border-slate-300 p-3 bg-white/80 grid gap-2">
            <Row
                icon={<Underline className="h-[18px] w-[18px]" />}
                title="Emphasize links"
                desc="Underline + highlight links together for easier scanning."
                checked={bothOn}
                onToggle={toggleBoth}
            />
        </section>
    );
}

function Row({icon, title, desc, checked, onToggle}:{icon:React.ReactNode; title:string; desc:string; checked:boolean; onToggle:()=>void}){
    return (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-300 p-3 bg-white/60">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 text-violet-700">{icon}</div>
                <div>
                    <div className="text-slate-950 font-medium">{title}</div>
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
