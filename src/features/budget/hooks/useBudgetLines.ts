import { useState, useEffect, useCallback } from 'react';
import type { Destination } from '@/core/api/destinations';
import type { BudgetLine, BudgetCategory } from '../types/budget';

function lsKey(destId: string) {
    return `studafly_budget_${destId}`;
}

function initFromDestination(destination: Destination): BudgetLine[] {
    const c = destination.costOfLiving;
    if (!c) return [];
    const lines: BudgetLine[] = [];
    if (c.rent) {
        lines.push({ id: 'rent', label: 'Logement (chambre partagée)', amount: c.rent.shared, category: 'logement', isCustom: false });
    }
    if (c.food != null) {
        lines.push({ id: 'food', label: 'Alimentation', amount: c.food, category: 'alimentation', isCustom: false });
    }
    if (c.transport != null) {
        lines.push({ id: 'transport', label: 'Transports', amount: c.transport, category: 'transport', isCustom: false });
    }
    if (c.leisure != null) {
        lines.push({ id: 'leisure', label: 'Loisirs & Sorties', amount: c.leisure, category: 'loisirs', isCustom: false });
    }
    if (c.misc != null) {
        lines.push({ id: 'misc', label: 'Divers', amount: c.misc, category: 'autre', isCustom: false });
    }
    return lines;
}

export function useBudgetLines(destination: Destination | null) {
    const [lines, setLines] = useState<BudgetLine[]>([]);

    // Load from localStorage or defaults when destination changes
    useEffect(() => {
        if (!destination) return;
        const saved = localStorage.getItem(lsKey(destination.id));
        if (saved) {
            try {
                setLines(JSON.parse(saved));
                return;
            } catch {
                // fall through to default
            }
        }
        setLines(initFromDestination(destination));
    }, [destination]);

    // Persist to localStorage on every change
    useEffect(() => {
        if (destination) {
            localStorage.setItem(lsKey(destination.id), JSON.stringify(lines));
        }
    }, [lines, destination]);

    const updateAmount = useCallback((id: string, amount: number) => {
        setLines((prev) => prev.map((l) => (l.id === id ? { ...l, amount } : l)));
    }, []);

    const updateLabel = useCallback((id: string, label: string) => {
        setLines((prev) => prev.map((l) => (l.id === id ? { ...l, label } : l)));
    }, []);

    const addLine = useCallback((label: string, amount: number, category: BudgetCategory) => {
        setLines((prev) => [
            ...prev,
            { id: crypto.randomUUID(), label, amount, category, isCustom: true },
        ]);
    }, []);

    const removeLine = useCallback((id: string) => {
        setLines((prev) => prev.filter((l) => l.id !== id));
    }, []);

    const resetToDefault = useCallback(() => {
        if (destination) {
            setLines(initFromDestination(destination));
            localStorage.removeItem(lsKey(destination.id));
        }
    }, [destination]);

    const total = lines.reduce((sum, l) => sum + (isNaN(l.amount) ? 0 : l.amount), 0);

    return { lines, total, updateAmount, updateLabel, addLine, removeLine, resetToDefault };
}
