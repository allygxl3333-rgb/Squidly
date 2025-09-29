import SquidlyHero from './components/SquidlyHero'
import { BrowserSection } from './components/BrowserSection'
import GlobalBackground from './components/GlobalBackground'
import StepsSection from './components/StepsSection';export default function App() {
    return (
        <div className="min-h-screen relative">
            <GlobalBackground />   {/* ← 这行放最上面，铺满整页 */}
            <SquidlyHero />
            <BrowserSection />
            <StepsSection />
        </div>
    )
}
