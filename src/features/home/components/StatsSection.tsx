import { useTranslation } from "react-i18next";

type StatKey = "students" | "countries" | "satisfaction" | "support";
const STAT_KEYS: StatKey[] = ["students", "countries", "satisfaction", "support"];

export function StatsSection() {
    const { t } = useTranslation();

    return (
        <section className="relative z-10 bg-white py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-16">
                    {STAT_KEYS.map((key) => (
                        <div key={key} className="text-center">
                            <div className="mb-2 text-4xl font-bold text-secondary md:text-5xl">
                                {t(`home.stats.${key}_value`)}
                            </div>
                            <p className="text-gray-600">{t(`home.stats.${key}_label`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
