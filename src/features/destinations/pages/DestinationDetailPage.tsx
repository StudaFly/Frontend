import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { getDestination, getDestinationBudget, getDestinationGuide, type DestinationDetail } from "@/core/api/destinations";
import { DestinationFactsList } from "../components/detail/DestinationFactsList";
import { useAuth } from "@/contexts/AuthContext";
import { BudgetBreakdown } from "@/features/budget/components/BudgetBreakdown";
import { GuideContent } from "@/features/guide/components/GuideContent";

export default function DestinationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [destination, setDestination] = useState<DestinationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const budget = useQuery({
        queryKey: ["budget", id],
        queryFn: async () => (await getDestinationBudget(id!)).data.data,
        // The API says whether reference data exists: no call (and no 404) otherwise.
        enabled: !!id && !!destination?.hasBudget,
        retry: false,
    });
    const guide = useQuery({
        queryKey: ["guide", id],
        queryFn: async () => (await getDestinationGuide(id!)).data.data,
        enabled: !!id && !!destination?.hasGuide,
        retry: false,
    });

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        getDestination(id)
            .then(({ data }) => setDestination(data.data))
            .catch(() => setError("Destination introuvable."))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light">
                <p className="text-gray-400">Chargement…</p>
            </div>
        );
    }

    if (error || !destination) {
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
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark to-primary-dark/80 py-20">
                {destination.imageUrl ? (
                    <>
                        <img src={destination.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-primary-dark/70" aria-hidden />
                    </>
                ) : null}
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/destinations"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Toutes les destinations
                    </Link>
                    <h1 className="text-4xl font-bold text-white md:text-5xl">{destination.country}</h1>
                    <div className="mt-2 flex items-center gap-2 text-gray-200">
                        <MapPin size={16} />
                        <span className="text-lg">{destination.city}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main column */}
                    <div className="space-y-8 lg:col-span-2">
                        <div className="rounded-2xl bg-white p-8 shadow-md">
                            <h2 className="mb-4 text-2xl font-bold text-primary-dark">À propos</h2>
                            {destination.summary ? <p className="text-gray-600">{destination.summary}</p> : null}
                            {destination.facts ? <DestinationFactsList facts={destination.facts} /> : null}
                        </div>

                        <section className="rounded-2xl bg-white p-8 shadow-md">
                            <h2 className="mb-4 text-2xl font-bold text-primary-dark">Guide de destination</h2>
                            {guide.isFetching ? (
                                <p className="text-gray-400">Chargement…</p>
                            ) : guide.data ? (
                                <GuideContent guide={guide.data} />
                            ) : (
                                <p className="text-gray-500">Pas encore de guide pour cette destination.</p>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <section className="rounded-2xl bg-white p-6 shadow-md">
                            <h2 className="mb-4 text-xl font-bold text-primary-dark">Coût de la vie</h2>
                            {budget.isFetching ? (
                                <p className="text-gray-400">Chargement…</p>
                            ) : budget.data ? (
                                <BudgetBreakdown budget={budget.data} />
                            ) : (
                                <p className="text-gray-500">Pas encore d'estimation pour cette destination.</p>
                            )}
                        </section>
                        <Link
                            to={isAuthenticated ? "/mobility/new" : "/register"}
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
