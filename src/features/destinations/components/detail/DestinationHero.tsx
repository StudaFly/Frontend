import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { CountryData } from "../../types/country";

interface DestinationHeroProps {
    country: CountryData;
}

export function DestinationHero({ country }: DestinationHeroProps) {
    return (
        <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
            <img
                src={country.image}
                alt={country.name}
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="mx-auto max-w-7xl">
                    <Link
                        to="/destinations"
                        className="mb-4 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Toutes les destinations
                    </Link>
                    <h1 className="text-4xl font-bold text-white md:text-5xl">{country.name}</h1>
                    <p className="mt-2 text-lg text-gray-200">{country.city}</p>
                </div>
            </div>
        </div>
    );
}
