"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Accessibility as AccessibilityIcon,
    Eye,
    Contrast,
    Type,
    Underline,
    X,
    Plus,
    Minus,
    Droplet,
} from "lucide-react";

/**
 * AccessibilityButton — scrollable panel + neuro-informed contrast styles
 *
 * Changes in this version:
 *  - REMOVE: Reduce motion toggle (per request)
 *  - Text scaling will NOT affect this UI (button + panel) — fixed px font sizes
 *  - Scrollable content area (shows ~3 features then scroll)
 *  - Contrast styles dropdown with presets: Standard / Photophobia (FL‑41‑like) /
 *    Migraine Low‑Glare / CVI High‑Contrast / mTBI Boosted Contrast
 *  - Optional full‑page zoom to enlarge px‑based text, while keeping this UI unscaled
 */

const LS_KEY = "squidly:accessibility";
const SCALE_STEPS = [100, 112, 125, 150, 175, 200, 225, 250] as const;

type TextScale = (typeof SCALE_STEPS)[number];

type ContrastStyle =
    | "standard"
    | "photophobia"
    | "migraine_soft"
    | "cvi_high"
    | "mtbi_boost";

type AccState = {
    colorSafe: boolean;
    highContrast: boolean; // master switch
    contrastStyle: ContrastStyle; // detailed mode
    grayscale: boolean;
    dyslexia: boolean;
    underlineLinks: boolean;
    textScale: TextScale;
    pageZoom: boolean; // scale whole page (for px-based typography)
};

const DEFAULT_STATE: AccState = {
    colorSafe: false,
    highContrast: false,
    contrastStyle: "standard",
    grayscale: false,
    dyslexia: false,
    underlineLinks: false,
    textScale: 100,
    pageZoom: false,
};

function loadState(): AccState {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
    } catch {
        return DEFAULT_STATE;
    }
}

function saveState(s: AccState) { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {} }

function applyToHtml(s: AccState) {
    const html = document.documentElement;
    const cl = html.classList;

    // Root font-size (rem-based)
    ["acc-zoom-100","acc-zoom-112","acc-zoom-125","acc-zoom-150","acc-zoom-175","acc-zoom-200","acc-zoom-225","acc-zoom-250"].forEach(k=>cl.remove(k));
    cl.add(`acc-zoom-${s.textScale}`);

    // Optional full-page zoom (affects px as well) — keep this UI unscaled via [data-acc-ui]
    if (s.pageZoom) {
        cl.add("acc-page-zoom");
        html.style.setProperty("--acc-page-zoom", String(s.textScale / 100));
    } else {
        cl.remove("acc-page-zoom");
        html.style.removeProperty("--acc-page-zoom");
    }

    cl.toggle("acc-dyslexia", s.dyslexia);
    cl.toggle("acc-underline-links", s.underlineLinks);

    // Compose filters
    const filters: string[] = [];
    if (s.colorSafe) filters.push("hue-rotate(18deg) saturate(0.95) contrast(1.05)");
    // High-contrast master switch + styles
    if (s.highContrast) {
        switch (s.contrastStyle) {
            case "photophobia":
                // FL‑41‑like rose/amber bias, reduces blue-green, mild contrast
                filters.push("sepia(0.12) hue-rotate(320deg) saturate(1.1) contrast(1.05)");
                break;
            case "migraine_soft":
                // Softer contrast & glare reduction
                filters.push("contrast(0.92) brightness(1.02) saturate(0.95)");
                break;
            case "cvi_high":
                // Strong high-contrast / forced dark (invert technique)
                filters.push("invert(1) hue-rotate(180deg) contrast(1.15) saturate(1.1)");
                break;
            case "mtbi_boost":
                // Boosted contrast & clarity without inversion
                filters.push("contrast(1.18) saturate(1.05)");
                break;
            default:
                filters.push("contrast(1.1)");
        }
    }
    if (s.grayscale) filters.push("grayscale(1)");

    if (filters.length) { cl.add("acc-filter"); html.style.setProperty("--acc-filter", filters.join(" ")); }
    else { cl.remove("acc-filter"); html.style.removeProperty("--acc-filter"); }
}

export default function AccessibilityButton() {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState<AccState>(DEFAULT_STATE);

    useEffect(() => { const s = loadState(); setState(s); applyToHtml(s); }, []);
    useEffect(() => { applyToHtml(state); saveState(state); }, [state]);

    const toggle = (k: keyof AccState) => () => setState(s => ({ ...s, [k]: typeof s[k] === "boolean" ? !s[k] : s[k] } as AccState));

    return (
        <>
            <style>{globalStyles}</style>

            {/* Floating trigger button (doesn't scale with text size) */}
            <button
                data-acc-ui
                aria-label="Accessibility options"
                onClick={() => setOpen(v=>!v)}
                className="fixed z-[60] bottom-5 right-5 md:bottom-6 md:right-6 rounded-full shadow-lg bg-white backdrop-blur border border-slate-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-300 p-[12px] md:p-[14px]"
                style={{ fontSize: 14 }}
            >
                <AccessibilityIcon className="h-[22px] w-[22px] text-violet-700" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.aside
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="fixed z-[61] bottom-20 right-5 md:right-6 w-[92vw] max-w-[400px]"
                        role="dialog"
                        aria-label="Accessibility settings"
                    >
                        <div data-acc-ui className="rounded-2xl border border-slate-300 bg-white shadow-2xl text-[14px]">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-300">
                                <div className="flex items-center gap-2 font-semibold text-slate-950 text-[16px]">
                                    <AccessibilityIcon className="h-[18px] w-[18px] text-violet-700" />
                                    Accessibility
                                </div>
                                <button onClick={()=>setOpen(false)} className="p-1.5 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-300" aria-label="Close">
                                    <X className="h-[18px] w-[18px] text-slate-700" />
                                </button>
                            </div>

                            {/* Scrollable content area (~3 rows visible) */}
                            <div className="px-4 py-3 grid gap-3 max-h-[60vh] overflow-y-auto overscroll-contain pr-1">
                                <ToggleRow
                                    icon={<Eye className="h-[18px] w-[18px]" />}
                                    title="Color vision aid"
                                    desc="Apply color‑safe palette adjustments."
                                    pressed={state.colorSafe}
                                    onClick={toggle("colorSafe")}
                                />

                                {/* High contrast with styles */}
                                <div className="rounded-xl border border-slate-300 p-3 bg-white/80">
                                    <div className="flex items-center gap-2 text-slate-950 font-medium leading-5">
                                        <Contrast className="h-[18px] w-[18px] text-violet-700" />
                                        High contrast
                                        <button
                                            onClick={toggle("highContrast")}
                                            role="switch"
                                            aria-checked={state.highContrast}
                                            className={`ml-auto relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${state.highContrast ? "bg-violet-700" : "bg-slate-400"}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${state.highContrast ? "translate-x-5" : "translate-x-0"}`} />
                                        </button>
                                    </div>
                                    <p className="text-[12.5px] text-slate-600 leading-5 mt-1">Choose a style that matches user comfort.</p>

                                    {/* Styles selector */}
                                    <div className="mt-2 grid gap-2">
                                        <select
                                            className="w-full rounded-lg border border-slate-300 p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-60"
                                            disabled={!state.highContrast}
                                            value={state.contrastStyle}
                                            onChange={(e)=> setState(s=> ({...s, contrastStyle: e.target.value as ContrastStyle }))}
                                        >
                                            <option value="standard">Standard boost</option>
                                            <option value="photophobia">Photophobia (FL‑41‑like rose)</option>
                                            <option value="migraine_soft">Migraine low‑glare</option>
                                            <option value="cvi_high">CVI high‑contrast (forced dark)</option>
                                            <option value="mtbi_boost">mTBI boosted contrast</option>
                                        </select>
                                    </div>
                                </div>

                                <ToggleRow
                                    icon={<Droplet className="h-[18px] w-[18px]" />}
                                    title="Black & White"
                                    desc="Render the interface in grayscale colors."
                                    pressed={state.grayscale}
                                    onClick={toggle("grayscale")}
                                />

                                <ToggleRow
                                    icon={<Type className="h-[18px] w-[18px]" />}
                                    title="Dyslexia‑friendly text"
                                    desc="Increase letter & word spacing."
                                    pressed={state.dyslexia}
                                    onClick={toggle("dyslexia")}
                                />

                                <ToggleRow
                                    icon={<Underline className="h-[18px] w-[18px]" />}
                                    title="Underline links"
                                    desc="Always underline hyperlinks."
                                    pressed={state.underlineLinks}
                                    onClick={toggle("underlineLinks")}
                                />

                                {/* Text size */}
                                {/*<div className="rounded-xl border border-slate-300 p-3">*/}
                                {/*    <div className="flex items-center gap-2 text-slate-950 font-medium">*/}
                                {/*        <Type className="h-[18px] w-[18px]" />*/}
                                {/*        Text size*/}
                                {/*    </div>*/}
                                {/*    <div className="mt-2 flex items-center gap-2">*/}
                                {/*        <button className="p-2 rounded-md border border-slate-300 hover:bg-slate-50" aria-label="Decrease text size" onClick={() => setScale(SCALE_STEPS[Math.max(0, currIdx-1)])}>*/}
                                {/*            <Minus className="h-[16px] w-[16px]" />*/}
                                {/*        </button>*/}
                                {/*        <div className="flex-1">*/}
                                {/*            <div className="flex justify-between text-[11px] text-slate-600">*/}
                                {/*                {SCALE_STEPS.map((s)=> (<span key={s}>{s}%</span>))}*/}
                                {/*            </div>*/}
                                {/*            <input*/}
                                {/*                type="range"*/}
                                {/*                min={0}*/}
                                {/*                max={SCALE_STEPS.length - 1}*/}
                                {/*                step={1}*/}
                                {/*                value={currIdx}*/}
                                {/*                onChange={(e)=> setScale(SCALE_STEPS[parseInt(e.target.value,10)])}*/}
                                {/*                className="mt-1 w-full accent-violet-700"*/}
                                {/*                aria-valuetext={`${state.textScale}%`}*/}
                                {/*            />*/}
                                {/*            <label className="mt-2 flex items-center gap-2 text-[12.5px] text-slate-600 select-none">*/}
                                {/*                <input*/}
                                {/*                    type="checkbox"*/}
                                {/*                    className="accent-violet-700 h-4 w-4"*/}
                                {/*                    checked={state.pageZoom}*/}
                                {/*                    onChange={() => setState(s => ({...s, pageZoom: !s.pageZoom}))}*/}
                                {/*                />*/}
                                {/*                Apply to entire page (affects px‑based text; this panel stays same size)*/}
                                {/*            </label>*/}
                                {/*        </div>*/}
                                {/*        <button className="p-2 rounded-md border border-slate-300 hover:bg-slate-50" aria-label="Increase text size" onClick={() => setScale(SCALE_STEPS[Math.min(SCALE_STEPS.length-1, currIdx+1)])}>*/}
                                {/*            <Plus className="h-[16px] w-[16px]" />*/}
                                {/*        </button>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                <p className="text-[12px] text-slate-600">
                                    Settings persist on this device. This panel and button keep their own size so they don’t obstruct the experience when zooming.
                                </p>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}

function ToggleRow({ icon, title, desc, pressed, onClick }: { icon: React.ReactNode; title: string; desc: string; pressed: boolean; onClick: () => void; }) {
    return (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-300 p-3 bg-white/80">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 text-violet-700">{icon}</div>
                <div>
                    <div className="text-slate-950 font-medium leading-5">{title}</div>
                    <div className="text-[12.5px] text-slate-600 leading-5">{desc}</div>
                </div>
            </div>
            <button
                role="switch"
                aria-checked={pressed}
                onClick={onClick}
                className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${pressed ? "bg-violet-700" : "bg-slate-400"}`}
            >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${pressed ? "translate-x-5" : "translate-x-0"}`} />
            </button>
        </div>
    );
}

/* Global CSS */
const globalStyles = `
:root { --acc-filter: none; --acc-page-zoom: 1; }
:root.acc-filter { filter: var(--acc-filter); }

/* Keep this UI (button + panel) size constant */
[data-acc-ui] { font-size: 14px !important; }
:root.acc-page-zoom [data-acc-ui] { transform: scale(calc(1 / var(--acc-page-zoom))); transform-origin: bottom right; }

/* Root rem text zoom */
:root.acc-zoom-100 { font-size: 100%; }
:root.acc-zoom-112 { font-size: 112.5%; }
:root.acc-zoom-125 { font-size: 125%; }
:root.acc-zoom-150 { font-size: 150%; }
:root.acc-zoom-175 { font-size: 175%; }
:root.acc-zoom-200 { font-size: 200%; }
:root.acc-zoom-225 { font-size: 225%; }
:root.acc-zoom-250 { font-size: 250%; }

/* Full page zoom (works for px text too) */
:root.acc-page-zoom body { 
  transform: scale(var(--acc-page-zoom));
  transform-origin: top left;
  width: calc(200% / var(--acc-page-zoom));
}

/* Underline links */
:root.acc-underline-links a { text-decoration: underline !important; text-underline-offset: 0.22em; }

/* Dyslexia-friendly spacing */
:root.acc-dyslexia body, :root.acc-dyslexia * { letter-spacing: 0.0125em !important; word-spacing: 0.06em !important; }
`;
