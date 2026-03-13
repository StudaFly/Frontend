import type { Destination } from '@/core/api/destinations';

interface DestinationBudgetCardProps {
    destination: Destination;
}

export function DestinationBudgetCard({ destination }: DestinationBudgetCardProps) {
    const c = destination.costOfLiving;
    if (!c) return null;

    const fmt = (v: number) => `${v} €`;
    const fmtRange = (min: number, max: number) => `${min} – ${max} €`;

    const rows = [
        c.rent && { label: 'Logement (coloc)', value: fmtRange(c.rent.shared, c.rent.studio) },
        c.food    != null && { label: 'Alimentation', value: fmt(c.food) },
        c.transport != null && { label: 'Transports', value: fmt(c.transport) },
        c.leisure != null && { label: 'Loisirs & Sorties', value: fmt(c.leisure) },
    ].filter(Boolean) as { label: string; value: string }[];

    const total = c.monthly_budget
        ? fmtRange(c.monthly_budget.min, c.monthly_budget.max)
        : null;

    return (
        <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-primary-dark">Budget mensuel estimé</h2>
            <ul className="space-y-3">
                {rows.map(({ label, value }) => (
                    <li key={label} className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-semibold text-primary-dark">{value}</span>
                    </li>
                ))}
                {total && (
                    <li className="flex justify-between pt-1">
                        <span className="font-bold text-primary-dark">Total / mois</span>
                        <span className="font-bold text-secondary">{total}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}
