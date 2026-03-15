import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types/budget';
import type { BudgetLine } from '../types/budget';

interface BudgetLineItemProps {
    line: BudgetLine;
    onUpdateAmount: (id: string, amount: number) => void;
    onUpdateLabel: (id: string, label: string) => void;
    onRemove: (id: string) => void;
}

export function BudgetLineItem({ line, onUpdateAmount, onUpdateLabel, onRemove }: BudgetLineItemProps) {
    const [editingAmount, setEditingAmount] = useState(false);
    const [editingLabel, setEditingLabel] = useState(false);
    const [tempAmount, setTempAmount] = useState(String(line.amount));
    const [tempLabel, setTempLabel] = useState(line.label);

    const commitAmount = () => {
        const v = parseFloat(tempAmount);
        if (!isNaN(v) && v >= 0) onUpdateAmount(line.id, v);
        else setTempAmount(String(line.amount));
        setEditingAmount(false);
    };

    const commitLabel = () => {
        const v = tempLabel.trim();
        if (v) onUpdateLabel(line.id, v);
        else setTempLabel(line.label);
        setEditingLabel(false);
    };

    return (
        <div className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-100">
            <span className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline ${CATEGORY_COLORS[line.category]}`}>
                {CATEGORY_LABELS[line.category]}
            </span>

            {/* Label */}
            <div className="flex flex-1 items-center gap-1.5 overflow-hidden">
                {editingLabel ? (
                    <>
                        <input
                            autoFocus
                            value={tempLabel}
                            onChange={(e) => setTempLabel(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') commitLabel();
                                if (e.key === 'Escape') { setTempLabel(line.label); setEditingLabel(false); }
                            }}
                            className="flex-1 rounded-lg border border-primary-dark px-2 py-1 text-sm outline-none"
                        />
                        <button onClick={commitLabel} className="rounded p-1 text-green-600 hover:bg-green-50">
                            <Check size={14} />
                        </button>
                        <button onClick={() => { setTempLabel(line.label); setEditingLabel(false); }} className="rounded p-1 text-gray-400 hover:bg-gray-50">
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <>
                        <span className="flex-1 truncate text-sm font-medium text-gray-800">{line.label}</span>
                        {!editingAmount && (
                            <button
                                onClick={() => { setTempLabel(line.label); setEditingLabel(true); }}
                                className="shrink-0 rounded p-1 text-gray-300 opacity-0 transition-opacity hover:text-primary-dark group-hover:opacity-100"
                                aria-label="Modifier le nom"
                            >
                                <Pencil size={13} />
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Amount */}
            <div className="flex shrink-0 items-center gap-1">
                {editingAmount ? (
                    <>
                        <input
                            autoFocus
                            type="number"
                            min="0"
                            value={tempAmount}
                            onChange={(e) => setTempAmount(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') commitAmount();
                                if (e.key === 'Escape') { setTempAmount(String(line.amount)); setEditingAmount(false); }
                            }}
                            onBlur={commitAmount}
                            className="w-24 rounded-lg border border-primary-dark px-2 py-1 text-right text-sm outline-none"
                        />
                        <span className="text-sm text-gray-400">€</span>
                    </>
                ) : (
                    <button
                        onClick={() => { setTempAmount(String(line.amount)); setEditingAmount(true); }}
                        className="rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-semibold text-primary-dark ring-1 ring-slate-200 transition-colors hover:bg-primary-dark hover:text-white"
                    >
                        {line.amount} €
                    </button>
                )}
            </div>

            {/* Delete */}
            <div className="w-7 shrink-0">
                {line.isCustom && (
                    <button
                        onClick={() => onRemove(line.id)}
                        className="rounded-lg p-1.5 text-gray-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                        aria-label="Supprimer"
                    >
                        <Trash2 size={15} />
                    </button>
                )}
            </div>
        </div>
    );
}
