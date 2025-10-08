// App.tsx
'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GlobalBackground from './components/GlobalBackground';
import NavBar from './components/NavBar';

import SquidlyHero from './components/SquidlyHero';
import { BrowserSection } from './components/BrowserSection';
import StepsSection from './components/StepsSection';
import VideoTextSection from './components/VideoTextSection';
import TestimonialsSection from './components/TestimonialsSection';
import ImageCompareSection from './components/ImageCompareSection';
import PrivacySection from './components/PrivacySection';
import FooterinfoSection from './components/FooterInfoSection';
import TrySquidlySection from './components/TrySquidlySection';
import PricingPage from './Subpages/PricePage';

function Home() {
    return (
        <>
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

            <div id="contact"></div>
        </>
    );
}

export default function App() {
    return (
        <div className="min-h-screen relative">
            {/*<GlobalBackground />*/}
            <BrowserRouter>
                <NavBar />
                <div className="pt-20"></div>
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
