'use client';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
// === logos (resolve by bundler) ===
import cpaLogo   from '../Professionals_logos/cpa.png';
import usydLogo  from '../Professionals_logos/usyd.png';
import arataLogo from '../Professionals_logos/arata.png';
import rmitLogo  from '../Professionals_logos/rmit.png';
import atsaLogo  from '../Professionals_logos/atsa.png';
const STICKY_TOP = 72; // 顶部导航高度，必要时改成 80/88

// 建议加在组件顶部（useState 同级）


function GlassButton({
                       children,
                       onClick,
                       variant = 'light',              // 'light' 用在 Basic/Advanced，'dark' 用在 Pro
                       className = '',
                     }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'light' | 'dark';
  className?: string;
}) {
  return (
      <>
        <style>{`
        @keyframes sheenMove {
          from { transform: translateX(-160%) skewX(-20deg); }
          to   { transform: translateX(220%)  skewX(-20deg); }
        }
      `}</style>

        <button
            onClick={onClick}
            className={[
              'group relative w-full rounded-full px-5 py-3 text-[15px] font-semibold active:scale-[0.98] transition',
              variant === 'dark' ? 'text-[#6F57FF]' : 'text-[#1A1E27]',
              className,
            ].join(' ')}
            style={
              variant === 'dark'
                  ? {
                    // 深色背景上的“白玻璃”
                    background:
                        'linear-gradient(to bottom, rgba(255,255,255,.30), rgba(255,255,255,.14))',
                    border: '1px solid rgba(255,255,255,.6)',
                    boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,.7), inset 0 -10px 18px rgba(255,255,255,.22), 0 12px 28px rgba(17,24,39,.22)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }
                  : {
                    // 浅色背景上的“液体玻璃”（带紫色晕光 + 渐变描边）
                    background:
                        'linear-gradient(to bottom, rgba(255,255,255,.88), rgba(255,255,255,.70)), radial-gradient(120% 140% at 50% 0%, rgba(111,87,255,.10), rgba(111,87,255,0) 60%)',
                    border: '1px solid rgba(111,87,255,.28)',
                    boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,.85), inset 0 -10px 18px rgba(111,87,255,.10), 0 10px 24px rgba(17,24,39,.10), 0 10px 28px rgba(111,87,255,.16)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }
            }
        >
          {/* 外部紫色 halo（浅色背景时增强可见度） */}
          {variant === 'light' && (
              <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-1 rounded-full blur-lg"
                  style={{
                    background:
                        'radial-gradient(60% 140% at 50% 120%, rgba(111,87,255,.18), rgba(111,87,255,0) 60%)',
                  }}
              />
          )}

          {/* 顶部高光 */}
          <span
              aria-hidden
              className="pointer-events-none absolute inset-px rounded-full"
              style={{
                background:
                    'radial-gradient(110% 80% at 50% 0%, rgba(255,255,255,.8), rgba(255,255,255,0) 60%)',
                mixBlendMode: 'screen',
              }}
          />

          {/* 悬浮流光 */}
          <span
              aria-hidden
              className="pointer-events-none absolute -inset-y-3 -left-1/2 w-1/3 rounded-full bg-white/45 blur-md opacity-0 group-hover:opacity-70"
              style={{
                maskImage:
                    'linear-gradient(to right, transparent, black 30%, black 70%, transparent)',
                animation: 'sheenMove 1.2s ease-out forwards',
                animationPlayState: 'paused',
              }}
          />
          <style>{`.group:hover > span[aria-hidden]:last-child{ animation-play-state: running; }`}</style>

          <span className="relative">{children}</span>
        </button>
      </>
  );
}


/* ===== Colors ===== */
const PILL_PURPLE = '#8270E5';
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

/* ===== Plans (for comparison table) ===== */
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
type Group = { section: string | null; features: FeatureRow[] };

function groupRows(rows: Row[]): Group[] {
  const groups: Group[] = [];
  let current: Group = { section: null, features: [] };

  for (const r of rows) {
    if ('section' in r) {
      if (current.features.length) groups.push(current);
      current = { section: r.section, features: [] };
    } else {
      current.features.push(r);
    }
  }
  if (current.features.length) groups.push(current);
  return groups;
}

const GROUPS: Group[] = groupRows(ROWS);

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

type Period = 'monthly' | 'yearly';

function BillingToggle({
                         period,
                         setPeriod,
                       }: {
  period: Period;
  setPeriod: (p: Period) => void;
}) {
  return (
      <div
          role="tablist"
          aria-label="Billing period"
          className="relative inline-flex select-none rounded-full bg-white/70 p-1 ring-1 ring-slate-200 backdrop-blur supports-[backdrop-filter]:bg-white/55"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              setPeriod(period === 'monthly' ? 'yearly' : 'monthly');
            }
          }}
      >
        {/* 滑块 thumb */}
        <div
            aria-hidden
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-[0_8px_16px_rgba(111,87,255,.35)] transition-transform duration-300 ease-out will-change-transform"
            style={{
              background: '#8B78DC',
              transform:
                  period === 'monthly' ? 'translateX(0)' : 'translateX(100%)',
            }}
        />

        {/* Monthly */}
        <button
            role="tab"
            aria-selected={period === 'monthly'}
            tabIndex={period === 'monthly' ? 0 : -1}
            onClick={() => setPeriod('monthly')}
            className={[
              'relative z-10 px-6 py-2 w-28 text-center font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B78DC]/40 rounded-full',
              period === 'monthly' ? 'text-white' : 'text-slate-700',
            ].join(' ')}
        >
          Monthly
        </button>

        {/* Yearly */}
        <button
            role="tab"
            aria-selected={period === 'yearly'}
            tabIndex={period === 'yearly' ? 0 : -1}
            onClick={() => setPeriod('yearly')}
            className={[
              'relative z-10 px-6 py-2 w-28 text-center font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B78DC]/40 rounded-full',
              period === 'yearly' ? 'text-white' : 'text-slate-700',
            ].join(' ')}
        >
          Yearly
        </button>
      </div>
  );
}


/* ===== Pricing Cards (full-bleed hero + stronger glass) ===== */
function PricingCards() {
  type Period = 'monthly' | 'yearly';
  const [period, setPeriod] = useState<Period>('monthly');

  const PRICING_PLANS = [
    {
      id: 'basic',
      name: 'Basic',
      priceLabel: (p: Period) => (p === 'monthly' ? 'Free' : 'Free'),
      subtitle: '',
      tone: 'glass' as const,
      features: [
        'Limited meetings minutes',
        'Limited on quiz and grid editor requests',
      ],
      cta: 'Sign in',
    },
    {
      id: 'advanced',
      name: 'Advanced',
      priceLabel: (p: Period) => (p === 'monthly' ? '$20' : '$16'),
      subtitle: '/ month pp',
      tone: 'glass-strong' as const,
      features: [
        'Meetings up to 480 minutes per month',
        'Extended limits on quiz and grid editor requests',
        'Session scheduling',
        'Customer support',
        'SCIM user management',
      ],
      cta: 'Purchase Plan',
    },
    {
      id: 'pro',
      name: 'Pro',
      priceLabel: (p: Period) => (p === 'monthly' ? '$35' : '$28'),
      subtitle: '/ month pp',
      tone: 'solid' as const,
      features: [
        'Unlimited meeting minutes',
        'Unlimited quiz and grid editor requests',
        'Priority support and account management',
        'Admin dashboard',
        'Early feature access',
      ],
      cta: 'Purchase Plan',
    },
  ] as const;

  // 只画左右两块黄色
  const yellowBlobs = `
    radial-gradient(740px 340px at 18% 44%,
      rgba(221,193,152,.58) 0,
      rgba(221,193,152,.32) 28%,
      transparent 62%),
    radial-gradient(740px 340px at 82% 44%,
      rgba(221,193,152,.58) 0,
      rgba(221,193,152,.32) 28%,
      transparent 62%)
  `;

  // 单独画中间那块紫色（边缘快速衰减为透明，避免外溢）
  const purpleBlob = `
    radial-gradient(540px 260px at 50% 34%,
      rgba(135,92,255,.44) 0,
      rgba(135,92,255,.28) 24%,
      rgba(135,92,255,.14) 34%,
      rgba(135,92,255,.06) 40%,
      transparent 48%)
  `;


  return (
      <section
          className="relative full-bleed isolate overflow-hidden bg-white -mt-36 md:-mt-48 pt-36 md:pt-48 pb-14 md:pb-16"
      >
        {/* full-bleed helper 保持不变 */}
        <style>{`
        .full-bleed{position:relative;width:100dvw;margin-left:calc(50% - 50dvw);margin-right:calc(50% - 50dvw)}
        @supports not (width:100dvw){
          .full-bleed{width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw)}
        }
      `}</style>

        {/* ⛔️ 删除任何 linear-gradient 的整条顶端紫色背景 */}

        {/* 底层：左右黄色（-z-30） */}
        <div
            className="absolute inset-0 -z-30"
            style={{ backgroundImage: yellowBlobs, backgroundColor: 'white' }}
            aria-hidden
        />

        {/* 中层：只有中间这块紫色（-z-20） */}
        <div
            className="absolute inset-0 -z-20"
            style={{ backgroundImage: purpleBlob }}
            aria-hidden
        />

        {/* 顶部纯白“盖帽”，保证上方不是紫色（高度可加大一点） */}
        <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80
                  bg-gradient-to-b from-white via-white to-transparent"
            aria-hidden
        />

        {/* 底部淡出为白色，衔接下个 section */}
        <div
            className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-b from-transparent to-white"
            aria-hidden
        />


        <div className="mx-auto max-w-[1100px] px-6">
          {/* Title + bullets */}
          <div className="text-center">
            <h2 className="text-[28px] md:text-[32px] font-extrabold tracking-tight text-[#1A1E27]">
              Pricing made accessible for everyone
            </h2>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px] text-slate-700">
              <span>✓ Easy access</span>
              <span>✓ 7 day free trial</span>
              <span>✓ Cancel anytime</span>
            </div>


            {/* Billing toggle */}
            <div className="mt-6">
              <BillingToggle period={period} setPeriod={setPeriod} />
            </div>
          </div>

          {/* Cards */}
          <div className="mx-auto mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PRICING_PLANS.map((p) => {
              const tone = p.tone;

              const glassCommon =
                  'backdrop-blur-xl border border-white/50 ring-1 ring-white/40 shadow-[0_18px_40px_rgba(17,24,39,0.12)] text-[#1A1E27]';
              const glassWeak = 'bg-white/18'; // Basic
              const glassStrong = 'bg-white/28'; // Advanced
              const cardCls =
                  tone === 'solid'
                      ? 'border-transparent bg-[#8B78DC] text-white shadow-xl'
                      : `${glassCommon} ${
                          tone === 'glass' ? glassWeak : glassStrong
                      }`;

              return (
                  <div
                      key={p.id}
                      className={`relative rounded-[22px] p-6 md:p-7 ${cardCls} flex flex-col`}
                  >
                    {/* Title */}
                    <div
                        className={`text-[18px] font-semibold ${
                            tone === 'solid' ? 'text-white' : 'text-[#1A1E27]'
                        }`}
                    >
                      {p.name}
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-end gap-1">
                      <div
                          className={`text-[34px] font-extrabold tracking-tight leading-none ${
                              tone === 'solid' ? 'text-white' : 'text-[#1A1E27]'
                          }`}
                      >
                        {p.priceLabel(period)}
                      </div>
                      {p.subtitle && (
                          <div
                              className={`pb-1 text-[14px] font-semibold ${
                                  tone === 'solid' ? 'text-white/90' : 'text-[#1A1E27]'
                              }`}
                          >
                            {p.subtitle}
                          </div>
                      )}
                    </div>

                    {/* features —— flex-1 把按钮推到底部 */}
                    <ul className="mt-6 space-y-4 text-[15px] flex-1">
                      {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-3">
                      <span
                          className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 ${
                              tone === 'solid'
                                  ? 'bg-white/15 ring-white/40'
                                  : 'bg-white ring-violet-200'
                          }`}
                      >
                        <Check
                            className={
                              tone === 'solid' ? 'h-3.5 w-3.5 text-white' : 'h-3.5 w-3.5'
                            }
                            style={{
                              color: tone === 'solid' ? 'white' : '#6F57FF',
                            }}
                        />
                      </span>
                            <span
                                className={
                                  tone === 'solid' ? 'text-white/95' : 'text-[#1A1E27]'
                                }
                            >
                        {f}
                      </span>
                          </li>
                      ))}
                    </ul>

                    {/* CTA —— 使用液体玻璃按钮：Pro 用 dark，其它用 light */}
                    <GlassButton
                        variant={tone === 'solid' ? 'dark' : 'light'}
                        className="mt-7"
                    >
                      {p.cta}
                    </GlassButton>
                  </div>
              );
            })}
          </div>
        </div>
      </section>
  );
}


export default function PricePage() {
  // 表格交互
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [active, setActive] = useState<string>("");

  // —— Pro 整列浅紫背景（圆角 + 一直延伸到底）——
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const proThRef = useRef<HTMLTableCellElement | null>(null);
  const [overlayLeft, setOverlayLeft] = useState(0);
  const [overlayWidth, setOverlayWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const wrap = wrapperRef.current;
      const pro = proThRef.current;
      if (!wrap || !pro) return;
      const rb = wrap.getBoundingClientRect();
      const pb = pro.getBoundingClientRect();
      setOverlayLeft(pb.left - rb.left);
      setOverlayWidth(pb.width);
    };
    update();

    const ro = new ResizeObserver(update);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", update);
    // 保险：内容/字体变化时重算
    const id = window.setInterval(update, 250);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.clearInterval(id);
    };
  }, []);

  // —— hover 打开/收起（带延迟，避免路过就闪开）——
  const hoverTimer = useRef<number | null>(null);
  useEffect(() => () => hoverTimer.current && window.clearTimeout(hoverTimer.current), []);
  const HOVER_OPEN_DELAY = 140;
  const HOVER_CLOSE_DELAY = 120;
  const openOnHover = (name: string) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenSection(name), HOVER_OPEN_DELAY);
  };
  const closeOnLeave = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenSection(null), HOVER_CLOSE_DELAY);
  };
  const PRICE_TEXT: Record<PlanId, string> = {
    basic: 'Free',
    advanced: '$20 /month pp',
    pro: '$35 /month pp',
  };
  return (
      <main className="mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
        {/* 顶部卡片区保持不变 */}
        <PricingCards />
        <TrustedBy />

        {/* —— 对比表 —— */}
        <section aria-label="Feature comparison" className="mt-16">
            <div className="overflow-x-auto overflow-y-visible">
            {/* 用一个 relative 包裹，放入 Pro 整列 overlay */}
            <div className="relative" ref={wrapperRef}>
              {/* Pro 列整列浅紫背景（圆角），不会挡交互 */}
              <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: overlayLeft,
                    width: overlayWidth,
                    backgroundColor: PILL_PURPLE_SOFT,
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
              />

              <table className="w-full border-separate border-spacing-0 text-[16px] md:text-[17px] relative">
                  <thead className="sticky z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/55" style={{ top: STICKY_TOP }}>
                  <tr className="border-b" style={{ borderColor: ROW_DIVIDER }}>
                  {/* 左侧 Features 列头 */}
                  <th
                      className="text-left py-4 pr-4 w-[320px] align-bottom sticky z-20 bg-white/80 backdrop-blur"
                      style={{ top: STICKY_TOP, boxShadow: "inset 0 -1px 0 " + ROW_DIVIDER }}
                  >
                    <div className="text-[30px] md:text-[34px] font-extrabold tracking-tight text-[#3B3F46]">
                      Features
                    </div>
                  </th>

                  {/* 计划列头（Pro 这个 th 绑定 ref，用于测量 overlay 位置；自身也上浅紫背景，保证吸顶时顶部仍然是紫色并有圆角） */}
                  {PLANS.map((p) => {
                    const isPro = p.id === "pro";
                    const isSelected = selectedPlan === p.id;

                    return (
                        <th
                            key={p.id}
                            ref={isPro ? proThRef : undefined}
                            className="text-left py-4 px-4 align-bottom sticky z-30 backdrop-blur"
                            style={{
                              top: STICKY_TOP,
                              backgroundColor: isPro ? PILL_PURPLE_SOFT : "rgba(255,255,255,0.80)",
                              boxShadow: "inset 0 -1px 0 " + ROW_DIVIDER,
                              borderTopLeftRadius: isPro ? 18 : undefined,
                              borderTopRightRadius: isPro ? 18 : undefined,
                            }}
                        >
                          {/* 计划名 */}
                          <div className="text-3xl font-normal tracking-tight text-[#1A1E27]">
                            {p.name}
                          </div>

                          {/* 第一行：Tagline（和你截图一样） */}
                          <div className="text-[15px] text-slate-500 mt-2">{p.tagline}</div>

                          {/* 第二行：价格文本 —— 取代原来的 PriceBadge（已移除） */}
                            <div className="mt-2 text-[15px]  text-slate-500">
                            {PRICE_TEXT[p.id]}
                          </div>

                          {/* CTA：点击后变成紫色填充；未选中时是描边状态 */}
                          <button
                              type="button"
                              onClick={() => setSelectedPlan(p.id)}
                              className={`mt-3 inline-flex items-center justify-center rounded-full px-4 py-1.0 border transition-all
          ${isSelected
                                  ? "text-white border-transparent"
                                  : "text-[#8270E5] border-[#CFC6F4] hover:bg-[#EFEAFC]"
                              }`}
                              style={isSelected ? {
                                backgroundColor: PILL_PURPLE,
                                boxShadow: '0 10px 30px rgba(130,112,229,.35)'
                              } : undefined}
                          >
                            {p.id === "basic" ? "Sign in" : "Purchase plan"}
                          </button>
                        </th>
                    );
                  })}

                </tr>
                </thead>

                {/* 分组渲染（Core 永远展开；其它组 hover 展开 + 动画） */}
                {GROUPS.map((group) => {
                  const key = group.section ?? "core";
                  const isCore = group.section == null;
                  const isOpen = isCore || openSection === group.section;

                  return (
                      <tbody
                          key={key}
                          onMouseEnter={() => !isCore && openOnHover(group.section!)}
                          onMouseLeave={() => !isCore && closeOnLeave()}
                      >
                      {/* 分组标题（Core 无标题） */}
                      {!isCore && (
                          <tr className="border-t" style={{ borderColor: ROW_DIVIDER }}>
                            <th colSpan={1 + PLANS.length} className="text-left">
                              <div className="w-full flex items-center justify-between py-4 pr-2 text-[20px] font-semibold text-slate-700 select-none">
                                <span>{group.section}</span>
                                <ChevronDown
                                    className={`h-5 w-5 transition-transform ${
                                        isOpen ? "rotate-180" : ""
                                    }`}
                                    style={{ color: PILL_PURPLE }}
                                />
                              </div>
                            </th>
                          </tr>
                      )}

                      {/* 明细：Core 直接渲染，其他用高度动画 */}
                      <tr>
                        <td colSpan={1 + PLANS.length} style={{ padding: 0 }}>
                          {isCore ? (
                              <table className="w-full">
                                <tbody>
                                {group.features.map((row, i) => {
                                  const isLast = i === group.features.length - 1;
                                  const borderClass = isLast ? "" : "border-b";
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
                                                style={{
                                                  borderColor: ROW_DIVIDER,
                                                  // 不再给 Pro 单元格逐格上背景，统一由整列 overlay 呈现连续浅紫
                                                }}
                                            >
                                              <Cell cell={row.cells[p.id]} />
                                            </td>
                                        ))}
                                      </tr>
                                  );
                                })}
                                </tbody>
                              </table>
                          ) : (
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        key="group-body"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ overflow: "hidden" }}
                                    >
                                      <table className="w-full">
                                        <tbody>
                                        {group.features.map((row, i) => {
                                          const isLast = i === group.features.length - 1;
                                          const borderClass = isLast ? "" : "border-b";
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
                                    </motion.div>
                                )}
                              </AnimatePresence>
                          )}
                        </td>
                      </tr>
                      </tbody>
                  );
                })}
              </table>
            </div>
          </div>
        </section>

        {/* FAQ 保持不变 */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1E27]">
            Frequently Asked Questions
          </h2>
          <div
              className="mt-6 rounded-3xl p-1"
              style={{ border: `2px dashed ${PILL_PURPLE_BORDER}` }}
          >
            <div className="divide-y divide-slate-200 rounded-3xl bg-white/60 backdrop-blur">
              {FAQ_ITEMS.map((item) => (
                  <FaqRow
                      key={item.q}
                      item={item}
                      open={active === item.q}
                      onToggle={() => setActive(active === item.q ? "" : item.q)}
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
