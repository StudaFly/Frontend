import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import type { Destination } from '@/core/api/destinations';

interface DestinationHeroProps {
    destination: Destination;
}

export function DestinationHero({ destination }: DestinationHeroProps) {
    return (
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
    );
}
