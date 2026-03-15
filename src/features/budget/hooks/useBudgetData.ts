import { useMemo } from 'react';
import { useMobility } from '@/core/hooks/useMobility';
import { useDestination } from '@/features/destinations/hooks/useDestination';
import type { Mobility } from '@/core/api/mobilities';

function computeMonths(mobility: Mobility): number {
    if (!mobility.returnDate) return 6;
    const start = new Date(mobility.departureDate);
    const end = new Date(mobility.returnDate);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return Math.max(1, diff);
}

export function useBudgetData() {
    const { mobility, mobilityError } = useMobility();
    const { destination, isLoading: destLoading, error: destError } = useDestination(mobility?.destinationId);

    const defaultMonths = useMemo(
        () => (mobility ? computeMonths(mobility) : 6),
        [mobility],
    );

    const error = mobilityError || !!destError;

    return { mobility, destination, defaultMonths, isLoading: destLoading && !mobilityError, error };
}
