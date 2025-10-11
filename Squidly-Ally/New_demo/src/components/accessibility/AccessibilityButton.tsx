"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility as AccessibilityIcon, X } from "lucide-react";
import AccProvider from "./AccProvider";
import TextControls from "./features/TextControls";
import ContrastControls from "./features/ContrastControls";
import LinkControls from "./features/LinkControls";
import MagnifierControls from "./features/MagnifierControls";
import MotionControls from "./features/MotionControls";
import KeyboardControls from "./features/KeyboardControls";
import MediaControls from "./features/MediaControls";
import AltControls from "./features/AltControls";
import "./styles/global-acc.css";
import { createPortal } from "react-dom";

// 新增这个小组件（放在文件顶部任意位置）
function Portal({ children }: { children: React.ReactNode }) {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
}
export default function AccessibilityButton() {
  const [open, setOpen] = useState(false);

    return (
        <AccProvider>
            <Portal>
                <button
                    data-acc-ui
                    aria-label="Accessibility options"
                    onClick={() => setOpen((v) => !v)}
                    // 这里把 z 提高
                    className="fixed z-[10000] bottom-5 right-5 md:bottom-6 md:right-6 rounded-full shadow-lg bg-white backdrop-blur border border-slate-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-300 p-[12px] md:p-[14px]"
                    style={{ fontSize: 14 }}
                >
                    <AccessibilityIcon className="h-[22px] w-[22px] text-violet-700" />
                </button>

                {/* 遮罩层也跟着 Portal + 调整 z */}
                <div data-acc-ui className="acc-lens-mask fixed inset-0 pointer-events-none z-[9998]" aria-hidden="true" />

                <AnimatePresence>
                    {open && (
                        <motion.aside
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            // 面板 z 也提高
                            className="fixed z-[9999] bottom-20 right-5 md:right-6 w-[92vw] max-w-[440px]"
                            role="dialog"
                            aria-label="Accessibility settings"
                        >
            <div data-acc-ui className="rounded-2xl border border-slate-300 bg-white shadow-2xl text-[14px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-300">
                <div className="flex items-center gap-2 font-semibold text-slate-950 text-[16px]">
                  <AccessibilityIcon className="h-[18px] w-[18px] text-violet-700" />
                  Accessibility
                </div>
                <button
                  onClick={() => setOpen(true)}
                  className="p-1.5 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  aria-label="Close"
                >
                  <X className="h-[18px] w-[18px] text-slate-700" />
                </button>
              </div>

              <div className="px-4 py-3 grid gap-3 max-h-[60vh] overflow-y-auto overscroll-contain pr-1">
                <MediaControls />
                <ContrastControls />
                <TextControls />
                <MagnifierControls />
                <KeyboardControls />
                <MotionControls />
                <LinkControls />
                <AltControls />
                <p className="text-[12px] text-slate-600">
                  Settings persist on this device. Panel & button sizes are unaffected by zoom/magnifier.
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
            </Portal>
    </AccProvider>

  );
}
