import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import type { Destination } from '@/core/api/destinations';

interface DestinationHeroProps {
    destination: Destination;
}

export function DestinationHero({ destination }: DestinationHeroProps) {
    return (
        <div
            className="relative bg-gradient-to-br from-primary-dark to-primary-dark/80 bg-cover bg-center py-24"
            style={destination.imageUrl ? { backgroundImage: `url(${destination.imageUrl})` } : undefined}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,25,60,0.55)] to-[rgba(15,25,60,0.88)]" />
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Link
                    to="/destinations"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Toutes les destinations
                </Link>
                <h1 className="text-5xl font-bold text-white md:text-6xl">{destination.country}</h1>
                <div className="mt-2 flex items-center gap-2 text-gray-200">
                    <MapPin size={16} />
                    <span className="text-xl">{destination.city}</span>
                </div>
                {destination.guideContent?.overview && (
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
                        {destination.guideContent.overview}
                    </p>
                )}
            </div>
        </div>
    );
}
