import { Globe, DollarSign, Cloud, ShieldCheck } from "lucide-react";
import type { CountryData } from "../../types/country";

interface DestinationOverviewCardProps {
    overview: CountryData["overview"];
}

// Each row: icon + label + value
const OVERVIEW_ROWS = [
    { icon: Globe, label: "Langue", key: "language" },
    { icon: DollarSign, label: "Devise", key: "currency" },
    { icon: Cloud, label: "Climat", key: "climate" },
] as const;

export function DestinationOverviewCard({ overview }: DestinationOverviewCardProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-primary-dark">Aperçu</h2>
            <ul className="space-y-4">
                {OVERVIEW_ROWS.map(({ icon: Icon, label, key }) => (
                    <li key={label} className="flex items-start gap-3">
                        <Icon size={20} className="mt-0.5 flex-shrink-0 text-secondary" />
                        <div>
                            <p className="text-xs text-gray-500">{label}</p>
                            <p className="font-semibold text-primary-dark">{overview[key]}</p>
                        </div>
                    </li>
                ))}
                <li className="flex items-start gap-3">
                    <ShieldCheck size={20} className="mt-0.5 flex-shrink-0 text-secondary" />
                    <div>
                        <p className="text-xs text-gray-500">Visa requis</p>
                        <p className="font-semibold text-primary-dark">
                            {overview.visaRequired ? "Oui" : "Non"}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    );
}
