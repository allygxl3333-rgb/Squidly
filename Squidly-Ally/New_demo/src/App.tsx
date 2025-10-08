// App.tsx
'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GlobalBackground from './components/GlobalBackground';
import NavBar from './components/NavBar';

// ↓ 主页区块（保持和你当前顺序一致）
import SquidlyHero from './components/SquidlyHero';
import { BrowserSection } from './components/BrowserSection';
import StepsSection from './components/StepsSection';
import VideoTextSection from './components/VideoTextSection';
import TestimonialsSection from './components/TestimonialsSection';
import ImageCompareSection from './components/ImageCompareSection';
import PrivacySection from './components/PrivacySection';
import FooterinfoSection from './components/FooterInfoSection';
import TrySquidlySection from './components/TrySquidlySection';
import NewsletterModal from "./components/NewsletterModal";
// 新建的定价页组件（我已放在 Canvas）
import PricingPage from './Subpages/PricePage';
import WhyChooseSquidlySection from './components/WhyChooseSquidlySection';

function Home() {
    return (
        <>
            <NewsletterModal />
            {/* 给锚点留ID，NavBar的 /#product /#modes /#contact 会滚动到这里 */}
            <div id="product">
                <SquidlyHero />
                <BrowserSection />
            </div>

            <div id="modes">
                <VideoTextSection />
            </div>

            <StepsSection />
            <TestimonialsSection />
            <ImageCompareSection />
            <PrivacySection />
            <WhyChooseSquidlySection />
            <div id="contact">{/* 你后面可以塞联系表单/页脚 */}</div>
        </>
    );
}

export default function App() {
    return (
        <div className="min-h-screen relative">
            {/* <GlobalBackground /> */}
            <BrowserRouter>
                <NavBar />
                <div className="pt-20">{/* 留出顶部固定导航高度 */}</div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pricing" element={<PricingPage />} />
                </Routes>
            </BrowserRouter>
            <TrySquidlySection />
            <FooterinfoSection />
        </div>
    );
}
