import { HeroSection } from "../components/HeroSection";
import { FeaturesGrid } from "../components/FeaturesGrid";
import { HowItWorks } from "../components/HowItWorks";
import { DestinationsGrid } from "../components/DestinationsGrid";
import { CtaBanner } from "../components/CtaBanner";
import { StatsSection } from "../components/StatsSection";


export default function HomePage() {
    return (
        <div className="bg-background-light">
            <HeroSection />
            <FeaturesGrid />
            <HowItWorks />
            <DestinationsGrid />
            <CtaBanner />
            <StatsSection />

        </div>
    );
}
