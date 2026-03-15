import { useState, useEffect } from 'react';
import { useBudgetData } from './useBudgetData';
import { useBudgetLines } from './useBudgetLines';

export function useBudgetSimulator() {
    const { destination, defaultMonths, isLoading, error } = useBudgetData();
    const [months, setMonths] = useState(6);
    const { lines, total, updateAmount, updateLabel, addLine, removeLine, resetToDefault } = useBudgetLines(destination);

    useEffect(() => {
        if (defaultMonths) setMonths(defaultMonths);
    }, [defaultMonths]);

    const referenceRange = destination?.costOfLiving?.monthly_budget ?? null;

    return {
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
    };
}
