import { Globe } from 'lucide-react';
import type { Destination } from '@/core/api/destinations';

interface DestinationAboutCardProps {
    destination: Destination;
}

export function DestinationAboutCard({ destination }: DestinationAboutCardProps) {
    return (
        <div className="rounded-2xl bg-white p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-primary-dark">À propos</h2>
            <div className="flex items-center gap-3 text-gray-600">
                <Globe size={20} className="text-secondary" />
                <span>{destination.city}, {destination.country}</span>
            </div>
        </div>
    );
}
