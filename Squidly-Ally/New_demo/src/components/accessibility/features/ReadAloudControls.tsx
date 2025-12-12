"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

type Level = "low" | "medium" | "high";

const LS_TTS_LEVEL = "acc:tts:level";

const LEVELS: Level[] = ["low", "medium", "high"];
const RATE_MAP: Record<Level, number> = {
    low: 0.85,
    medium: 1.0,
    high: 1.25,
};

const SECTION_GAP_MS = 350;

function clampIndex(i: number) {
    if (i < 0) return 0;
    if (i > 2) return 2;
    return i;
}

function getPreferredVoice() {
    if (typeof window === "undefined") return null;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices?.() ?? [];
    if (!voices.length) return null;

    const lang = (navigator.language || "").toLowerCase();
    const exact = voices.find((v) => v.lang?.toLowerCase() === lang);
    if (exact) return exact;

    const base = lang.split("-")[0];
    const near = voices.find((v) => v.lang?.toLowerCase().startsWith(base));
    return near ?? voices[0] ?? null;
}

const EXCLUDE_BASE = [
    "script",
    "style",
    "noscript",
    "code",
    "pre",
    "kbd",
    "samp",
    "textarea",
    "input",
    "select",
    "button",
    "[data-read-exclude='true']",
    "[aria-hidden='true']",
];

const EXCLUDE_STRICT = [...EXCLUDE_BASE, "[data-acc-ui]"].join(",");
const EXCLUDE_RELAXED = [...EXCLUDE_BASE].join(",");

function isElementVisible(el: HTMLElement) {
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    return true;
}

function getReadableRoot(): HTMLElement | null {
    return (
        document.querySelector<HTMLElement>("[data-read-root]") ||
        document.querySelector<HTMLElement>("[data-read-target]") ||
        document.querySelector<HTMLElement>("main") ||
        document.querySelector<HTMLElement>("article") ||
        document.body
    );
}

function collectTextFromRoot(root: HTMLElement, excludeSelector: string) {
    const safeRoot = root.matches(excludeSelector) ? document.body : root;

    const walker = document.createTreeWalker(
        safeRoot,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const text = (node.textContent || "").replace(/\s+/g, " ").trim();
                if (!text) return NodeFilter.FILTER_REJECT;

                const parent = node.parentElement as HTMLElement | null;
                if (!parent) return NodeFilter.FILTER_REJECT;

                if (parent.closest(excludeSelector)) return NodeFilter.FILTER_REJECT;
                if (!isElementVisible(parent)) return NodeFilter.FILTER_REJECT;

                return NodeFilter.FILTER_ACCEPT;
            },
        } as any
    );

    const parts: string[] = [];
    let n: Node | null = walker.nextNode();
    while (n) {
        const t = (n.textContent || "").replace(/\s+/g, " ").trim();
        if (t) parts.push(t);
        n = walker.nextNode();
    }

    return parts.join(" ").replace(/\s+/g, " ").trim();
}

function extractSectionsFromTargets(): string[] {
    if (typeof document === "undefined") return [];

    const selection = window.getSelection?.()?.toString()?.trim();
    if (selection) return [selection];

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-read-target]"));
    if (targets.length) {
        const texts = targets.map((el) => (el.innerText || "").trim()).filter(Boolean);
        if (texts.length) return texts;
    }

    const root = getReadableRoot();
    if (!root) return [];

    const strictText = collectTextFromRoot(root, EXCLUDE_STRICT);
    if (strictText) return [strictText];

    const relaxedText = collectTextFromRoot(root, EXCLUDE_RELAXED);
    if (relaxedText) return [relaxedText];

    return [];
}

function extractTextFromTargets(): string {
    const sections = extractSectionsFromTargets();
    return sections.join(" ").replace(/\s+/g, " ").trim();
}

function splitIntoChunks(text: string, maxLen = 900) {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return [];
    if (clean.length <= maxLen) return [clean];

    const sentences = clean.split(/(?<=[。！？.!?])\s+/);
    const chunks: string[] = [];
    let buf = "";

    for (const s of sentences) {
        if (!s) continue;
        const next = (buf + " " + s).trim();
        if (next.length > maxLen) {
            if (buf.trim()) chunks.push(buf.trim());
            buf = s.trim();
        } else {
            buf = next;
        }
    }
    if (buf.trim()) chunks.push(buf.trim());

    return chunks.length ? chunks : [clean];
}

export default function ReadAloudControls() {
    const [level, setLevel] = useState<Level>(() => {
        if (typeof window === "undefined") return "medium";
        try {
            const v = localStorage.getItem(LS_TTS_LEVEL) as Level | null;
            if (v && LEVELS.includes(v)) return v;
        } catch {}
        return "medium";
    });

    const rate = RATE_MAP[level];

    const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
    const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
    const playIdRef = useRef(0);

    const chunksRef = useRef<string[]>([]);
    const pauseMsRef = useRef<number[]>([]);
    const lensRef = useRef<number[]>([]);
    const totalCharsRef = useRef(0);
    const currentIdxRef = useRef(0);

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progressPct, setProgressPct] = useState(0);

    const lastRateRef = useRef(rate);

    const rateLabel = useMemo(() => {
        const v = rate.toFixed(2).replace(/\.00$/, "");
        return `${v} X`;
    }, [rate]);

    const computeProgressForIndex = useCallback((idx: number) => {
        const total = totalCharsRef.current || 0;
        if (!total) return 0;

        let done = 0;
        for (let i = 0; i < idx && i < lensRef.current.length; i += 1) {
            done += lensRef.current[i] || 0;
        }

        return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const synth = window.speechSynthesis;

        const loadVoices = () => {
            voiceRef.current = getPreferredVoice();
        };

        loadVoices();
        synth.onvoiceschanged = loadVoices;

        return () => {
            synth.onvoiceschanged = null;
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem(LS_TTS_LEVEL, level);
        } catch {}
    }, [level]);

    useEffect(() => {
        return () => {
            utterRef.current = null;
        };
    }, []);

    const stop = useCallback(() => {
        if (typeof window === "undefined") return;
        playIdRef.current += 1;
        window.speechSynthesis.cancel();
        utterRef.current = null;

        setIsSpeaking(false);
        setIsPaused(false);
        setProgressPct(0);

        chunksRef.current = [];
        pauseMsRef.current = [];
        lensRef.current = [];
        totalCharsRef.current = 0;
        currentIdxRef.current = 0;
    }, []);

    const getVoiceForUtter = useCallback(() => {
        const synth = window.speechSynthesis;
        const voices = synth.getVoices?.() ?? [];

        const lang = (navigator.language || "").toLowerCase();
        const base = lang.split("-")[0];

        const exact = voices.find((v) => v.lang?.toLowerCase() === lang);
        const near = voices.find((v) => v.lang?.toLowerCase().startsWith(base));

        return exact ?? near ?? voiceRef.current ?? voices[0] ?? null;
    }, []);

    const speakFromIndex = useCallback(
        (startIndex: number) => {
            if (typeof window === "undefined") return;

            const synth = window.speechSynthesis;
            const chunks = chunksRef.current;

            if (!chunks.length) return;

            const myId = playIdRef.current + 1;
            playIdRef.current = myId;

            synth.cancel();
            synth.resume?.();

            utterRef.current = null;
            setIsSpeaking(false);
            setIsPaused(false);

            const chosen = getVoiceForUtter();

            currentIdxRef.current = Math.max(0, Math.min(startIndex, chunks.length));
            setProgressPct(computeProgressForIndex(currentIdxRef.current));

            const speakNext = () => {
                if (playIdRef.current !== myId) return;

                const i = currentIdxRef.current;

                if (i >= chunks.length) {
                    setIsSpeaking(false);
                    setIsPaused(false);
                    utterRef.current = null;
                    setProgressPct(100);
                    return;
                }

                setProgressPct(computeProgressForIndex(i));

                const u = new SpeechSynthesisUtterance(chunks[i]);
                u.rate = rate;
                u.lang = navigator.language || "en-US";
                if (chosen) u.voice = chosen;

                u.onstart = () => {
                    if (playIdRef.current !== myId) return;
                    setIsSpeaking(true);
                    setIsPaused(false);

                    setTimeout(() => {
                        if (playIdRef.current === myId) {
                            window.dispatchEvent(new CustomEvent("acc:readaloud:play"));
                        }
                    }, 120);
                };

                u.onend = () => {
                    if (playIdRef.current !== myId) return;

                    currentIdxRef.current = i + 1;
                    setProgressPct(computeProgressForIndex(i + 1));

                    const delay = pauseMsRef.current[i] || 0;

                    if (delay > 0) {
                        setTimeout(() => {
                            if (playIdRef.current === myId) speakNext();
                        }, delay);
                        return;
                    }

                    speakNext();
                };

                u.onerror = () => {
                    if (playIdRef.current !== myId) return;
                    currentIdxRef.current = i + 1;
                    speakNext();
                };

                utterRef.current = u;

                setTimeout(() => {
                    if (playIdRef.current === myId) synth.speak(u);
                }, 30);
            };

            speakNext();
        },
        [rate, computeProgressForIndex, getVoiceForUtter]
    );

    const startSpeak = useCallback(() => {
        if (typeof window === "undefined") return;

        const sections = extractSectionsFromTargets();

        let chunks: string[] = [];
        let pauses: number[] = [];

        if (sections.length > 1) {
            for (const s of sections) {
                const sub = splitIntoChunks(s, 900);
                if (!sub.length) continue;

                for (const c of sub) {
                    chunks.push(c);
                    pauses.push(0);
                }

                if (pauses.length) pauses[pauses.length - 1] = SECTION_GAP_MS;
            }

            if (pauses.length) pauses[pauses.length - 1] = 0;
        } else {
            const text = sections[0] ?? "";
            chunks = splitIntoChunks(text, 900);
            pauses = chunks.map(() => 0);
        }

        chunksRef.current = chunks;
        pauseMsRef.current = pauses;

        lensRef.current = chunks.map((c) => c.length);
        totalCharsRef.current = lensRef.current.reduce((a, b) => a + b, 0);
        currentIdxRef.current = 0;

        setProgressPct(0);

        if (!chunks.length) {
            const synth = window.speechSynthesis;
            const myId = playIdRef.current + 1;
            playIdRef.current = myId;

            synth.cancel();
            synth.resume?.();

            const chosen = getVoiceForUtter();

            const fallback = new SpeechSynthesisUtterance("Text to speech is ready.");
            fallback.rate = rate;
            fallback.lang = navigator.language || "en-US";
            if (chosen) fallback.voice = chosen;

            fallback.onstart = () => {
                if (playIdRef.current !== myId) return;
                setIsSpeaking(true);
                setIsPaused(false);
                setTimeout(() => {
                    if (playIdRef.current === myId) {
                        window.dispatchEvent(new CustomEvent("acc:readaloud:play"));
                    }
                }, 120);
            };

            fallback.onend = () => {
                if (playIdRef.current !== myId) return;
                setIsSpeaking(false);
                setIsPaused(false);
                utterRef.current = null;
                setProgressPct(0);
            };

            fallback.onerror = () => {
                if (playIdRef.current !== myId) return;
                setIsSpeaking(false);
                setIsPaused(false);
                utterRef.current = null;
                setProgressPct(0);
            };

            utterRef.current = fallback;
            setTimeout(() => {
                if (playIdRef.current === myId) synth.speak(fallback);
            }, 30);

            return;
        }

        speakFromIndex(0);
    }, [rate, speakFromIndex, getVoiceForUtter]);

    const togglePlay = useCallback(() => {
        if (typeof window === "undefined") return;

        if (!isSpeaking) {
            startSpeak();
            return;
        }

        stop();
    }, [isSpeaking, startSpeak, stop]);

    useEffect(() => {
        if (lastRateRef.current === rate) return;
        lastRateRef.current = rate;

        if (!isSpeaking) return;
        if (isPaused) return;
        if (!chunksRef.current.length) return;

        speakFromIndex(currentIdxRef.current);
    }, [rate, isSpeaking, isPaused, speakFromIndex]);

    const stepLevel = useCallback(
        (dir: -1 | 1) => {
            const idx = LEVELS.indexOf(level);
            const next = LEVELS[clampIndex(idx + dir)];
            setLevel(next);
        },
        [level]
    );

    const SpeedLabel = ({ id, text, sub }: { id: Level; text: string; sub: string }) => {
        const active = level === id;
        return (
            <div className="flex flex-col items-center gap-0.5">
                <span className={`text-[12px] font-medium ${active ? "text-slate-900" : "text-slate-500"}`}>
                    {text}
                </span>
                <span className={`text-[10.5px] ${active ? "text-slate-700" : "text-slate-400"}`}>
                    {sub}
                </span>
                <span className={`h-[3px] w-8 rounded-full transition ${active ? "bg-violet-500" : "bg-transparent"}`} />
            </div>
        );
    };

    const barWidth = `${progressPct}%`;

    return (
        <div data-acc-ui className="grid gap-3">
            <div className="flex items-center justify-between">
                <div className="text-[14.5px] font-semibold text-slate-900">Text Play Speed</div>
                <div className="h-8 px-3 rounded-lg border-2 border-violet-400 bg-white text-[11.5px] font-semibold text-slate-900 flex items-center">
                    {rateLabel}
                </div>
            </div>

            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-violet-500 transition-all" style={{ width: barWidth }} />
            </div>

            <div className="flex items-center justify-center gap-10 py-1">
                <button
                    type="button"
                    onClick={() => stepLevel(-1)}
                    aria-label="Decrease speech speed"
                    className="p-2 rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    <svg width="34" height="34" viewBox="0 0 24 24" className="text-slate-900">
                        <path d="M11 7l-6 5 6 5V7zm8 0l-6 5 6 5V7z" fill="currentColor" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isSpeaking ? "Stop speech" : "Play speech"}
                    className="p-2 rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    {isSpeaking ? (
                        <svg width="34" height="34" viewBox="0 0 24 24" className="text-slate-900">
                            <path d="M6 6h12v12H6V6z" fill="currentColor" />
                        </svg>
                    ) : (
                        <svg width="34" height="34" viewBox="0 0 24 24" className="text-slate-900">
                            <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                        </svg>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => stepLevel(1)}
                    aria-label="Increase speech speed"
                    className="p-2 rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    <svg width="34" height="34" viewBox="0 0 24 24" className="text-slate-900">
                        <path d="M13 7v10l6-5-6-5zm-8 0v10l6-5-6-5z" fill="currentColor" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center justify-between px-1">
                <SpeedLabel id="low" text="low" sub="0.85x" />
                <SpeedLabel id="medium" text="Medium" sub="1.00x" />
                <SpeedLabel id="high" text="High" sub="1.25x" />
            </div>

            <div className="hidden">
                <button type="button" onClick={stop}>stop</button>
            </div>
        </div>
    );
}
