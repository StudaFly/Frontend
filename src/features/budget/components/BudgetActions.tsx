import { Plus, RotateCcw } from 'lucide-react';

interface BudgetActionsProps {
    onAdd: () => void;
    onReset: () => void;
}

export function BudgetActions({ onAdd, onReset }: BudgetActionsProps) {
    return (
        <div className="mt-8 flex flex-wrap gap-3">
            <button
                onClick={onAdd}
                className="flex items-center gap-2 rounded-xl bg-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-light"
            >
                <Plus size={16} />
                Ajouter une dépense
            </button>
            <button
                onClick={onReset}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-gray-50"
            >
                <RotateCcw size={15} />
                Réinitialiser
            </button>
        </div>
    );
}
