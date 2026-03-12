import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDestinations, Destination } from "@/core/api/destinations";
import { DestinationCard } from "@/features/destinations/components/list/DestinationCard";

export function DestinationsGrid() {
    const { t } = useTranslation();
    const [destinations, setDestinations] = useState<Destination[]>([]);

    useEffect(() => {
        getDestinations().then(({ data }) => setDestinations(data.data)).catch(() => {});
    }, []);

    return (
        <section id="destinations" className="relative z-10 bg-background-light py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center md:mb-20">
                    <h2 className="mb-4 text-3xl font-bold text-primary-dark md:text-4xl lg:text-5xl">
                        {t("home.destinations.title")}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        {t("home.destinations.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {destinations.slice(0, 6).map((destination) => (
                        <DestinationCard key={destination.id} destination={destination} />
                    ))}
                </div>

                {destinations.length > 0 && (
                    <div className="mt-12 text-center">
                        <Link
                            to="/destinations"
                            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 font-semibold text-primary-dark shadow-sm transition-all hover:-translate-y-1 hover:border-secondary hover:shadow-md"
                        >
                            {t("home.destinations.see_all")} ({destinations.length})
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
