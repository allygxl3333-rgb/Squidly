import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, LayoutGrid, Accessibility, Share2, Settings, Power, Mic, Video, Phone, MessageSquare, Users } from "lucide-react";



function CTA({ href = "#" }: { href?: string }) {
    const prefers = useReducedMotion();
    return (
        <motion.a
            href={href}
            className="
        inline-flex items-center gap-2 rounded-2xl px-6 h-14
        font-semibold text-white
        bg-gradient-to-r from-[#5B2EEA] via-[#7A3BFF] to-[#4F46E5]
        shadow-none drop-shadow-none filter-none ring-0 outline-none
      "
            style={{ boxShadow: 'none' }}        // 双保险
            whileHover={prefers ? {} : { scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.985 }}
        >
            Get started for free
            <ChevronRight className="h-5 w-5" />
        </motion.a>
    );
}


function Navbar() {
    return (
        <header className="relative z-10">
            <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
                <div className="text-[22px] font-extrabold tracking-tight">Squidly</div>
                <nav className="hidden md:flex items-center gap-8 text-[15px] text-slate-700">
                    <a href="#product">Product</a>
                    <a href="#modes">Modes</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#contact">Contact</a>
                </nav>
                <a href="#book" className="rounded-full bg-[#BFD2FF] text-[#1e40af] px-5 h-10 inline-grid place-items-center font-semibold">
                    Book a call
                </a>
            </div>
        </header>
    );
}

function YayaPurpleCSS() {
    return (
        <style>{`
      :root{
        --p-base:#F3EEFF;
        --p-ink:#6A4DFF;
      }
      .button{
        display:flex; flex-direction:column; align-items:flex-end; justify-content:space-between;
        background-color:var(--p-base); color:var(--p-ink); font-size:20px;
        border:.5px solid rgba(106,77,255,.18);
        padding:30px 30px 25px; height:180 px; border-radius:15px 15px 12px 12px;
        cursor:pointer; position:absolute; z-index:20; user-select:none;
        transition:all .1s ease-in-out 0s; will-change:transform;
        background-image:
          linear-gradient(to right, rgba(122,59,255,.18), rgba(122,59,255,0)),
          linear-gradient(to bottom, rgba(122,59,255,.18), rgba(122,59,255,0));
        background-position: bottom right, bottom right;
        background-size:100% 100%, 100% 100%; background-repeat:no-repeat;
        box-shadow:
          inset -4px -10px 0 rgba(255,255,255,.65),
          inset -4px -8px 0 rgba(122,59,255,.12),
          0 2px 1px rgba(122,59,255,.12),
          0 6px 18px rgba(122,59,255,.16);
        transform: perspective(70px) rotateX(5deg) rotateY(0deg);
      }
      .button::after{
        content:""; position:absolute; inset:0; z-index:-1; border-radius:15px;
        background-image: linear-gradient(to bottom, rgba(255,255,255,.45), rgba(122,59,255,.14));
        box-shadow: inset 4px 0 0 rgba(255,255,255,.16), inset 4px -8px 0 rgba(122,59,255,.14);
        transition:all .1s ease-in-out 0s;
      }
      .button::before{
        content:""; position:absolute; inset:0; z-index:-1; border-radius:15px;
        background-image:
          linear-gradient(to right, rgba(122,59,255,.18), rgba(122,59,255,0)),
          linear-gradient(to bottom, rgba(122,59,255,.18), rgba(122,59,255,0));
        background-position: bottom right, bottom right;
        background-size:100% 100%, 100% 100%; background-repeat:no-repeat;
        transition:all .1s ease-in-out 0s;
      }
      .button:active{
        transform: perspective(80px) rotateX(5deg) rotateY(1deg) translateY(3px) scale(.96);
        height:72px;
        border:.25px solid rgba(106,77,255,.28);
        box-shadow:
          inset -4px -8px 0 rgba(255,255,255,.32),
          inset -4px -6px 0 rgba(122,59,255,.22),
          0 1px 0 rgba(122,59,255,.20),
          0 8px 14px rgba(122,59,255,.18);
      }
      .button:active::after{
        background-image: linear-gradient(to bottom, rgba(122,59,255,.20), rgba(255,255,255,.35));
      }
      .button:active::before{
        content:""; position:absolute; top:5%; left:20%; width:50%; height:80%;
        background-color: rgba(255,255,255,.18); pointer-events:none;
        animation: overlay .1s ease-in-out 0s;
      }
      .button svg{ width:20px; height:20px; stroke:var(--p-ink); }
      @keyframes overlay { from{opacity:0;} to{opacity:1;} }
      .button:focus{ outline:none; }
    `}</style>
    );
}

function FloatBtn({
                      label, icon, leftPct, topPct, delay = 0, amp = 10,
                  }: { label:string; icon:React.ReactNode; leftPct:number; topPct:number; delay?:number; amp?:number; }) {
    const prefers = useReducedMotion();
    return (
        <motion.button
            className="button"
            style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            animate={prefers ? undefined : { y: [0, -amp, 0, amp, 0] }}
            transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
        >
            {icon}
            <span>{label}</span>
        </motion.button>
    );
}

export default function SquidlyHero_Screenshot() {
    return (
        <section className="relative overflow-hidden">
            <YayaPurpleCSS />

            <Navbar />

            <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-36 md:pt-20 md:pb-10">
                <div className="grid place-items-center text-center">
                    <h1
                        className="font-extrabold leading-[1.06] text-[clamp(36px,6.4vw,76px)] text-slate-900"
                        style={{ filter: "drop-shadow(0 3px 0 rgba(0,0,0,.26)) drop-shadow(0 14px 22px rgba(0,0,0,.12))", letterSpacing: "-.015em" }}
                    >
                        <span>Video calls for</span>
                        <br />
                        <span>Every Voice</span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-[clamp(14px,1.5vw,18px)] text-slate-700/95">
                        Squidly – accessible video calls for every way of communicating
                    </p>

                    <div className="mt-8">
                        <CTA href="#get-started" />
                    </div>
                </div>

                <FloatBtn label="Control" icon={<LayoutGrid />}   leftPct={10} topPct={10} delay={0.00} amp={14} />
                {/*<FloatBtn label="Mic"     icon={<Mic />}          leftPct={15} topPct={26} delay={0.08} amp={14} />*/}
                <FloatBtn label="Access"  icon={<Accessibility />} leftPct={12}  topPct={60} delay={0.16} amp={14} />
                {/*<FloatBtn label="Video"   icon={<Video />}        leftPct={18} topPct={50} delay={0.24} amp={14} />*/}
                {/*<FloatBtn label="Phone"   icon={<Phone />}        leftPct={10} topPct={65} delay={0.32} amp={14} />*/}


                <FloatBtn label="Share"    icon={<Share2 />}         leftPct={80} topPct={15} delay={0.04} amp={14} />
                {/*<FloatBtn label="Settings" icon={<Settings />}       leftPct={85} topPct={26} delay={0.12} amp={14} />*/}
                <FloatBtn label="Message"  icon={<MessageSquare />}  leftPct={78} topPct={55} delay={0.20} amp={14} />
                {/*<FloatBtn label="Users"    icon={<Users />}          leftPct={84} topPct={50} delay={0.28} amp={14} />*/}
                {/*<FloatBtn label="End"      icon={<Power />}          leftPct={80} topPct={65} delay={0.36} amp={14} />*/}

            </div>

        </section>
    );
}
