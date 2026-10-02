import { Link } from "react-router-dom";
import { Building2, Calendar, Compass, GraduationCap } from "lucide-react";
import type { Mobility } from "@/core/api/mobilities";
import { useReference } from "@/core/hooks/useReference";
import type { Destination } from "@/core/api/destinations";
import { formatLongDate } from "@/core/utils/dates";
import { InfoItem } from "./InfoItem";

interface MobilityProjectCardProps {
    mobility?: Mobility;
    destination?: Destination;
    isLoading?: boolean;
}

export function MobilityProjectCard({ mobility, destination, isLoading }: MobilityProjectCardProps) {
    const { mobilityTypeLabel } = useReference();
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-6 font-heading text-xl font-bold text-primary-dark">Ma mobilité</h2>

            {isLoading ? (
                <p className="text-gray-400">Chargement…</p>
            ) : !mobility ? (
                <div className="space-y-4">
                    <p className="text-gray-600">Aucune mobilité configurée pour le moment.</p>
                    <Link to="/mobility/new" className="inline-block rounded-lg bg-secondary px-4 py-2 font-bold text-primary-dark hover:bg-secondary/80">
                        Créer ma mobilité
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <InfoItem icon={<GraduationCap className="h-5 w-5" />} label="Type" value={mobilityTypeLabel(mobility.type)} />
                    <InfoItem
                        icon={<Compass className="h-5 w-5" />}
                        label="Destination"
                        value={destination ? `${destination.city}, ${destination.country}` : ""}
                    />
                    <InfoItem icon={<Calendar className="h-5 w-5" />} label="Date de départ" value={formatLongDate(mobility.departureDate)} />
                    <InfoItem icon={<Building2 className="h-5 w-5" />} label="Établissement d'accueil" value={mobility.school ?? ""} />
                    <Link to="/dashboard" className="inline-block font-semibold text-primary-light hover:underline">
                        Voir mon parcours →
                    </Link>
                </div>
            )}
        </div>
    );
}
