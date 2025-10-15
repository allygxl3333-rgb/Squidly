"use client";
import React from "react";
import { Eye, Contrast, Droplet } from "lucide-react";
import { useAcc } from "../AccProvider";

type Tab = "palette" | "contrast" | "grayscale";

export default function ColorControls() {
    const { state, setState } = useAcc();
    const [tab, setTab] = React.useState<Tab>("contrast"); // 默认打开“对比度”

    return (
        <section className="acc-card">
            {/* 顶部分段切换 */}
            <div className="acc-section-title mb-2">Colour & Contrast</div>
            <div className="acc-segmented mb-3" role="tablist" aria-label="Colour categories">
                <button
                    role="tab" aria-selected={tab==="palette"} aria-controls="acc-tab-palette"
                    aria-pressed={tab==="palette"} onClick={()=>setTab("palette")}
                >
                    Palette aid
                </button>
                <button
                    role="tab" aria-selected={tab==="contrast"} aria-controls="acc-tab-contrast"
                    aria-pressed={tab==="contrast"} onClick={()=>setTab("contrast")}
                >
                    High contrast
                </button>
                <button
                    role="tab" aria-selected={tab==="grayscale"} aria-controls="acc-tab-grayscale"
                    aria-pressed={tab==="grayscale"} onClick={()=>setTab("grayscale")}
                >
                    Black & White
                </button>
            </div>

            {/* 分类内容 */}
            <div className="grid gap-3">
                {tab === "palette" && (
                    <div id="acc-tab-palette" role="tabpanel" className="acc-card">
                        <div className="acc-row">
                            <div>
                                <div className="acc-title flex items-center gap-2">
                                    <Eye className="h-[16px] w-[16px] text-violet-700" />
                                    Color vision aid
                                </div>
                                <div className="acc-sub">Apply color-safe palette adjustments.</div>
                            </div>
                            <Switch
                                checked={state.colorSafe}
                                onToggle={() => setState(s => ({ ...s, colorSafe: !s.colorSafe }))}
                            />
                        </div>
                    </div>
                )}

                {tab === "contrast" && (
                    <div id="acc-tab-contrast" role="tabpanel" className="grid gap-2">
                        <div className="acc-card">
                            <div className="acc-row">
                                <div>
                                    <div className="acc-title flex items-center gap-2">
                                        <Contrast className="h-[16px] w-[16px] text-violet-700" />
                                        High contrast
                                    </div>
                                    <div className="acc-sub">Choose a style that matches user comfort.</div>
                                </div>
                                <Switch
                                    checked={state.highContrast}
                                    onToggle={() => setState(s => ({ ...s, highContrast: !s.highContrast }))}
                                />
                            </div>
                        </div>

                        <select
                            className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-60"
                            disabled={!state.highContrast}
                            value={state.contrastStyle}
                            onChange={(e)=>setState(s=>({ ...s, contrastStyle: e.target.value as any }))}
                            aria-label="High contrast style"
                        >
                            <option value="standard">Standard boost</option>
                            <option value="photophobia">Photophobia (FL-41-like rose)</option>
                            <option value="migraine_soft">Migraine low-glare</option>
                            <option value="cvi_high">CVI high-contrast (forced dark)</option>
                            <option value="mtbi_boost">mTBI boosted contrast</option>
                        </select>
                    </div>
                )}

                {tab === "grayscale" && (
                    <div id="acc-tab-grayscale" role="tabpanel" className="acc-card">
                        <div className="acc-row">
                            <div>
                                <div className="acc-title flex items-center gap-2">
                                    <Droplet className="h-[16px] w-[16px] text-violet-700" />
                                    Black & White
                                </div>
                                <div className="acc-sub">Render the interface in grayscale colors.</div>
                            </div>
                            <Switch
                                checked={state.grayscale}
                                onToggle={() => setState(s => ({ ...s, grayscale: !s.grayscale }))}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
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
