import { useState, useEffect, useCallback } from "react";
import { getDestinations, Destination } from "@/core/api/destinations";
import { DestinationsHero } from "../components/list/DestinationsHero";
import { DestinationCard } from "../components/list/DestinationCard";
import { DestinationsEmptyState } from "../components/list/DestinationsEmptyState";

export default function DestinationsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDestinations = useCallback((query: string) => {
        setIsLoading(true);
        setError(null);
        getDestinations(query || undefined)
            .then(({ data }) => setDestinations(data.data))
            .catch(() => setError("Impossible de charger les destinations."))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchDestinations(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm, fetchDestinations]);

    return (
        <div className="min-h-screen bg-background-light">
            <DestinationsHero searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="mb-10 text-2xl font-bold text-primary-dark md:text-3xl">
                    Toutes les destinations ({destinations.length})
                </h2>

                {isLoading && (
                    <p className="text-center text-gray-400">Chargement des destinations…</p>
                )}
                {error && (
                    <p className="text-center text-red-500">{error}</p>
                )}
                {!isLoading && !error && destinations.length > 0 && (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {destinations.map((destination) => (
                            <DestinationCard key={destination.id} destination={destination} />
                        ))}
                    </div>
                )}
                {!isLoading && !error && destinations.length === 0 && (
                    <DestinationsEmptyState onReset={() => setSearchTerm("")} />
                )}
            </div>
        </div>
    );
}
