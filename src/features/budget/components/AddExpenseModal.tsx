import { useState } from 'react';
import { X } from 'lucide-react';
import type { BudgetCategory } from '../types/budget';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (label: string, amount: number, category: BudgetCategory) => void;
}

const CATEGORIES: { id: BudgetCategory; label: string }[] = [
    { id: 'logement',     label: 'Logement' },
    { id: 'alimentation', label: 'Alimentation' },
    { id: 'transport',    label: 'Transport' },
    { id: 'loisirs',      label: 'Loisirs' },
    { id: 'autre',        label: 'Autre' },
];

export function AddExpenseModal({ isOpen, onClose, onAdd }: AddExpenseModalProps) {
    const [label, setLabel]       = useState('');
    const [amount, setAmount]     = useState('');
    const [category, setCategory] = useState<BudgetCategory>('autre');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const v = parseFloat(amount);
        if (!label.trim() || isNaN(v) || v < 0) return;
        onAdd(label.trim(), v, category);
        setLabel('');
        setAmount('');
        setCategory('autre');
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-heading text-xl font-bold text-primary-dark">Ajouter une dépense</h2>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Intitulé *</label>
                        <input
                            required
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Ex : Assurance voyage"
                            className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary-dark"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Catégorie</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as BudgetCategory)}
                            className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary-dark"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Montant mensuel (€) *</label>
                        <input
                            required
                            type="number"
                            min="0"
                            step="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Ex : 50"
                            className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary-dark"
                        />
                    </div>

                    <div className="mt-1 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-gray-600 ring-1 ring-slate-200 hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-xl bg-primary-dark py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
                        >
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
