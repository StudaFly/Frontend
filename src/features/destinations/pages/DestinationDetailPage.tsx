import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Globe } from "lucide-react";
import { getDestination, Destination } from "@/core/api/destinations";

export default function DestinationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [destination, setDestination] = useState<Destination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            <div className="relative bg-gradient-to-br from-primary-dark to-primary-dark/80 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                            <div className="flex items-center gap-3 text-gray-600">
                                <Globe size={20} className="text-secondary" />
                                <span>{destination.city}, {destination.country}</span>
                            </div>
                        </div>

                        {/* Budget & guide coming soon */}
                        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
                            <p className="font-semibold text-gray-400">Guide de destination</p>
                            <p className="mt-1 text-sm text-gray-300">Bientôt disponible</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
                            <p className="font-semibold text-gray-400">Estimation budget</p>
                            <p className="mt-1 text-sm text-gray-300">Bientôt disponible</p>
                        </div>
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
