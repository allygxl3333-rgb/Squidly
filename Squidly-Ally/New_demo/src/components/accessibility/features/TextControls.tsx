"use client";
import React from "react";
import { useAcc } from "../AccProvider";
import { SCALE_STEPS } from "../state"; // 你的步进数组里应含 100/125/150/200

const STEPS = [100, 125, 150, 200];

export default function TextControls() {
    const { state, setState } = useAcc();

    const pressedIdx = STEPS.findIndex((v) => v === state.textScale);
    const setScale = (v: number) =>
        setState((s) => ({
            ...s,
            textScale: v,
            // 放到很大时，自动打开“全页缩放（包含 px 文本）”
            pageZoom: s.pageZoom || v >= 175,
        }));

    return (
        <div className="grid gap-4">
            {/* Segmented 'Aa' */}
            <div className="acc-segmented">
                {STEPS.map((v, i) => (
                    <button
                        key={v}
                        aria-pressed={pressedIdx === i}
                        onClick={() => setScale(v)}
                        title={`${v}%`}
                        style={{ fontSize: `${12 + i * 3}px` }} /* 让 Aa 随档位变大 */
                    >
                        Aa
                    </button>
                ))}
            </div>

            {/* 降低颜色强度（图二样式，滑杆 0~0.7） */}
            <div className="grid gap-2">
                <div className="text-slate-700 font-medium">Reduce color intensity</div>
                <div className="flex items-center gap-3">
                    <span className="text-[12px] text-slate-500">Less</span>
                    <input
                        aria-label="Reduce color intensity"
                        type="range"
                        min={0}
                        max={70}
                        step={5}
                        value={Math.round((state.colorDim ?? 0) * 100)}
                        onChange={(e) => {
                            const v = Math.min(70, Math.max(0, parseInt(e.target.value, 10)));
                            setState((s) => ({ ...s, colorDim: v / 100 }));
                        }}
                        className="w-full"
                    />
                    <span className="text-[12px] text-slate-500">More</span>
                </div>
            </div>

            {/* 增强对比度（图二的开关；这里做为“高对比度”快捷开关） */}
            <div className="flex items-center justify-between acc-tile">
                <div>
                    <div className="font-medium text-slate-900">Increase contrast</div>
                    <div className="text-[12.5px] text-slate-600">Boost interface contrast</div>
                </div>
                <button
                    role="switch"
                    aria-checked={state.contrastMode === "high"}
                    onClick={() =>
                        setState((s) => ({
                            ...s,
                            contrastMode: s.contrastMode === "high" ? "normal" : "high",
                        }))
                    }
                    className="acc-switch"
                />
            </div>
        </div>
    );
}
