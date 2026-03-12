import type { Destination } from '@/core/api/destinations';
import { DestinationCard } from './DestinationCard';
import { DestinationsEmptyState } from './DestinationsEmptyState';

interface DestinationsListProps {
    destinations: Destination[];
    isLoading: boolean;
    error: string | null;
    onReset: () => void;
}

export function DestinationsList({ destinations, isLoading, error, onReset }: DestinationsListProps) {
    return (
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
                <DestinationsEmptyState onReset={onReset} />
            )}
        </div>
    );
}
