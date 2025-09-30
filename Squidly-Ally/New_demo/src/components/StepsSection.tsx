'use client';

import {useEffect, useRef, useState} from 'react';
import {motion, AnimatePresence, useInView} from 'framer-motion';
import {
    MessageSquareText,
    MonitorSmartphone,
    Link as LinkIcon,
    UserPlus,
    Mic,
    Video,
    ScreenShare,
    PhoneOff,
    Settings as Cog,
    MousePointerClick
} from 'lucide-react';
import setupImg from '../Photo/Setup.jpg';

type StepKey = 'setup' | 'launch' | 'communicate';

function ConsolePill({ className = '', onClick }: { className?: string; onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'inline-flex items-center justify-center',
                'rounded-[40px] px-10 py-3.5',
                'bg-[#6F57FF] text-white text-lg font-extrabold',
                'shadow-[0_12px_28px_rgba(111,87,255,.32)]',
                'hover:bg-[#5b45ff] active:translate-y-px',
                'transition-colors',
                className,
            ].join(' ')}
        >
            Console
        </button>
    );
}

export default function StepsSection() {
    const [active, setActive] = useState<StepKey>('setup');

    // —— 进入 Steps 区域时触发 Step1 的“手”动画 ——
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(sectionRef, { margin: '-20% 0px -30% 0px' }); // 进入视区才算
    const [playPointer, setPlayPointer] = useState(false); // 是否播放“手”的动画（Step1）
    const [pointerCycleKey, setPointerCycleKey] = useState(0); // 改 key 可以重新播放

    // 当滚动到 Steps 且当前是 setup 时播放；切到其他 step 则停止
    useEffect(() => {
        if (inView && active === 'setup') setPlayPointer(true);
        else setPlayPointer(false);
    }, [inView, active]);

    // 点击 console 时，循环这段动画：先隐藏再延迟显示
    const restartPointer = () => {
        setPlayPointer(false);
        requestAnimationFrame(() => {
            setPointerCycleKey((k) => k + 1);
            setPlayPointer(true);
        });
    };

    const order: Record<StepKey, number> = { setup: 1, launch: 2, communicate: 3 };

    const steps: Record<StepKey, { title: string; bullets: string[]; accent: string }> = {
        setup: {
            title: 'Setup',
            bullets: [
                'Create an account or sign in',
                'Choose a mode: Eye Gaze / Tool Bar / Schedule',
                'Quick preferences: camera, mic, accessibility',
            ],
            accent: 'from-violet-500 to-fuchsia-500',
        },
        launch: {
            title: 'Launch',
            bullets: [
                'Create a session and get a shareable link',
                'Invite participants with one tap',
                'Start the call',
            ],
            accent: 'from-indigo-500 to-violet-500',
        },
        communicate: {
            title: 'Communicate',
            bullets: [
                'Use the Tool Bar for quick actions',
                'Eye Gaze pointer & messaging together',
                'Natural, smooth collaboration',
            ],
            accent: 'from-emerald-500 to-teal-500',
        },
    };

    return (
        <section
            ref={sectionRef}
            className="relative mx-auto max-w-[1200px] px-6 py-20 lg:py-28"
        >
            <div className="grid items-start gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
                <div>
                    <h2 className="mb-8 text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-[#7A5CFF]">
                        Steps
                    </h2>

                    <ol className="relative">
                        {(Object.keys(steps) as StepKey[]).map((key, idx) => {
                            const s = steps[key];
                            const isActive = active === key;
                            return (
                                <li key={key} className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setActive(key)}
                                        className={[
                                            'flex w-full items-center gap-4 py-4 transition-colors',
                                            'text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F57FF]/40 rounded-md',
                                            isActive ? 'text-slate-900' : 'text-slate-700 hover:text-slate-900',
                                        ].join(' ')}
                                    >
                    <span
                        className={[
                            'grid h-9 w-9 place-items-center rounded-full text-white text-[13px] font-semibold',
                            'bg-gradient-to-br',
                            s.accent,
                            'shadow-[0_8px_18px_rgba(122,59,255,.15)]',
                        ].join(' ')}
                    >
                      {order[key]}
                    </span>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-[20px] font-semibold leading-none">{s.title}</div>
                                            <div
                                                className={[
                                                    'mt-2 h-[4px] w-24 rounded-full',
                                                    isActive ? `bg-gradient-to-r ${s.accent}` : 'bg-slate-200/70',
                                                ].join(' ')}
                                            />
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isActive && (
                                            <motion.div
                                                key={`${key}-panel`}
                                                initial={{ height: 0, opacity: 0, y: -6 }}
                                                animate={{ height: 'auto', opacity: 1, y: 0 }}
                                                exit={{ height: 0, opacity: 0, y: -6 }}
                                                transition={{ duration: 0.28, ease: 'easeOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-[52px] pr-2 pb-6">
                                                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#F1EDFF] px-3 py-1 text-xs font-semibold text-[#6F57FF] ring-1 ring-[#E3DDFF]">
                                                        STEP {order[key]}
                                                    </div>
                                                    <ul className="space-y-2 text-[16px] text-slate-800">
                                                        {s.bullets.map((b, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <span className="mt-[9px] inline-block h-[6px] w-[6px] rounded-full bg-slate-400/80" />
                                                                <span>{b}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {idx < 2 && (
                                        <div className="my-1 h-px w-full bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>

                {/* 右侧：Step1=图片+按钮；Step2/3=浏览器预览 */}
                <div className="relative self-start">
                    <AnimatePresence mode="wait">
                        {active === 'setup' ? (
                            <motion.div
                                key="setup-image"
                                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.995 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="mx-auto w-full max-w-[650px] relative"
                            >
                                <figure className="overflow-hidden rounded-[24px] bg-white ring-1 ring-violet-200 shadow-[0_30px_80px_rgba(122,59,255,.12)]">
                                    <img src={setupImg} alt="Setup preview" className="block w-full h-auto" />
                                </figure>

                                {/* Console 按钮：图片外、右下角 */}
                                <div className="mt-4 flex justify-end">
                                    <ConsolePill
                                        onClick={() => {
                                            restartPointer(); // 点击后重播“手势”
                                        }}
                                    />
                                </div>

                                {/* Step1 手势引导：定位到右下角，用 x/y 动画滑到 Console 按钮位置 */}
                                <AnimatePresence>
                                    {playPointer && (
                                        <motion.div
                                            key={`pointer-${pointerCycleKey}`}
                                            className="pointer-events-none absolute right-4 -bottom-6 z-10"
                                            initial={{ x: -340, y: -20, opacity: 0 }}
                                            animate={{
                                                x: 0,
                                                y: 0,
                                                opacity: 1,
                                                transition: { duration: 2.1, ease: 'easeOut' }
                                            }}
                                            onAnimationComplete={() => {
                                                // 到位后做一下“点击”反馈，再循环
                                                setTimeout(() => {
                                                    setPointerCycleKey((k) => k + 1);
                                                }, 1600);
                                            }}
                                        >
                                            {/* 点击反馈圈 */}
                                            <motion.span
                                                className="absolute -right-1 -bottom-1 h-10 w-10 rounded-full border-2 border-white/70"
                                                initial={{ scale: 0.6, opacity: 0.0 }}
                                                animate={{
                                                    scale: [0.6, 1.15, 1],
                                                    opacity: [0, 1, 0],
                                                }}
                                                transition={{ duration: 0.9, ease: 'easeOut', repeat: 1, repeatDelay: 0.6 }}
                                            />
                                            {/* 手形/指针图标 */}
                                            <div className="rounded-full bg-[#6F57FF] shadow-[0_12px_28px_rgba(111,87,255,.32)] p-2">
                                                <MousePointerClick className="h-5 w-5 text-white" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <DeviceFrame key={`frame-${active}`} stepNo={order[active]}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={active}
                                        initial={{ opacity: 0, y: 16, scale: 0.99 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.995 }}
                                        transition={{ duration: 0.4, ease: 'easeOut' }}
                                        className="h-full"
                                    >
                                        {active === 'launch' ? <ScreenLaunch /> : <ScreenCommunicate />}
                                    </motion.div>
                                </AnimatePresence>
                            </DeviceFrame>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

/* ——— 设备外框（与之前一致） ——— */
function DeviceFrame({ children, stepNo }: { children: React.ReactNode; stepNo: number }) {
    return (
        <div className="mx-auto w-full max-w-[560px]">
            <div className="relative rounded-[2.1rem] p-[1px] bg-gradient-to-br from-white via-violet-100 to-white">
                <div className="rounded-[2rem] bg-white ring-1 ring-violet-200 overflow-hidden">
                    <div className="flex items-center justify-between gap-2 px-4 h-12 bg-violet-50 border-b border-violet-200/60">
                        <div className="flex items-center gap-2 text-neutral-700">
                            <MonitorSmartphone className="w-4 h-4 text-violet-500" />
                            <span className="text-sm font-medium">squidly.com.au/#home-page</span>
                        </div>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
              STEP {stepNo}
            </span>
                    </div>
                    <div className="relative h-[560px]">{children}</div>
                </div>
            </div>
        </div>
    );
}

/* ——— Step 2：Launch（回到你要的样式） ——— */
function ScreenLaunch() {
    return (
        <div className="absolute inset-0 p-6">
            {/* 柔光背景 */}
            <div
                className="absolute inset-0 rounded-[1.75rem]"
                style={{
                    background:
                        'radial-gradient(60% 55% at 65% 0%, rgba(99,102,241,.18), transparent 60%), radial-gradient(60% 50% at 20% 85%, rgba(168,85,247,.16), transparent 65%)',
                }}
            />
            <div className="relative h-full flex flex-col gap-6">
                {/* 顶部：share + invite */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/90 ring-1 ring-violet-200 p-4">
                        <div className="flex items-center gap-2 text-neutral-800 font-medium">
                            <LinkIcon className="w-4 h-4 text-violet-600" />
                            Share link
                        </div>
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-violet-50 ring-1 ring-violet-200 px-3 py-2 text-sm">
                            <span className="truncate text-neutral-800">https://squidly.com/s/abc-123</span>
                            <button className="ml-auto rounded-md bg-white ring-1 ring-violet-200 px-2 py-1 text-xs text-violet-700">
                                Copy
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white/90 ring-1 ring-violet-200 p-4">
                        <div className="flex items-center gap-2 text-neutral-800 font-medium">
                            <UserPlus className="w-4 h-4 text-violet-600" />
                            Invite teammates
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 ring-2 ring-white/70"
                                />
                            ))}
                            <button className="ml-1 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 bg-violet-50 ring-1 ring-violet-200">
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* 中部：Start Session 大按钮 */}
                <div className="flex-1 grid place-items-center">
                    {/* Host Meeting 按钮（白底卡片+左侧紫圆图标） */}
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={[
                            "group inline-flex items-center gap-4 rounded-[22px]",
                            "bg-white px-6 py-4",
                            "shadow-[0_10px_28px_rgba(0,0,0,.06)] ring-1 ring-black/5",
                            "transition-all duration-200"
                        ].join(" ")}
                    >
  <span
      className="grid h-12 w-12 place-items-center rounded-full bg-[#6F72FF] shadow-[inset_0_-2px_8px_rgba(0,0,0,.08)]"
      aria-hidden="true"
  >
    <Video className="h-6 w-6 text-white" />
  </span>
                        <span className="text-[18px] tracking-wide font-extrabold text-[#2A2F3A]">
    HOST MEETING
  </span>
                    </motion.button>

                </div>

                {/* 底部：Quick preferences */}
                <div className="rounded-xl bg-white/90 ring-1 ring-violet-200 p-4">
                    <div className="text-neutral-800 font-medium">Quick preferences</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {['Cam', 'Mic', 'Subtitles'].map((t) => (
                            <button
                                key={t}
                                className="rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-200 px-3 py-1 text-sm"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ——— Step 3：Communicate（回到你要的样式） ——— */
function ScreenCommunicate() {
    return (
        <div className="absolute inset-0 flex flex-col">
            {/* 视频区域 */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
                <div className="relative rounded-xl overflow-hidden ring-1 ring-violet-200 bg-gradient-to-br from-[#d9d6ff] to-white">
                    <div className="absolute inset-0 grid place-items-center text-neutral-700/70 font-medium">
                        Host video
                    </div>
                    <div className="absolute left-3 bottom-3 rounded-md bg-white/85 px-2 py-1 text-xs ring-1 ring-violet-200">
                        host
                    </div>
                </div>
                <div className="relative rounded-xl overflow-hidden ring-1 ring-violet-200 bg-gradient-to-br from-[#e8f8f2] to-white">
                    <div className="absolute inset-0 grid place-items-center text-neutral-700/70 font-medium">
                        Participant
                    </div>
                    <div className="absolute left-3 bottom-3 rounded-md bg-white/85 px-2 py-1 text-xs ring-1 ring-violet-200">
                        participant
                    </div>
                </div>
            </div>

            {/* 工具条 */}
            <div className="bg-white/85 backdrop-blur ring-1 ring-violet-200 p-3">
                <div className="grid grid-cols-5 gap-3">
                    {[
                        { label: 'camera', Icon: Video },
                        { label: 'mic', Icon: Mic, active: true },
                        { label: 'share', Icon: ScreenShare },
                        { label: 'settings', Icon: Cog },
                        { label: 'end', Icon: PhoneOff },
                    ].map(({ label, Icon, active }) => (
                        <button
                            key={label}
                            className={[
                                'h-16 w-full rounded-xl ring-1 text-sm flex flex-col items-center justify-center gap-1',
                                active
                                    ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white ring-emerald-300/40 shadow-[0_10px_24px_rgba(16,185,129,.25)]'
                                    : 'bg-white text-neutral-800 ring-violet-200',
                            ].join(' ')}
                        >
                            <Icon className={active ? 'w-5 h-5 text-white' : 'w-5 h-5 text-violet-600'} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 提示气泡（右下） */}
            <div className="pointer-events-none absolute right-4 bottom-24 flex items-center gap-2">
                <div className="rounded-full bg-violet-100 p-2 ring-1 ring-violet-200">
                    <MessageSquareText className="w-4 h-4 text-violet-700" />
                </div>
                <div className="max-w-[240px] rounded-2xl bg-white ring-1 ring-violet-200 px-3 py-2 text-sm text-neutral-800">
                    Messages and eye-gaze pointer work together.
                </div>
            </div>
        </div>
    );
}
