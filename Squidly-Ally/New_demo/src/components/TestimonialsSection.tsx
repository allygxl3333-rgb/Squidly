'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

/**
 * Squidly Testimonials — Asymmetric layout (YouTube on left)
 * -------------------------------------------------------------
 * - Left: YouTube iframe fills the entire feature card (no whitespace).
 * - Right: Two compact comment cards.
 * - No Next/Image dependency; avatars use native <img>.
 * - Inherits global page background.
 */

const ACCENT = '#6F57FF';

const TESTIMONIALS = [
    // Feature YouTube video card (first item is the large card)
    {
        type: 'video',
        // Embed URL with sensible params: muted autoplay loop, minimal branding
        embedUrl:
            'https://www.youtube.com/embed/DH7jGSoaORk?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1&loop=1&playlist=DH7jGSoaORk&controls=1',
        title: 'What our users actually think',
        caption: 'Clips from sessions and interviews',
    },
    // Right column comment cards
    {
        type: 'comment',
        quote:
            'I know that no matter what happens, my classmate will always be here at the end of the day, and I feel safe learning together.',
        name: 'Fuad Ferdous',
        role: 'Student',
        avatar: '/images/avatars/fuad.jpg', // optional
    },
    {
        type: 'comment',
        quote:
            "Started using Squidly yesterday and I'm blown away. Engaging, accessible, and inclusive for all my students.",
        name: 'Gabrielle Fisher',
        role: 'Special Ed Teacher',
        avatar: '/images/avatars/gabrielle.jpg', // optional
    },
];

export default function TestimonialsSection() {
    return (
        <section className="relative mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto">
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

            {/* Asymmetric grid: big video + 2 compact comments */}
            <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
                {/* Feature video card (spans 2x2) */}
                <VideoCard
                    {...(TESTIMONIALS[0] as any)}
                    className="lg:col-span-2 lg:row-span-2"
                />

                {/* Two comment cards in right column */}
                {TESTIMONIALS.slice(1).map((t, i) => (
                    <CommentCard key={i} {...(t as any)} delay={(i + 1) * 0.05} />
                ))}
            </div>
        </section>
    );
}

function VideoCard({ embedUrl, title, caption, className = '' }: any) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0% -10% 0%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`group relative overflow-hidden rounded-[44px] bg-white ring-1 ring-slate-200/80 shadow-[0_24px_60px_rgba(18,18,23,.06)] ${className}`}
            style={{ borderBottomLeftRadius: '160px' }}
        >
            {/* YouTube fills the entire card */}
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

            {/* No overlay text; clean video */}

            {/* Ensure card has a minimum height so grid rows size nicely */}
            <div className="invisible h-[320px] lg:h-[520px]" />
        </motion.article>
    );
}

function CommentCard({ quote, name, role, avatar, delay = 0 }: any) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0% -10% 0%' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay }}
            className="group relative overflow-hidden rounded-[28px] bg-white ring-1 ring-slate-200/80 shadow-[0_24px_60px_rgba(18,18,23,.06)]"
            style={{ borderBottomLeftRadius: '120px' }}
        >
            <div className="px-7 pb-8 pt-6">
                <Quote className="h-6 w-6" color={ACCENT} />
                <p className="mt-2 text-[18px] leading-8 text-[#1A1E27]">{quote}</p>

                <div className="mt-6 flex items-center gap-3">
                    {avatar ? (
                        <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
                    ) : null}
                    <div>
                        <p className="text-[15px] font-semibold" style={{ color: ACCENT }}>
                            {name}
                        </p>
                        <p className="text-[14px] text-slate-500">{role}</p>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
