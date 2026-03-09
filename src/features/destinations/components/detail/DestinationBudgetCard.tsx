import type { CountryData } from "../../types/country";

interface DestinationBudgetCardProps {
    budget: CountryData["budget"];
}

const BUDGET_ROWS = [
    { label: "Logement", key: "housing" },
    { label: "Alimentation", key: "food" },
    { label: "Transport", key: "transport" },
    { label: "Loisirs", key: "leisure" },
] as const;

export function DestinationBudgetCard({ budget }: DestinationBudgetCardProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-primary-dark">Budget mensuel estimé</h2>
            <ul className="space-y-3">
                {BUDGET_ROWS.map(({ label, key }) => (
                    <li key={label} className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-semibold text-primary-dark">{budget[key]}</span>
                    </li>
                ))}
                <li className="flex justify-between pt-1">
                    <span className="font-bold text-primary-dark">Total estimé</span>
                    <span className="font-bold text-secondary">{budget.totalEstimate}</span>
                </li>
            </ul>
        </div>
    );
}
