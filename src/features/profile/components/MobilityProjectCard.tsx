import { Compass, Calendar, Wallet } from "lucide-react";
import { InfoItem } from "./InfoItem";

interface MobilityProjectCardProps {
    destinations: string[];
    period: string;
    budget: string;
    isEditing?: boolean;
    onUpdate?: (field: string, value: string | string[]) => void;
}

export function MobilityProjectCard({ destinations, period, budget, isEditing, onUpdate }: MobilityProjectCardProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-6 font-heading text-xl font-bold text-primary-dark">Projet de mobilité</h2>

            <div className="space-y-6">
                <InfoItem
                    icon={<Compass className="h-5 w-5" />}
                    label="Destinations visées"
                    value={destinations}
                    isArrayValue
                    isEditing={isEditing}
                    placeholder="Japon, Canada..."
                    onUpdate={(val) => onUpdate?.("destinations", val)}
                />

                <InfoItem
                    icon={<Calendar className="h-5 w-5" />}
                    label="Période souhaitée"
                    value={period}
                    isEditing={isEditing}
                    onUpdate={(val) => onUpdate?.("period", val as string)}
                />

                <InfoItem
                    icon={<Wallet className="h-5 w-5" />}
                    label="Budget estimé"
                    value={budget}
                    isEditing={isEditing}
                    onUpdate={(val) => onUpdate?.("budget", val as string)}
                />
            </div>
        </div>
    );
}
