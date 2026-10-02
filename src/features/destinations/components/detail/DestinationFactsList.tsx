import { CloudSun, Coins, Languages, Stamp, Users } from "lucide-react";
import type { DestinationFacts } from "@/core/api/destinations";

/** Country facts served by the API (GET /destinations/{id}). */
export function DestinationFactsList({ facts }: { facts: DestinationFacts }) {
    const rows = [
        { icon: Languages, label: "Langue", value: facts.language },
        { icon: Coins, label: "Monnaie", value: facts.currency },
        { icon: CloudSun, label: "Climat", value: facts.climate },
        {
            icon: Stamp,
            label: "Visa",
            value: facts.visaRequired == null ? null : facts.visaRequired ? "Requis" : "Non requis",
        },
        {
            icon: Users,
            label: "Étudiants internationaux / an",
            value: facts.internationalStudents?.toLocaleString("fr-FR"),
        },
    ].filter((row) => row.value);

    return (
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rows.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-secondary" aria-hidden />
                    <div>
                        <dt className="text-sm text-gray-500">{label}</dt>
                        <dd className="font-semibold text-primary-dark">{value}</dd>
                    </div>
                </div>
            ))}
        </dl>
    );
}
