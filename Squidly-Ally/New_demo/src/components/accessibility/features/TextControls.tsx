"use client";
import React, { useMemo } from "react";
import { useAcc } from "../AccProvider";
import { SCALE_STEPS, DEFAULT_STATE } from "../state";

export default function TextControls() {
  const { state, setState } = useAcc();

  const min = 0;
  const max = Math.max(0, SCALE_STEPS.length - 1);

  const currentIdx = useMemo(() => {
    const i = SCALE_STEPS.indexOf(state.textScale as any);
    return i >= 0 ? i : Math.min(Math.max(min, Math.floor((min + max) / 2)), max);
  }, [state.textScale, min, max]);

  const defaultIdx = useMemo(() => {
    const i = SCALE_STEPS.indexOf(DEFAULT_STATE.textScale as any);
    return i >= 0 ? i : Math.min(Math.max(min, Math.floor((min + max) / 2)), max);
  }, [min, max]);

  const smallIdx = min;
  const mediumIdx = defaultIdx;
  const largeIdx = max;

  const setIndex = (i: number) =>
      setState((s) => ({
        ...s,
        textScale: SCALE_STEPS[Math.max(min, Math.min(max, i))],
      }));

  const Item = ({
                  label,
                  idx,
                }: {
    label: string;
    idx: number;
  }) => {
    const active = currentIdx === idx;
    return (
        <button
            type="button"
            onClick={() => setIndex(idx)}
            aria-pressed={active}
            className={`h-11 rounded-2xl text-[12.5px] font-semibold border transition focus:outline-none focus:ring-4 focus:ring-violet-200
          ${active
                ? "bg-violet-500 text-white border-violet-500 shadow-[0_6px_14px_rgba(139,92,246,.25)]"
                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
            }`}
            style={{ flex: 1 }}
        >
          {label}
        </button>
    );
  };

  return (
      <div
          className="w-full"
          role="group"
          aria-label="Text size adjuster"
      >
        <div className="flex items-center justify-between gap-2">
          <Item label="Small" idx={smallIdx} />
          <Item label="Medium" idx={mediumIdx} />
          <Item label="Large" idx={largeIdx} />
        </div>
      </div>
  );
}
