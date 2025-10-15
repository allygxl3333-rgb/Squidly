// src/.../features/TextControls.tsx
"use client";
import React, { useMemo } from "react";
import { useAcc } from "../AccProvider";
import { SCALE_STEPS, DEFAULT_STATE } from "../state";

export default function TextControls() {
  const { state, setState, setScaleRelative } = useAcc();

  const idx = useMemo(
    () => Math.max(0, SCALE_STEPS.indexOf(state.textScale)),
    [state.textScale]
  );
  const min = 0;
  const max = SCALE_STEPS.length - 1;

  const setIndex = (i: number) =>
    setState((s) => ({
      ...s,
      textScale: SCALE_STEPS[Math.max(min, Math.min(max, i))],
    }));

  const reset = () =>
    setState((s) => ({ ...s, textScale: DEFAULT_STATE.textScale }));

  const pct =
    typeof state.textScale === "number"
      ? `${Math.round(state.textScale * 1)}%`
      : String(state.textScale);

  return (
    <div
      className="rounded-xl border border-slate-200 p-3 grid gap-3"
      role="group"
      aria-label="Text size controls"
    >
      {/* 顶部按钮 */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setScaleRelative(-1)}
          className="h-9 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium"
          aria-label="Decrease text size"
          title="Decrease text size (A−)"
        >
          A-
        </button>

        <button
          type="button"
          onClick={reset}
          className="h-9 px-3 rounded-full bg-violet-700 text-white font-semibold hover:bg-violet-800"
          aria-label="Reset text size"
          title="Reset to default"
        >
          {pct}
        </button>

        <button
          type="button"
          onClick={() => setScaleRelative(1)}
          className="h-9 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium"
          aria-label="Increase text size"
          title="Increase text size (A+)"
        >
          A+
        </button>
      </div>

      {/* 滑杆：精细调 */}
      <label className="grid gap-1 text-[12px] text-slate-500">
        <span>Adjust precisely</span>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={idx}
          onChange={(e) => setIndex(Number(e.currentTarget.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={idx}
          className="w-full accent-violet-700"
        />
      </label>

      <p className="text-[12px] text-slate-500">
        Applies to all site text (rem-based fonts).
      </p>
    </div>
  );
}
