import { Calendar, CheckCircle2, Euro, MapPin, FileText, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";

interface Feature {
    icon: LucideIcon;
    titleKey: string;
    descKey: string;
}

const FEATURES: Feature[] = [
    { icon: Calendar, titleKey: "home.features.timeline_title", descKey: "home.features.timeline_desc" },
    { icon: CheckCircle2, titleKey: "home.features.checklist_title", descKey: "home.features.checklist_desc" },
    { icon: Euro, titleKey: "home.features.budget_title", descKey: "home.features.budget_desc" },
    { icon: MapPin, titleKey: "home.features.guide_title", descKey: "home.features.guide_desc" },
    { icon: FileText, titleKey: "home.features.documents_title", descKey: "home.features.documents_desc" },
    { icon: Bell, titleKey: "home.features.notifications_title", descKey: "home.features.notifications_desc" },
];

interface FeatureCardProps {
    icon: LucideIcon;
    titleKey: string;
    descKey: string;
}

function FeatureCard({ icon: Icon, titleKey, descKey }: FeatureCardProps) {
    const { t } = useTranslation();
    return (
        <div className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl md:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Icon className="text-primary-dark" size={24} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-primary-dark">{t(titleKey)}</h3>
            <p className="leading-relaxed text-gray-600">{t(descKey)}</p>
        </div>
    );
}

export function FeaturesGrid() {
    const { t } = useTranslation();

    return (
        <section id="features" className="relative z-10 bg-background-light py-24 md:py-32">
            {/* Decorative wave — overlaps the sticky Hero section above */}
            <div className="pointer-events-none absolute bottom-full left-0 right-0 w-full overflow-hidden leading-[0]">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative top-[1px] w-full">
                    <path
                        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        fill="#F9FAFB"
                    />
                </svg>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center md:mb-20">
                    <h2 className="mb-4 text-3xl font-bold text-primary-dark md:text-4xl lg:text-5xl">
                        {t("home.features.title")}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">{t("home.features.subtitle")}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
                    {FEATURES.map((feature) => (
                        <FeatureCard key={feature.titleKey} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
