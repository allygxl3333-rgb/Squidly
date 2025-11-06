import React from "react";
import HeroAbout from "./HeroAbout";

const AboutPage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <HeroAbout />
      {/* 以后这里继续添加其它左右分栏的 section 组件即可 */}
    </main>
  );
};

export default AboutPage;
