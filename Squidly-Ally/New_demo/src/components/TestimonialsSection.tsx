'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

/**
 * Testimonials — Left video + Right auto vertical scroller
 * 右侧列自动上下滚动（yoyo），滚动时无限循环；hover 暂停。
 */

const ACCENT = '#6F57FF';

// 你可以继续往里加更多条目；会自动加入滚动
const TESTIMONIALS = [
    // 左侧大视频
    {
        type: 'video',
        embedUrl:
            'https://www.youtube.com/embed/DH7jGSoaORk?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1&loop=1&playlist=DH7jGSoaORk&controls=1',
        title: 'What our users actually think',
        caption: 'Clips from sessions and interviews',
    },

    // 右侧滚动卡片
    {
        type: 'comment',
        quote:
            'I know that no matter what happens, my classmate will always be here at the end of the day, and I feel safe learning together.',
        name: 'Fuad Ferdous',
        role: 'Student',
        avatar: '/images/avatars/fuad.jpg',
    },
    {
        type: 'comment',
        quote:
            "Started using Squidly yesterday and I'm blown away. Engaging, accessible, and inclusive for all my students.",
        name: 'Gabrielle Fisher',
        role: 'Special Ed Teacher',
        avatar: '/images/avatars/gabrielle.jpg',
    },
    {
        type: 'comment',
        quote:
            'Squidly opens up a whole new world of communication and access for people with complex needs.',
        name: 'Dr Annemarie Murphy',
        role: 'Senior Speech Pathologist',
        avatar: '/images/avatars/annemarie.jpg',
    },
];

export default function TestimonialsSection() {
    return (
        <section className="relative mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
            {/* Heading */}
            <div className="mx-auto max-w-3xl text-center">
        <span
            className="inline-block rounded-full bg-[#F1EDFF] px-3 py-1 text-xs font-semibold ring-1 ring-[#E3DDFF]"
            style={{ color: ACCENT }}
        >
          What our community is saying
        </span>
                <h2 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#2A2F3A]">
                    Don’t take our word for it, take theirs
                </h2>
                <p className="mt-3 text-[17px] leading-7 text-slate-600">
                    Real voices from clinicians, students and families.
                </p>
            </div>

            {/* Grid: 左大右窄；右侧为滚动列 */}
            <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
                {/* 左侧视频：占 2x2 */}
                <VideoCard
                    {...(TESTIMONIALS[0] as any)}
                    className="lg:col-span-2 lg:row-span-2"
                />

                {/* 右侧自动上下滚动列（占两行） */}
                <RightColumnScroller items={TESTIMONIALS.slice(1)} />
            </div>

            {/* ✅ 注入滚动 keyframes + hover 暂停 */}
            <style>{`
              @keyframes squidly-vscroll {
                0%   { transform: translateY(0); }
                100% { transform: translateY(-50%); } /* 往上滚一半（列表复制了两份） */
              }
              .squidly-scroller:hover .squidly-auto-scroll {
                animation-play-state: paused;
              }
            `}</style>
        </section>
    );
}

/* ---------------- Right auto-scroller ---------------- */

function RightColumnScroller({
                                 items,
                             }: {
    items: Array<{ quote: string; name: string; role: string; avatar?: string }>;
}) {
    // 复制一份，实现无缝循环
    const LOOP = [...items, ...items];

    // 展示高度：两张卡 + 间距（数值可按视觉需要微调）
    const containerHeight = '600px'; // 约等于两张卡的总高度

    return (
        <div className="lg:col-span-1 lg:row-span-2">
            <div
                className="squidly-scroller relative overflow-hidden group"
                style={{ height: containerHeight, borderRadius: 0 }}
            >
                <motion.div
                    className="squidly-auto-scroll flex flex-col gap-6 will-change-transform"
                    // ❗ 不再用 framer 的 animate（否则无法用 animationPlayState 暂停）
                    // 用 CSS 动画控制滚动 & 暂停
                    style={{
                        animation: `squidly-vscroll 26s linear infinite alternate`,
                    }}
                    // ✅ 保障型：JS 也设置一下（即使没加载样式也能暂停/继续）
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
                    }}
                >
                    {LOOP.map((t, i) => (
                        <CommentCard key={i} {...(t as any)} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

/* ---------------- Cards ---------------- */

function VideoCard({ embedUrl, title, className = '' }: any) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0% -10% 0%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`group relative overflow-hidden rounded-[44px] bg-white ring-1 ring-slate-200/80 shadow-[0_24px_60px_rgba(18,18,23,.06)] ${className}`}
            style={{ borderBottomLeftRadius: '160px' }}
        >
            <div className="absolute inset-0">
                <iframe
                    className="h-full w-full"
                    src={embedUrl}
                    title={title || 'User testimonials'}
                    loading="lazy"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
            <div className="invisible h-[320px] lg:h-[520px]" />
        </motion.article>
    );
}

function CommentCard({
                         quote,
                         name,
                         role,
                         avatar,
                     }: {
    quote: string;
    name: string;
    role: string;
    avatar?: string;
}) {
    return (
        <article
            className="relative overflow-hidden rounded-[28px] ring-1 ring-[#D9CBFF]"
            // ✅ 渐变更明显（更深的紫色）
            style={{
                background:
                    'linear-gradient(180deg, #F6F0FF 0%, #E6D6FF 55%, #D9C7FF 100%)',
            }}
        >
            <div className="px-7 pb-8 pt-6">
                <Quote className="h-6 w-6" color={ACCENT} />
                <p className="mt-2 text-[18px] leading-8 text-[#1A1E27]">{quote}</p>

                <div className="mt-6 flex items-center gap-3">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={name}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : null}
                    <div>
                        <p className="text-[15px] font-semibold" style={{ color: ACCENT }}>
                            {name}
                        </p>
                        <p className="text-[14px] text-slate-500">{role}</p>
                    </div>
                </div>
            </div>
        </article>
    );
}
