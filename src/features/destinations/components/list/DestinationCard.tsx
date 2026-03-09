import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CountryData } from "../../types/country";

interface DestinationCardProps {
    destination: CountryData;
}

export function DestinationCard({ destination }: DestinationCardProps) {
    return (
        <Link
            to={`/destinations/${destination.slug}`}
            className="group relative block overflow-hidden rounded-2xl shadow-lg transition-shadow hover:shadow-xl"
        >
            <div className="relative h-64 w-full">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="mb-1 text-2xl font-bold">{destination.name}</h3>
                        <p className="mb-2 text-sm text-gray-200">{destination.city}</p>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-secondary">{destination.students} étudiants/an</p>
                            <span className="flex items-center gap-1 text-xs text-white/70">
                                Voir <ArrowRight size={12} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
