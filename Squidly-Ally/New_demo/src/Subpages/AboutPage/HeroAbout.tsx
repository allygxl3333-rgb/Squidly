import React from "react";

// 按你的目录：src/Photo/abouthero.png
// 如果换其他文件名（如 hero-image.png），改这里即可
import heroImg from "../../Photo/abouthero.png";

const HeroAbout: React.FC = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* 左侧文案 */}
        <div>
          <h1 className="text-4xl/tight sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Empowering every voice to be heard.
          </h1>
          <p className="mt-6 font-semibold text-slate-900">
            Connection without barriers.
          </p>
          <p className="mt-3 max-w-md text-slate-600">
            Video communication designed to support dignity, autonomy, and
            meaningful interaction for everyone.
          </p>
        </div>

        {/* 右侧图片 */}
        <div className="relative">
          <img
            src={heroImg}
            alt="About page hero"
            className="w-full rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroAbout;
