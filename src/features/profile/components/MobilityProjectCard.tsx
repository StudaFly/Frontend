import { Compass, Calendar, Wallet, GraduationCap, Building2 } from "lucide-react";
import { InfoItem } from "./InfoItem";
import type { Mobility } from "@/core/api/mobilities";
import type { Destination } from "@/core/api/destinations";

const TYPE_LABELS: Record<Mobility["type"], string> = {
    erasmus: "Erasmus",
    stage: "Stage",
    semestre: "Semestre à l'étranger",
    double_diplome: "Double diplôme",
};

const STATUS_CONFIG: Record<Mobility["status"], { label: string; className: string }> = {
    preparing: { label: "En préparation", className: "bg-amber-100 text-amber-700" },
    departed: { label: "En cours", className: "bg-green-100 text-green-700" },
    completed: { label: "Terminé", className: "bg-slate-100 text-slate-600" },
};

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function toInputDate(d: string) {
    return d.slice(0, 10);
}

const inputClass =
    "mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary";

interface MobilityProjectCardProps {
    destinations: string[];
    period: string;
    budget: string;
    isEditing?: boolean;
    onUpdate?: (field: string, value: string | string[]) => void;
    mobility?: Mobility;
    destination?: Destination;
    draftMobility?: Partial<Mobility>;
    onMobilityUpdate?: (field: keyof Mobility, value: string) => void;
}

export function MobilityProjectCard({
    destinations,
    period,
    budget,
    isEditing,
    onUpdate,
    mobility,
    destination,
    draftMobility,
    onMobilityUpdate,
}: MobilityProjectCardProps) {
    const status = mobility ? STATUS_CONFIG[mobility.status] : null;

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-primary-dark">Projet de mobilité</h2>
                {status && (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                    </span>
                )}
            </div>

            {mobility && isEditing ? (
                <div className="space-y-6">
                    {/* Type */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-secondary">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Type de mobilité</p>
                            <select
                                value={draftMobility?.type ?? mobility.type}
                                onChange={(e) => onMobilityUpdate?.("type", e.target.value)}
                                className={inputClass}
                            >
                                {Object.entries(TYPE_LABELS).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* School */}
                    <InfoItem
                        icon={<Building2 className="h-5 w-5" />}
                        label="École partenaire"
                        value={draftMobility?.school ?? mobility.school ?? ""}
                        isEditing
                        placeholder="Keimyung University..."
                        onUpdate={(val) => onMobilityUpdate?.("school", val as string)}
                    />

                    {/* Departure */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-secondary">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Date de départ</p>
                            <input
                                type="date"
                                value={toInputDate(draftMobility?.departureDate ?? mobility.departureDate)}
                                onChange={(e) => onMobilityUpdate?.("departureDate", e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Return */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-secondary">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Date de retour</p>
                            <input
                                type="date"
                                value={toInputDate(draftMobility?.returnDate ?? mobility.returnDate ?? "")}
                                onChange={(e) => onMobilityUpdate?.("returnDate", e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            ) : mobility && !isEditing ? (
                <div className="space-y-6">
                    <InfoItem
                        icon={<Compass className="h-5 w-5" />}
                        label="Destination"
                        value={destination ? `${destination.city}, ${destination.country}` : "—"}
                    />
                    <InfoItem
                        icon={<GraduationCap className="h-5 w-5" />}
                        label="Type de mobilité"
                        value={TYPE_LABELS[mobility.type]}
                    />
                    {mobility.school && (
                        <InfoItem
                            icon={<Building2 className="h-5 w-5" />}
                            label="École partenaire"
                            value={mobility.school}
                        />
                    )}
                    <InfoItem
                        icon={<Calendar className="h-5 w-5" />}
                        label="Dates"
                        value={`${fmtDate(mobility.departureDate)}${mobility.returnDate ? ` → ${fmtDate(mobility.returnDate)}` : ""}`}
                    />
                </div>
            ) : (
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
            )}
        </div>
    );
}
