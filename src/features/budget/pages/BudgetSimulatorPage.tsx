import { useState } from 'react';
import { useBudgetSimulator } from '../hooks/useBudgetSimulator';
import { BudgetHeader } from '../components/BudgetHeader';
import { BudgetDurationPicker } from '../components/BudgetDurationPicker';
import { BudgetCategorySection } from '../components/BudgetCategorySection';
import { BudgetSummary } from '../components/BudgetSummary';
import { BudgetActions } from '../components/BudgetActions';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { NoMobilityState } from '@/components/shared/NoMobilityState';
import { CATEGORIES } from '../types/budget';

export default function BudgetSimulatorPage() {
    const {
        destination,
        lines,
        total,
        referenceRange,
        months,
        setMonths,
        isLoading,
        error,
        updateAmount,
        updateLabel,
        addLine,
        removeLine,
        resetToDefault,
    } = useBudgetSimulator();

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-gray-50">
                <p className="text-gray-400">Chargement…</p>
            </div>
        );
    }

    if (error) return <NoMobilityState />;

    const linesByCategory = CATEGORIES
        .map((cat) => ({ ...cat, lines: lines.filter((l) => l.category === cat.id) }))
        .filter((cat) => cat.lines.length > 0);

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50">
            <BudgetHeader destination={destination} />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <div className="mb-8 space-y-4">
                    <BudgetDurationPicker months={months} onChange={setMonths} />
                    <BudgetSummary total={total} referenceRange={referenceRange} months={months} />
                </div>

                <div className="space-y-6">
                    {linesByCategory.map((cat) => (
                        <BudgetCategorySection
                            key={cat.id}
                            id={cat.id}
                            label={cat.label}
                            lines={cat.lines}
                            onUpdateAmount={updateAmount}
                            onUpdateLabel={updateLabel}
                            onRemove={removeLine}
                        />
                    ))}
                </div>

                <BudgetActions onAdd={() => setIsModalOpen(true)} onReset={resetToDefault} />
            </div>

            <AddExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={(label, amount, category) => addLine(label, amount, category)}
            />
        </div>
    );
}
