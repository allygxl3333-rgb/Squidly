import { useState, useRef } from "react";
import {
    ChevronLeft,
    ChevronRight,
    RefreshCcw,
    Star,
    Globe,
    Lock,
    Eye,
    Wrench,
    Calendar,
    LayoutGrid,
    Share2,
    Accessibility,
    MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import ScopedSplashCursor from "./ScopedSplashCursor";
import GradientText from "./GradientText";
const FEATURE_TOOLS = [
    { key: "control", label: "Control", Icon: LayoutGrid },
    { key: "share", label: "Share", Icon: Share2 },
    { key: "access", label: "Access", Icon: Accessibility },
    { key: "message", label: "Message", Icon: MessageSquare },
] as const;
export type Mode = 'Eye Gaze' | 'Tool Bar' | 'Schedule';

 function CluelyModeTabs({
                                           value,
                                           onChange,
                                           className = '',
                                       }: {
    value: Mode;
    onChange: (m: Mode) => void;
    className?: string;
}) {
    const items: { key: Mode; label: string; Icon: any }[] = [
        { key: 'Eye Gaze',  label: 'Eye Gaze',  Icon: Eye },
        { key: 'Tool Bar',  label: 'Tool Bar',  Icon: Wrench },
        { key: 'Schedule',  label: 'Schedule',  Icon: Calendar },
    ];

    return (
        <nav className={`flex flex-wrap items-center ${className}`}>
            {items.map((it, i) => {
                const active = value === it.key;
                const Icon = it.Icon;
                return (
                    <div key={it.key} className="flex items-center">
                        <button
                            type="button"
                            onClick={() => onChange(it.key)}
                            className={[
                                'inline-flex items-center gap-2 px-1.5 py-1 transition-colors rounded',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60',
                                active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700',
                            ].join(' ')}
                            aria-pressed={active}
                            aria-current={active ? 'page' : undefined}
                        >
                            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                            <span className={active ? 'font-semibold' : ''}>{it.label}</span>
                        </button>

                        {/* 分隔线（仅在非最后一项 & 宽屏时显示，避免换行时尴尬） */}
                        {i < items.length - 1 && (
                            <span className="mx-5 hidden h-5 w-px bg-slate-200 sm:block" aria-hidden />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
/* ======================= 共享样式（保留你原来的） + 新增 ToolBar Showcase 样式 ======================= */
function BrowserCSSWhite() {
    return (
        <style>{`
/* ===== Section 外层 ===== */
.wb-wrap{
  position: relative;
  margin-top: 0;
  padding: 3rem 0 4rem;
  isolation: isolate;
}

/* ===== “浏览器壳” ===== */
.wb-browser{
  width: min(1020px, 90vw);
  height: clamp(400px, 56vw, 600px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 18px 46px rgba(17,24,39,.10), 0 2px 0 rgba(0,0,0,.03);
  position: relative;
  overflow: hidden;
  margin: 0 auto;
}
.wb-top{
  height: 70px;
  background: linear-gradient(#fff, #FAFBFF);
  border-bottom: 1px solid rgba(17,24,39,.06);
  display: flex; align-items: center; gap: 10px; padding: 0 14px 0 18px;
}
.wb-traffic{ display:flex; gap:8px; margin-right:8px; }
.wb-dot{ width:12px; height:12px; border-radius:50%; }
.wb-dot.red{ background:#ff5f57; }
.wb-dot.yellow{ background:#ffbd2e; }
.wb-dot.green{ background:#28c840; }

.wb-btn{
  width:30px; height:30px; border:none; background:transparent; border-radius:999px;
  display:grid; place-items:center; color:#6b7280; transition:.15s ease;
}
.wb-btn:hover{ background:rgba(17,24,39,.06); }

.wb-addr{
  flex:1; height:38px; display:flex; align-items:center; gap:10px;
  background:#fff; border:1px solid rgba(17,24,39,.12);
  border-radius:999px; padding:0 12px; box-shadow: inset 0 -2px 0 rgba(17,24,39,.03);
}
.wb-addr input{
  flex:1; border:none; outline:none; background:transparent;
  color:#111827; font-weight:600; font-size:14px;
}
.wb-addr input::placeholder{ color:#9ca3af; }
.wb-addr .icon{ color:#6b7280; }
.wb-addr .lock{ color:#10b981; }
.wb-addr .star{ color:#9ca3af; }

/* 画布区域 */
.wb-canvas{
  position:absolute; inset:60px 0 0 0;
  background: linear-gradient(180deg, #F6F0FF 0%, #F2EAFE 40%, #FFFFFF 100%);
  display:flex; align-items:center; justify-content:center;
}

/* 卡片容器（Eye Gaze / ToolBar 均复用），默认是紫色虚线 */
.wb-card{
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;   /* ← 去掉原来的渐变底 */
  border: none;              /* ← 去掉虚线边框 */
  border-radius: 0;          /* ← 不要内层圆角 */
  isolation: isolate;        /* 保留角标/浮层叠加 */
}
/* Tool Bar 模式时，让容器变“透明”，把真实内容交给内部 .tb-window 来画 */
.wb-card.is-toolbar{
  background: transparent;
  border: none;
}

/* 角标 */
.wb-badge{
  position:absolute; top:18px; left:18px;
  display:inline-flex; align-items:center; gap:8px;
  height:32px; padding:0 12px; border-radius:999px;
  background:#ffffffcc; backdrop-filter:saturate(120%) blur(4px);
  border:1px solid rgba(122,59,255,.18);
  color:#6A4DFF; font-weight:700; font-size:12px;
  box-shadow:0 6px 18px rgba(122,59,255,.18);
  z-index:2;
}

/* 顶部模式按钮 */
.neu-button{
  border-radius:50px;
  display:inline-flex; align-items:center; gap:1px; line-height:1;
  cursor:pointer; transition:transform .12s, box-shadow .2s, background-color .2s, color .2s;
  padding:12px 20px; font-size:16px; font-weight:600;

  background-color:#fff;
  color:#6F57FF;
  border:1.5px solid #e6e6eb;
  box-shadow:
    inset 3px 3px 8px #e7e8ee,
    inset -3px -3px 8px #ffffff,
    2px 2px 8px #ececf3,
    -2px -2px 8px #ffffff;
}
.neu-button:hover{
  transform: translateY(-1px);
  box-shadow:
    inset 2px 2px 6px #e7e8ee,
    inset -2px -2px 6px #ffffff,
    4px 6px 14px #ececf3,
    -2px -3px 12px #ffffff;
}
.neu-button:active{
  background:#6F57FF; color:#fff; border-color:transparent;
  box-shadow:
    inset 2px 2px 6px rgba(255,255,255,.22),
    inset -2px -2px 6px rgba(0,0,0,.14),
    0 10px 22px rgba(111,87,255,.28);
}
.neu-button .icon{ width:18px; height:18px; line-height:0; display:inline-block; }
.neu-button.is-active,
.neu-button[aria-pressed="true"]{
  background:#6F57FF; color:#fff; border-color:transparent;
  box-shadow:
    inset 2px 2px 6px rgba(255,255,255,.22),
    inset -2px -2px 6px rgba(0,0,0,.14),
    0 10px 22px rgba(111,87,255,.28);
}

/* =================== Tool Bar Showcase（视频 + 立体按钮） =================== */
/* “窗口”外框（柔光边 + 圆角），置于 .wb-card 内部 */
.tb-window{
  position:absolute; inset:16px; border-radius:24px; padding:1px;
  background: linear-gradient(120deg, rgba(122,59,255,.35), rgba(167,139,250,.25), rgba(122,59,255,.35));
  box-shadow: 0 16px 44px rgba(122,59,255,.18);
  display:flex;              
}
.tb-inner{
  position:relative; border-radius:24px; background:#fff; overflow:hidden;
  box-shadow: 0 10px 26px rgba(122,59,255,.12);
  display:flex; flex-direction:column;  /* 关键：纵向排列：视频在上，工具条在下 */
  width:100%; height:100%;
}
.tb-screen{
  flex:1 1 auto; min-height:0; background:#EDEDF4;
}
.tb-screen img, .tb-screen video{
  width:100%; height:100%; object-fit:cover; display:block;
}

.tb-bar{
  background:#2B2F36; color:#fff;
  border-top:1px solid rgba(255,255,255,0.08);
  padding:10px;
}
/* 每个 3D 按钮：一个“底座”+ 上面的“顶面” */
.tb-item{ position:relative; height:64px; }
.tb-plate{
  position:absolute; inset:0 0 4px 0; bottom:0;
  height:10px; border-radius:12px; background:#1A1E24;
  box-shadow: 0 16px 22px rgba(0,0,0,.35), 0 2px 0 rgba(255,255,255,.06) inset;
}
.tb-face{
  position:relative; z-index:1; width:100%; height:100%;
  border-radius:14px; border:1px solid rgba(255,255,255,.08);
  box-shadow: 0 10px 16px rgba(0,0,0,.28), 0 0 0 1px rgba(255,255,255,.06) inset, 0 1px 0 rgba(255,255,255,.12) inset;
  transition: transform .15s ease, box-shadow .15s ease;
  background: linear-gradient(180deg, #4A4F58 0%, #2E333A 100%);
}
.tb-face:hover{ transform: translateY(-1px); }
.tb-face:active{ transform: translateY(10px); box-shadow: 0 6px 10px rgba(0,0,0,.28); }
/* 内容布局 */
.tb-content{ position:relative; z-index:2; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; }
.tb-icon{ display:grid; place-items:center; width:28px; height:28px; border-radius:8px; background:rgba(0,0,0,.2); font-size:14px; line-height:0; }
.tb-label{ font-size:11px; letter-spacing:.02em; opacity:.95; }

.tb-face[data-variant="access"][data-active="true"]{
  background: linear-gradient(180deg, #1BC98E 0%, #12A36B 100%);
  box-shadow: 0 10px 16px rgba(0,0,0,.28), 0 0 0 2px rgba(27,201,142,.35);
}
.tb-face[data-variant="share"][data-active="true"]{
  background: linear-gradient(180deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 10px 16px rgba(0,0,0,.28), 0 0 0 2px rgba(245,158,11,.35);
}
.tb-face[data-variant="end"][data-active="true"]{
  background: linear-gradient(180deg, #EF4444 0%, #B91C1C 100%);
  box-shadow: 0 10px 16px rgba(0,0,0,.28), 0 0 0 2px rgba(239,68,68,.35);
}

/* 响应式 */
@media (max-width: 520px){
  .tb-window{ inset:12px; border-radius:20px; }
  .tb-inner{ border-radius:20px; }
  .tb-item{ height:56px; }
}
`}</style>
    );
}

/* ======================= 3D 工具条组件 ======================= */
function ToolBar3D({ active = "access" as "control" | "access" | "share" | "settings" | "end" }) {
    const items = [
        { key: "control", label: "control", icon: "🎛️", variant: "neutral" },
        { key: "access", label: "access", icon: "🧑‍🦽", variant: "access" },
        { key: "share", label: "share", icon: "📤", variant: "share" },
        { key: "settings", label: "settings", icon: "⚙️", variant: "neutral" },
        { key: "end", label: "end", icon: "⛔", variant: "end" },
    ] as const;

    return (
        <div className="tb-bar">
            <div className="grid grid-cols-5 gap-2">
                {items.map(({ key, label, icon, variant }) => (
                    <div key={key} className="tb-item">
                        <span aria-hidden className="tb-plate" />
                        <motion.button
                            type="button"
                            className="tb-face"
                            data-variant={variant}
                            data-active={active === key}
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 10 }}
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        >
                            <div className="tb-content">
                                <span className="tb-icon">{icon}</span>
                                <span className="tb-label">{label}</span>
                            </div>
                        </motion.button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ======================= Tool Bar Showcase（视频 + 3D 工具条） ======================= */
function ToolBarShowcase() {
    return (
        <div className="tb-window">
            <div className="tb-inner">
                <div className="tb-screen">
                    {/* 这里用一张示意图，你也可以换成 <video/> */}
                    <img
                        src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop"
                        alt="demo"
                    />
                </div>
                <ToolBar3D active="access" />
            </div>
        </div>
    );
}

/* ======================= 卡片（Eye Gaze / Tool Bar / Schedule） ======================= */
function BrowserCardWhite({ mode }: { mode: "Eye Gaze" | "Tool Bar" | "Schedule" }) {
    const ModeIcon = mode === "Eye Gaze" ? Eye : mode === "Tool Bar" ? Wrench : Calendar;
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div className="wb-browser">
            {/* 顶部地址栏（保留你原本写法） */}
            <div className="wb-top">
                <div className="wb-traffic">
                    <span className="wb-dot red" />
                    <span className="wb-dot yellow" />
                    <span className="wb-dot green" />
                </div>
                <button className="wb-btn"><ChevronLeft size={16} /></button>
                <button className="wb-btn"><ChevronRight size={16} /></button>
                <button className="wb-btn"><RefreshCcw size={16} /></button>
                <div className="wb-addr">
                    <Globe size={16} className="icon" />
                    <input defaultValue="squidly.com.au/#home-page" readOnly />
                    <Lock size={16} className="lock" />
                    <Star size={16} className="star" />
                </div>
            </div>

            {/* 画布区域 */}
            <div className="wb-canvas">
                <div className={`wb-card ${mode === "Tool Bar" ? "is-toolbar" : ""}`} ref={cardRef}>
                    {/* Eye Gaze：渲染流体光标 */}
                    {mode === "Eye Gaze" && <ScopedSplashCursor containerRef={cardRef} />}

                    {/* Tool Bar：切换为“视频 + 3D 工具条” */}
                    {mode === "Tool Bar" && <ToolBarShowcase />}

                    {/* Schedule：目前仅角标占位；需要也可扩展 */}
                    <span className="wb-badge">
            <ModeIcon size={16} />
                        {mode}
          </span>
                </div>
            </div>
        </div>
    );
}

/* ======================= 顶部模式 Chip ======================= */
function ModeChip({
                      active, onClick, icon, children,
                  }: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <button onClick={onClick} className={`neu-button ${active ? "is-active" : ""}`}>
            {icon}
            <span>{children}</span>
        </button>
    );
}

/* ======================= 主导出 ======================= */
export function BrowserSection() {
    const [mode, setMode] = useState<Mode>('Tool Bar');

    return (
        <section className="wb-wrap">
            <BrowserCSSWhite />
            <motion.div
                initial={{ opacity: 0, y: 60, scale: .985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="grid place-items-center"
            >
                {/* Title + Modes */}
                <div className="w-[min(1100px,92vw)] px-10 mb-5">
                    {/*<GradientText*/}
                    {/*    className="text-[80px] mb-10"*/}
                    {/*    colors={["#CBC2FF", "#6F57FF", "#CBC2FF"]}*/}
                    {/*    animationSpeed={5}*/}
                    {/*    showBorder={false}*/}
                    {/*>*/}
                    {/*    Main Features*/}
                    {/*</GradientText>*/}

                    <CluelyModeTabs
                        value={mode}
                        onChange={setMode}
                        className="text-[16px]" // 需要更大更紧凑可调 15/16/17
                    />
                    </div>

                {/* Browser */}
                <BrowserCardWhite mode={mode} />
            </motion.div>
        </section>
    );
}
