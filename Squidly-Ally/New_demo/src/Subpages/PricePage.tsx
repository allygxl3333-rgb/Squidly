'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
// === logos (resolve by bundler) ===
import cpaLogo   from '../Professionals_logos/cpa.png';
import usydLogo  from '../Professionals_logos/usyd.png';
import arataLogo from '../Professionals_logos/arata.png';
import rmitLogo  from '../Professionals_logos/rmit.png';
import atsaLogo  from '../Professionals_logos/atsa.png';

/* ===== Colors ===== */
const PILL_PURPLE = '#8B78DC';
const PILL_PURPLE_SOFT = 'rgba(139,120,220,0.08)';
const PILL_PURPLE_BORDER = 'rgba(139,120,220,0.35)';
const CHECK_PURPLE = '#6F57FF';
const ROW_DIVIDER = '#E6E8EF';

/* ===== Trusted by (logos) ===== */
const TRUSTED_LOGOS = [
    { name: 'Cerebral Palsy Alliance',    src: cpaLogo },
    { name: 'The University of Sydney',   src: usydLogo },
    { name: 'arata',                      src: arataLogo },
    { name: 'RMIT University',            src: rmitLogo },
    { name: 'atsa',                       src: atsaLogo },
] as const;

/* ===== Plans ===== */
const PLANS = [
    { id: 'basic',    name: 'Basic',    tagline: 'Best for getting started', priceBadge: 'Free',        cta: 'Start free' },
    { id: 'advanced', name: 'Advanced', tagline: 'Best for individuals',     priceBadge: '$20/month',   cta: 'Choose Advanced' },
    { id: 'pro',      name: 'Pro',      tagline: 'Best for teams',           priceBadge: '$35/month',   cta: 'Choose Pro' },
] as const;

type PlanId = (typeof PLANS)[number]['id'];
type Cell = { type: 'text'; value: string } | { type: 'check'; value: boolean };

type SectionRow = { section: string };
type FeatureRow = { feature: string; cells: Record<PlanId, Cell> };
type Row = SectionRow | FeatureRow;

const ROWS: Row[] = [
    { feature: 'Meeting minutes', cells: { basic:{type:'text',value:'Limited'}, advanced:{type:'text',value:'480min/month'}, pro:{type:'text',value:'Unlimited'} } },
    { feature: 'Quiz and grid editor', cells: { basic:{type:'text',value:'Limited'}, advanced:{type:'text',value:'Higher limits'}, pro:{type:'text',value:'Unlimited'} } },
    { feature: 'Customer Support', cells: { basic:{type:'text',value:'—'}, advanced:{type:'text',value:'Standard'}, pro:{type:'text',value:'Priority'} } },
    { feature: 'Admin dashboard with usage stats', cells: { basic:{type:'check',value:false}, advanced:{type:'check',value:false}, pro:{type:'check',value:true} } },
    { feature: 'Priority access to new features', cells: { basic:{type:'check',value:false}, advanced:{type:'check',value:false}, pro:{type:'check',value:true} } },

    // —— Admins
    { section: 'Admins' },
    { feature: 'Usage analytics and reporting', cells: { basic:{type:'check',value:true},  advanced:{type:'check',value:true},  pro:{type:'check',value:true} } },
    { feature: 'Invoice /PO billing',          cells: { basic:{type:'check',value:true},  advanced:{type:'check',value:true},  pro:{type:'check',value:true} } },
    { feature: 'Centralised team billing',     cells: { basic:{type:'check',value:false}, advanced:{type:'check',value:true},  pro:{type:'check',value:true} } },
    { feature: 'Role-based access control',    cells: { basic:{type:'check',value:false}, advanced:{type:'check',value:true},  pro:{type:'check',value:true} } },
    { feature: 'SCIM user management',         cells: { basic:{type:'check',value:false}, advanced:{type:'check',value:true},  pro:{type:'check',value:true} } },

    // —— Pre and post consultation
    { section: 'Pre and post consultation' },
    { feature: 'Scheduling',                   cells: { basic:{type:'text',value:'Unlimited'}, advanced:{type:'text',value:'Unlimited'}, pro:{type:'text',value:'Unlimited'} } },
    { feature: 'Customisable AAC boards',      cells: { basic:{type:'text',value:'1'},         advanced:{type:'text',value:'5'},          pro:{type:'text',value:'Unlimited'} } },
    { feature: 'Customisable quizzes',         cells: { basic:{type:'text',value:'1'},         advanced:{type:'text',value:'5'},          pro:{type:'text',value:'Unlimited'} } },
    { feature: 'Virtual waiting area',         cells: { basic:{type:'check',value:true},       advanced:{type:'check',value:true},        pro:{type:'check',value:true} } },
    { feature: 'Comprehensive data reporting', cells: { basic:{type:'check',value:true},       advanced:{type:'check',value:true},        pro:{type:'check',value:true} } },

    // —— Support
    { section: 'Support' },
    { feature: 'Technical support',                cells: { basic:{type:'check',value:true},  advanced:{type:'check',value:true}, pro:{type:'text',value:'Custom'} } },
    { feature: 'Detailed customer success manager',cells: { basic:{type:'text',value:'—'},     advanced:{type:'text',value:'—'},   pro:{type:'check',value:true} } },
    { feature: 'Personalised staff onboarding',    cells: { basic:{type:'text',value:'—'},     advanced:{type:'text',value:'—'},   pro:{type:'check',value:true} } },

    // —— Privacy
    { section: 'Privacy' },
    { feature: 'End-to-end encryption',        cells: { basic:{type:'check',value:true}, advanced:{type:'check',value:true}, pro:{type:'check',value:true} } },
    { feature: 'Enterprise-grade security',    cells: { basic:{type:'check',value:true}, advanced:{type:'check',value:true}, pro:{type:'check',value:true} } },
    { feature: 'HIPAA compliant',              cells: { basic:{type:'check',value:true}, advanced:{type:'check',value:true}, pro:{type:'check',value:true} } },
    { feature: 'GDPR control',                 cells: { basic:{type:'check',value:true}, advanced:{type:'check',value:true}, pro:{type:'check',value:true} } },
    { feature: 'SAML/OIDC SSO',                cells: { basic:{type:'check',value:true}, advanced:{type:'check',value:true}, pro:{type:'check',value:true} } },
    { feature: 'Custom Security Review',       cells: { basic:{type:'text',value:'—'},   advanced:{type:'text',value:'—'},   pro:{type:'check',value:true} } },
];

const FAQ_ITEMS = [
    { q: 'Why isn’t Squidly completely free?', a: 'Hosting calls and ML models cost quite a bit to run. To grow Squidly sustainably without compromising our service quality, we need to cover our costs.' },
    { q: 'Where does Squidly use custom models?', a: 'Squidly is powered by a combination of custom models and API models. Our custom models power features like webcam eye gaze. They work alongside API models to improve the intelligence and speed of the Session.' },
    { q: 'Who is Squidly for?', a: 'Squidly supports clinicians, educators, carers, and individuals who use assistive technology like eye-gaze, switches, or communication boards or have complex communication needs.' },
    { q: 'Do I need special hardware or software to use Squidly?', a: 'No. Squidly is browser-based and works seamlessly without additional hardware, software installations or AAC devices.' },
    { q: 'How do the plan limits work?', a: "If you go over your limit, we'll kindly ask you to upgrade your licence." },
    { q: 'Is Squidly available in my country?', a: 'Squidly is available globally, accessible through standard web browsers.' },
    { q: 'What assistive features does Squidly offer?', a: 'Squidly includes webcam eye-gaze control, customisable communication boards and quizzes, switch access, non-standard speech transcription, low-vision modes, text-to-speech, remote setup mode and much more. We’re continually working with clinicians and AAC users to add more features as we grow.' },
    { q: 'Do my clients need an account?', a: "No, accessibility first: your clients don't need to register or fill out any personal information. Click the secure meeting link and join immediately." },
    { q: 'Is Squidly secure and compliant?', a: 'Absolutely. Squidly employs end-to-end encryption and follows strict data privacy rules, complying with Australian data regulations and laws to ensure your privacy and security.' },
];

/* ===== TrustedBy Section ===== */
function TrustedBy() {
    return (
        <section className="pt-4 md:pt-6">
            <div className="mx-auto max-w-[960px] px-6">
                <h2 className="text-center text-[36px] md:text-[24px] tracking-tight text-[#3A3F4B]">
                    Trusted by professionals at
                </h2>

                <div className="mt-2 md:mt-4 flex flex-wrap items-center justify-center gap-x-10 md:gap-x-14 gap-y-6">
                    {TRUSTED_LOGOS.map((logo) => (
                        <img
                            key={logo.name}
                            src={logo.src as string}
                            alt={logo.name}
                            className="h-8 md:h-8 object-contain [filter:grayscale(1)] opacity-80 hover:opacity-100 transition-opacity"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function PricePage() {
    const [active, setActive] = useState<string>(FAQ_ITEMS[0].q);
    const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

    return (
        <main className="mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
            <TrustedBy />

            <section aria-label="Feature comparison" className="mt-16">
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0 text-[16px] md:text-[17px]">
                        <thead>
                        <tr className="border-b" style={{ borderColor: ROW_DIVIDER }}>
                            <th className="text-left py-6 pr-4 w-[320px] align-bottom">
                                <div className="text-[30px] md:text-[34px] font-extrabold tracking-tight text-[#3B3F46]">
                                    Features
                                </div>
                            </th>
                            {PLANS.map((p) => (
                                <th key={p.id} className="text-left py-6 px-4 align-bottom">
                                    <div className="text-3xl font-normal tracking-tight text-[#1A1E27]">
                                        {p.name}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">{p.tagline}</div>
                                    <PriceBadge
                                        className="mt-2"
                                        label={p.priceBadge}
                                        selected={selectedPlan === p.id}
                                        onClick={() => setSelectedPlan(selectedPlan === p.id ? null : p.id)}
                                    />
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {ROWS.map((row, i) => {
                            if ('section' in row) {
                                return (
                                    <tr key={`sec-${row.section}`}>
                                        <th
                                            colSpan={1 + PLANS.length}
                                            className="text-left pt-8 pb-3 pr-4 text-[28px] font-semibold text-slate-600 border-t"
                                            style={{ borderColor: ROW_DIVIDER }}
                                        >
                                            {row.section}
                                        </th>
                                    </tr>
                                );
                            }

                            const next = ROWS[i + 1];
                            const drawBorder = !!next && !('section' in next);
                            const borderClass = drawBorder ? 'border-b' : '';

                            return (
                                <tr key={row.feature}>
                                    <th
                                        scope="row"
                                        className={`text-left font-medium text-slate-700 py-4 pr-4 w-[320px] ${borderClass}`}
                                        style={{ borderColor: ROW_DIVIDER }}
                                    >
                                        {row.feature}
                                    </th>
                                    {PLANS.map((p) => (
                                        <td
                                            key={p.id}
                                            className={`py-4 px-4 text-slate-800 ${borderClass}`}
                                            style={{ borderColor: ROW_DIVIDER }}
                                        >
                                            <Cell cell={row.cells[p.id]} />
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-20">
                <h2 className="text-2xl font-bold tracking-tight text-[#1A1E27]">
                    Frequently Asked Questions
                </h2>
                <div className="mt-6 rounded-3xl p-1" style={{ border: `2px dashed ${PILL_PURPLE_BORDER}` }}>
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

function PriceBadge({
                        label,
                        selected,
                        onClick,
                        className = '',
                    }: {
    label: string;
    selected: boolean;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold leading-none transition-colors active:scale-[0.98] ${className}`}
            style={
                selected
                    ? {
                        color: '#FFFFFF',
                        backgroundColor: PILL_PURPLE,
                        border: `1px solid ${PILL_PURPLE}`,
                        boxShadow: '0 0 0 3px rgba(139,120,220,0.18)',
                    }
                    : {
                        color: PILL_PURPLE,
                        backgroundColor: PILL_PURPLE_SOFT,
                        border: `1px solid ${PILL_PURPLE_BORDER}`,
                    }
            }
            aria-pressed={selected}
        >
            {label}
        </button>
    );
}


function Cell({ cell }: { cell: Cell }) {
    if (cell.type === 'text') {
        return <span className="text-[16px] md:text-[17px] text-slate-800">{cell.value}</span>;
    }
    return cell.value ? (
        <span className="inline-flex items-center">
      <Check className="h-5 w-5" style={{ color: CHECK_PURPLE }} />
    </span>
    ) : (
        <span className="text-slate-400">—</span>
    );
}

/* ===== FAQ Row ===== */
function FaqRow({
                    item,
                    open,
                    onToggle,
                }: {
    item: { q: string; a: string };
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="px-5 md:px-6">
            <button
                className="flex w-full items-center justify-between py-4 text-left"
                aria-expanded={open}
                onClick={onToggle}
            >
                <span className="text-[16px] font-semibold text-[#1A1E27]">{item.q}</span>
                <ChevronDown
                    className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
                    style={{ color: PILL_PURPLE }}
                />
            </button>
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="overflow-hidden">
                    <p className="pb-4 text-[15px] leading-7 text-slate-600">{item.a}</p>
                </div>
            </div>
        </div>
    );
}
