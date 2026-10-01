import { Home, PartyPopper, TrainFront, UtensilsCrossed, Wallet, type LucideIcon } from "lucide-react";
import type { BudgetCategoryKey, BudgetEstimate } from "@/core/api/destinations";
import { formatEuros } from "@/core/utils/dates";

const CATEGORY_STYLE: Record<BudgetCategoryKey, { icon: LucideIcon; color: string; bg: string }> = {
    housing: { icon: Home, color: "#3B82F6", bg: "#EFF6FF" },
    food: { icon: UtensilsCrossed, color: "#22C55E", bg: "#F0FDF4" },
    transport: { icon: TrainFront, color: "#F59E0B", bg: "#FFFBEB" },
    leisure: { icon: PartyPopper, color: "#EC4899", bg: "#FDF2F8" },
};
const FALLBACK_STYLE = { icon: Wallet, color: "#33518A", bg: "#EEF2FF" };

interface BudgetBreakdownProps {
    budget: BudgetEstimate;
    /** Stay length in months, to show the total over the stay. */
    months?: number | null;
}

export function BudgetBreakdown({ budget, months }: BudgetBreakdownProps) {
    const scaleMax = Math.max(...budget.breakdown.map((c) => c.amountMax), 0);
    const totalMax = budget.breakdown.reduce((sum, c) => sum + c.amountMax, 0);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Budget mensuel estimé</p>
                <p className="font-heading text-4xl font-bold text-primary-dark">
                    {formatEuros(budget.monthlyTotalMin, budget.monthlyTotalMax, budget.currency)}
                </p>
                {months ? (
                    <p className="mt-1 text-sm text-gray-500">
                        soit {formatEuros(budget.monthlyTotalMin * months, budget.monthlyTotalMax * months, budget.currency)} sur {months} mois
                    </p>
                ) : null}
            </div>

            <div>
                <div className="flex h-3 gap-1 overflow-hidden rounded-full" aria-hidden>
                    {budget.breakdown.map((c) => (
                        <div
                            key={c.key}
                            style={{ flex: totalMax > 0 ? c.amountMax / totalMax : 1, backgroundColor: (CATEGORY_STYLE[c.key] ?? FALLBACK_STYLE).color }}
                        />
                    ))}
                </div>
            </div>

            <ul className="space-y-3">
                {budget.breakdown.map((category) => {
                    const style = CATEGORY_STYLE[category.key] ?? FALLBACK_STYLE;
                    const Icon = style.icon;
                    return (
                        <li key={category.key} className="flex items-center gap-4 rounded-xl bg-white p-4 ring-1 ring-slate-100">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: style.bg }}>
                                <Icon className="h-5 w-5" style={{ color: style.color }} aria-hidden />
                            </span>
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between gap-2">
                                    <span className="font-semibold text-primary-dark">{category.label}</span>
                                    <span className="font-bold text-primary-dark">
                                        {formatEuros(category.amountMin, category.amountMax, category.currency)}
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-gray-200" aria-hidden>
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${scaleMax > 0 ? (category.amountMax / scaleMax) * 100 : 0}%`, backgroundColor: style.color }}
                                    />
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <p className="text-center text-xs text-gray-500">
                Estimation indicative pour un étudiant (colocation ou studio), hors frais de départ.
            </p>
        </div>
    );
}
