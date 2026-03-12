import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import type { Destination } from "@/core/api/destinations";

interface DestinationCardProps {
    destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
    return (
        <Link
            to={`/destinations/${destination.id}`}
            className="group relative block overflow-hidden rounded-2xl shadow-lg transition-shadow hover:shadow-xl"
        >
            <div className="relative h-64 w-full bg-gradient-to-br from-primary-dark to-primary-dark/70">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="mb-1 flex items-center gap-1 text-secondary">
                            <MapPin size={14} />
                            <span className="text-xs">{destination.city}</span>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold">{destination.country}</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-white/60">{destination.city}</span>
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
