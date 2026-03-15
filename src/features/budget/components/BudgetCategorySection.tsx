import { BudgetLineItem } from './BudgetLineItem';
import type { BudgetLine, BudgetCategory } from '../types/budget';

interface BudgetCategorySectionProps {
    id: BudgetCategory;
    label: string;
    lines: BudgetLine[];
    onUpdateAmount: (id: string, amount: number) => void;
    onUpdateLabel: (id: string, label: string) => void;
    onRemove: (id: string) => void;
}

export function BudgetCategorySection({ label, lines, onUpdateAmount, onUpdateLabel, onRemove }: BudgetCategorySectionProps) {
    return (
        <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {label}
            </h3>
            <div className="space-y-2">
                {lines.map((line) => (
                    <BudgetLineItem
                        key={line.id}
                        line={line}
                        onUpdateAmount={onUpdateAmount}
                        onUpdateLabel={onUpdateLabel}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
}
