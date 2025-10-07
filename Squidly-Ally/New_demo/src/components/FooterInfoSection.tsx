// src/components/FooterInfoSection.tsx
import { Linkedin } from "lucide-react";

export default function FooterInfoSection() {
  const year = new Date().getFullYear();
  return (
    <section aria-label="Footer links" className="py-14">
      <div className="mx-auto w-full max-w-screen-3xl px-4 sm:px-6">
        <div className="rounded-3xl bg-white/70 ring-1 ring-slate-900/10 shadow-[0_10px_30px_rgba(16,24,40,0.06)] backdrop-blur-sm">
          <div className="grid grid-cols-12 gap-x-8 gap-y-12 p-10 md:p-12">
            {/* Left */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <a
                href="mailto:contact@squidly.com.au"
                className="text-xl md:text-2xl font-bold text-violet-800 hover:text-violet-900">
                contact@squidly.com.au
              </a>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://www.linkedin.com"
                  aria-label="LinkedIn"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-violet-50 text-violet-700 ring-1 ring-violet-200 hover:bg-violet-100 hover:text-violet-800"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-6 text-sm text-violet-800/90">© {year} Made by Squidly</p>
            </div>

            {/* Product */}
            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
              <h4 className="mb-4 text-lg md:text-xl font-bold text-slate-900">Product</h4>
              <ul className="space-y-2.5 md:space-y-3">
                <li>
                  <a href="#pricing" className="text-violet-800 hover:text-violet-900 text-lg md:text-xl font-semibold">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-violet-800 hover:text-violet-900 text-lg md:text-xl font-semibold">
                    Features
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
              <h4 className="mb-4 text-lg md:text-xl font-bold text-slate-900">Legal</h4>
              <ul className="space-y-2.5 md:space-y-3">
                <li>
                  <a href="#privacy" className="text-violet-800 hover:text-violet-900 text-lg md:text-xl font-semibold">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-violet-800 hover:text-violet-900 text-lg md:text-xl font-semibold">
                    Terms
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <h4 className="mb-4 text-lg md:text-xl font-bold text-slate-900">Contact</h4>
              <ul className="space-y-2.5 md:space-y-3">
                <li>
                  <a href="#contact" className="text-violet-800 hover:text-violet-900 text-lg md:text-xl font-semibold">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="text-violet-800 hover:text-violet-900 text-lg md:text-xl font-semibold">
                    Schedule a call
                  </a>
                </li>
                <li className="text-violet-800 text-lg md:text-xl font-semibold">+61 406 741 714</li>
              </ul>
            </div>

            {/* Address */}
            <div className="col-span-12 lg:col-span-2 lg:ml-auto lg:text-right">
              <div className="text-lg md:text-xl font-bold text-slate-900">Sydney, NSW 2076</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
