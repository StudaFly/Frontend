import { useTranslation } from "react-i18next";
import { usePublicStats } from "@/core/hooks/usePublicStats";
import type { PublicStats } from "@/core/api/reference";

const STATS: { key: keyof PublicStats; labelKey: string }[] = [
    { key: "countries", labelKey: "home.stats.countries_label" },
    { key: "destinations", labelKey: "home.stats.destinations_label" },
    { key: "preparationSteps", labelKey: "home.stats.preparation_steps_label" },
    { key: "students", labelKey: "home.stats.students_label" },
];

export function StatsSection() {
    const { t } = useTranslation();
    const { data } = usePublicStats();

    return (
        <section className="relative z-10 bg-white py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-16">
                    {STATS.map(({ key, labelKey }) => (
                        <div key={key} className="text-center">
                            <div className="mb-2 text-4xl font-bold text-secondary md:text-5xl">
                                {data ? data[key].toLocaleString("fr-FR") : "—"}
                            </div>
                            <p className="text-gray-600">{t(labelKey)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
