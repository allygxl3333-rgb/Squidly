'use client';

import { useState } from 'react';
import { Check, Minus, ChevronDown } from 'lucide-react';

/**
 * Squidly Pricing Page (matched to provided mock)
 * ------------------------------------------------------------
 * Fixes for the "second section" (Features table):
 *  - Removed sticky left column (no large white block overlay)
 *  - Plain check icons (no filled chips) and em-dash for missing
 *  - Row separators only; clean, white table like the mock
 */

const ACCENT = '#6F57FF';

const PLANS = [
    {
        id: 'basic',
        name: 'Basic',
        tagline: 'Best for getting started',
        priceBadge: 'Free',
        cta: 'Start free',
        highlight: false,
    },
    {
        id: 'advanced',
        name: 'Advanced',
        tagline: 'Best for individuals',
        priceBadge: '$20/month',
        cta: 'Choose Advanced',
        highlight: true,
    },
    {
        id: 'pro',
        name: 'Pro',
        tagline: 'Best for teams',
        priceBadge: '$35/month',
        cta: 'Choose Pro',
        highlight: false,
    },
] as const;

type PlanId = (typeof PLANS)[number]['id'];

type Cell = { type: 'text'; value: string } | { type: 'check'; value: boolean };

type Row = { feature: string; cells: Record<PlanId, Cell> };

const ROWS: Row[] = [
    {
        feature: 'Meeting minutes',
        cells: {
            basic: { type: 'text', value: 'Limited' },
            advanced: { type: 'text', value: '480min/month' },
            pro: { type: 'text', value: 'Unlimited' },
        },
    },
    {
        feature: 'Quiz and grid editor',
        cells: {
            basic: { type: 'text', value: 'Limited' },
            advanced: { type: 'text', value: 'Higher limits' },
            pro: { type: 'text', value: 'Unlimited' },
        },
    },
    {
        feature: 'Customer Support',
        cells: {
            basic: { type: 'text', value: '\u2014' },
            advanced: { type: 'text', value: 'Standard' },
            pro: { type: 'text', value: 'Priority' },
        },
    },
    {
        feature: 'Session scheduling',
        cells: {
            basic: { type: 'check', value: false },
            advanced: { type: 'check', value: true },
            pro: { type: 'check', value: true },
        },
    },
    {
        feature: 'SCIM user management',
        cells: {
            basic: { type: 'check', value: false },
            advanced: { type: 'check', value: true },
            pro: { type: 'check', value: true },
        },
    },
    {
        feature: 'Admin dashboard with usage stats',
        cells: {
            basic: { type: 'check', value: false },
            advanced: { type: 'check', value: false },
            pro: { type: 'check', value: true },
        },
    },
    {
        feature: 'Priority access to new features',
        cells: {
            basic: { type: 'check', value: false },
            advanced: { type: 'check', value: false },
            pro: { type: 'check', value: true },
        },
    },
];

const FAQ_ITEMS = [
    {
        q: "Why isn’t Squidly completely free?",
        a: 'Hosting calls and ML models cost quite a bit to run. To grow Squidly sustainably without compromising our service quality, we need to cover our costs.',
    },
    {
        q: 'Where does Squidly use custom models?',
        a: 'Squidly is powered by a combination of custom models and API models. Our custom models power features like webcam eye gaze. They work alongside API models to improve the intelligence and speed of the Session.',
    },
    {
        q: 'Who is Squidly for?',
        a: 'Squidly supports clinicians, educators, carers, and individuals who use assistive technology like eye‑gaze, switches, or communication boards or have complex communication needs.',
    },
    {
        q: 'Do I need special hardware or software to use Squidly?',
        a: 'No. Squidly is browser‑based and works seamlessly without additional hardware, software installations or AAC devices.',
    },
    {
        q: 'How do the plan limits work?',
        a: "If you go over your limit, we'll kindly ask you to upgrade your licence.",
    },
    {
        q: 'Is Squidly available in my country?',
        a: 'Squidly is available globally, accessible through standard web browsers.',
    },
    {
        q: 'What assistive features does Squidly offer?',
        a: 'Squidly includes webcam eye‑gaze control, customisable communication boards and quizzes, switch access, non‑standard speech transcription, low‑vision modes, text‑to‑speech, remote setup mode and much more. We’re continually working with clinicians and AAC users to add more features as we grow.',
    },
    {
        q: 'Do my clients need an account?',
        a: "No, accessibility first: your clients don't need to register or fill out any personal information. Click the secure meeting link and join immediately.",
    },
    {
        q: 'Is Squidly secure and compliant?',
        a: 'Absolutely. Squidly employs end‑to‑end encryption and follows strict data privacy rules, complying with Australian data regulations and laws to ensure your privacy and security.',
    },
];

export default function PricingPage() {
    const [active, setActive] = useState<string>(FAQ_ITEMS[0].q);

    return (
        <main className="mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
            {/* Plans Header */}
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1E27]">Pricing</h1>
                <p className="mt-3 text-slate-600 text-[17px]">Simple plans that scale with your practice.</p>
            </header>

            {/* Plans strip */}
            <section aria-label="Plans" className="grid gap-6 md:grid-cols-3">
                {PLANS.map((p) => (
                    <article
                        key={p.id}
                        className={`rounded-3xl ring-1 p-6 relative bg-white shadow-[0_18px_50px_rgba(18,18,23,.06)] ${
                            p.highlight ? 'ring-violet-300' : 'ring-slate-200'
                        }`}
                    >
                        <h3 className="text-2xl font-semibold tracking-tight text-[#1A1E27]">{p.name}</h3>
                        <p className="text-sm mt-1 text-slate-500">{p.tagline}</p>

                        <div
                            className="mt-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
                            style={{ color: ACCENT, border: `1px solid ${ACCENT}33` }}
                        >
                            {p.priceBadge}
                        </div>

                        <button
                            className="mt-6 w-full rounded-xl py-2.5 text-[15px] font-semibold text-white"
                            style={{ background: p.highlight ? ACCENT : '#8B8EA3' }}
                        >
                            {p.cta}
                        </button>
                    </article>
                ))}
            </section>

            {/* Feature comparison */}
            <section className="mt-16">
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0 text-[15px]">
                        <thead>
                        <tr className="border-b border-slate-200/80">
                            {/* Left column header now shows big "Features" and aligns with plan names */}
                            <th className="text-left py-6 pr-4 w-[320px] align-bottom">
                                <div className="text-[28px] md:text-[32px] font-extrabold tracking-tight text-[#1A1E27]">Features</div>
                            </th>
                            {PLANS.map((p) => (
                                <th key={p.id} className="text-left py-6 px-4 align-bottom">
                                    <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1A1E27]">{p.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">{p.tagline}</div>
                                    <div
                                        className="mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                        style={{ color: ACCENT, border: `1px solid ${ACCENT}33` }}
                                    >
                                        {p.priceBadge}
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {ROWS.map((row) => (
                            <tr key={row.feature} className="border-t border-slate-200/80">
                                <th
                                    scope="row"
                                    className="text-left font-medium text-slate-700 py-4 pr-4 w-[320px]"
                                >
                                    {row.feature}
                                </th>

                                {PLANS.map((p) => (
                                    <td key={p.id} className="py-4 px-4 text-slate-800">
                                        <Cell cell={row.cells[p.id]} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FAQ */}
            <section className="mt-20">
                <h2 className="text-2xl font-bold tracking-tight text-[#1A1E27]">Frequently Asked Questions</h2>
                <div className="mt-6 rounded-3xl p-1" style={{ border: `2px dashed ${ACCENT}66` }}>
                    <div className="divide-y divide-slate-200 rounded-3xl bg-white/60 backdrop-blur">
                        {FAQ_ITEMS.map((item) => (
                            <FaqRow
                                key={item.q}
                                item={item}
                                open={active === item.q}
                                onToggle={() => setActive(active === item.q ? '' : item.q)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

function Cell({ cell }: { cell: Cell }) {
    if (cell.type === 'text') {
        return <span className="text-[15px] text-slate-800">{cell.value}</span>;
    }

    // Mock uses plain checks (no filled circle) and em-dash for false
    return cell.value ? (
        <span className="inline-flex items-center">
      <Check className="h-5 w-5" style={{ color: ACCENT }} />
    </span>
    ) : (
        <span className="text-slate-400">—</span>
    );
}

function FaqRow({ item, open, onToggle }: { item: { q: string; a: string }; open: boolean; onToggle: () => void }) {
    return (
        <div className="px-5 md:px-6">
            <button
                className="flex w-full items-center justify-between py-4 text-left"
                aria-expanded={open}
                onClick={onToggle}
            >
                <span className="text-[16px] font-semibold text-[#1A1E27]">{item.q}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: ACCENT }} />
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <p className="pb-4 text-[15px] leading-7 text-slate-600">{item.a}</p>
                </div>
            </div>
        </div>
    );
}
