// src/pages/ContactPage.tsx
import React, { useState } from "react";

type FormState = {
  name: string; email: string; jobTitle: string; users: string; company: string; message: string;
};

const INIT: FormState = { name: "", email: "", jobTitle: "", users: "", company: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INIT);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);

  const yellowBlobs = `
    radial-gradient(800px 800px at 16% 70%, rgba(221,193,152,.8) 0, rgba(221,193,152,.6) 28%, transparent 64%),
    radial-gradient(800px 800px at 84% 30%, rgba(221,193,152,.8) 0, rgba(221,193,152,.5) 28%, transparent 64%)
  `;
  const purpleBlob = `
    radial-gradient(720px 2500px at 50% 45%, rgba(135,92,255,.42) 0, rgba(135,92,255,.30) 24%, rgba(135,92,255,.14) 40%, rgba(135,92,255,.06) 55%, transparent 65%)
  `;

  function onChange<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setSending(true); setSent(null);
    try { await new Promise((r) => setTimeout(r, 800)); setSent("ok"); setForm(INIT); }
    catch { setSent("err"); } finally { setSending(false); }
  }

  return (
    <div className="relative min-h-screen text-slate-900">
      {/* 背景层 */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: yellowBlobs, backgroundColor: "white" }} />
      <div className="absolute inset-0 z-0" style={{ backgroundImage: purpleBlob }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-80 bg-gradient-to-b from-white via-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-56 bg-gradient-to-b from-transparent to-white" />

      {/* 内容：更大、更居中 */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <div className="min-h-[82vh] flex items-center py-10 md:py-16">
          <div className="grid w-full md:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-12 md:gap-16 items-start">
            {/* 左侧介绍 */}
            <div className="space-y-6 pt-4">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Contact our team
              </h1>
              <p className="text-slate-600 leading-relaxed max-w-xl text-lg">
                Together, we can create accessibility for all
              </p>

              <div className="mt-10 flex items-start gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M4 6h16v12H4z" stroke="#8b5cf6" strokeWidth="1.6" />
                    <path d="m4 7 8 6 8-6" stroke="#8b5cf6" strokeWidth="1.6" />
                  </svg>
                </span>
                <div>
                  <div className="text-sm text-slate-500">Email</div>
                  <a href="mailto:contact@squidly.com.au" className="font-medium hover:underline text-lg">
                    contact@squidly.com.au
                  </a>
                </div>
              </div>
            </div>

            {/* 右侧表单卡片：纯白 + 层次感 + 超柔外晕 */}
            <div className="relative">
              {/* 外圈柔光（halo） */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[22px] rounded-[30px]
                           bg-[radial-gradient(closest-side,rgba(2,6,23,0.18),rgba(2,6,23,0.10),transparent_70%)]
                           blur-[38px]"
              />
              {/* 渐变细边（1px） */}
              <div className="rounded-[28px] p-[1px] bg-gradient-to-b from-white/60 via-slate-200/60 to-white/20">
                <form
                  onSubmit={onSubmit}
                  className="force-text-scale relative rounded-[26px] bg-white
                             shadow-[0_22px_60px_-20px_rgba(2,6,23,0.18),0_10px_26px_-12px_rgba(2,6,23,0.10)]
                             p-6 md:p-8"
                >
                  {/* 顶部内侧高光（不要包裹内容！只做装饰） */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[26px]
                               shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
                  />

                  {/* 表单字段 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                    <Field label="Name">
                      <input
                        required
                        placeholder="Jaden Smith"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Job title">
                      <input
                        placeholder="Job title"
                        value={form.jobTitle}
                        onChange={(e) => onChange("jobTitle", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Email" hint="Text">
                      <input
                        required
                        type="email"
                        placeholder="Example@gmail"
                        value={form.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Company name">
                      <input
                        placeholder="Company name"
                        value={form.company}
                        onChange={(e) => onChange("company", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Number of users">
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Number"
                        value={form.users}
                        onChange={(e) => onChange("users", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <div className="hidden md:block" />

                    <div className="md:col-span-2">
                      <Field label="Message">
                        <textarea
                          placeholder="Type your message"
                          rows={5}
                          value={form.message}
                          onChange={(e) => onChange("message", e.target.value)}
                          className={inputCls + " resize-y h-36"}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-6 relative">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full rounded-full h-12 text-base font-semibold text-white bg-purple-500 hover:bg-purple-500/90 active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </button>

                    {sent === "ok" && (
                      <p className="mt-3 text-sm text-green-600">Message sent. We’ll get back to you soon.</p>
                    )}
                    {sent === "err" && (
                      <p className="mt-3 text-sm text-rose-600">Send failed. Please try again.</p>
                    )}
                  </div>
                </form>
              </div>
            </div>
            {/* —— 表单卡片结束 —— */}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- 小组件 ---------- */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700 mb-1">
        <span>{label}</span>
        {hint && <span className="text-slate-400 text-xs">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

/* 输入框：圆角 + 微灰底，聚焦变白并带紫色环 */
const inputCls =
  "w-full h-12 rounded-xl border border-slate-200 bg-slate-50/90 text-base " +
  "placeholder:text-slate-400 px-3 outline-none " +
  "focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-300/60 " +
  "transition";
