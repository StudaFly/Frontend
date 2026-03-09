import { useParams, Link } from "react-router-dom";
import { countries } from "../data/countries";
import { DestinationHero } from "../components/detail/DestinationHero";
import { DestinationStepsCard } from "../components/detail/DestinationStepsCard";
import { DestinationOverviewCard } from "../components/detail/DestinationOverviewCard";
import { DestinationBudgetCard } from "../components/detail/DestinationBudgetCard";

export default function DestinationDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const country = countries.find((c) => c.slug === slug);

    if (!country) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background-light">
                <h1 className="text-2xl font-bold text-primary-dark">Destination introuvable</h1>
                <Link to="/destinations" className="text-primary-dark hover:underline">
                    ← Retour aux destinations
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light">
            <DestinationHero country={country} />

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main column */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* About */}
                        <div className="rounded-2xl bg-white p-8 shadow-md">
                            <h2 className="mb-4 text-2xl font-bold text-primary-dark">À propos</h2>
                            <p className="leading-relaxed text-gray-600">{country.description}</p>
                            <p className="mt-3 text-sm font-semibold text-secondary">
                                {country.students} étudiants français/an
                            </p>
                        </div>

                        <DestinationStepsCard steps={country.steps} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <DestinationOverviewCard overview={country.overview} />
                        <DestinationBudgetCard budget={country.budget} />
                        <Link
                            to="/register"
                            className="block w-full rounded-xl bg-secondary py-4 text-center font-bold text-primary-dark transition-colors hover:bg-secondary/80"
                        >
                            Commencer ma préparation →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
