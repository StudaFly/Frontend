import { useQuery } from '@tanstack/react-query';
import { getMobilities } from '@/core/api/mobilities';
import { getDestination } from '@/core/api/destinations';

export const MOBILITIES_QUERY_KEY = ['mobilities'] as const;

/** The user's current mobility (most recent) and its destination. */
export function useActiveMobility() {
    const mobilities = useQuery({
        queryKey: MOBILITIES_QUERY_KEY,
        queryFn: async () => (await getMobilities()).data.data,
    });
    const mobility = mobilities.data?.[0];

    const destination = useQuery({
        queryKey: ['destination', mobility?.destinationId],
        queryFn: async () => (await getDestination(mobility!.destinationId)).data.data,
        enabled: !!mobility,
        staleTime: Infinity,
    });

    return {
        mobility,
        destination: destination.data,
        isLoading: mobilities.isLoading,
        isError: mobilities.isError,
        error: mobilities.error,
        hasNoMobility: mobilities.isSuccess && !mobility,
        refetch: mobilities.refetch,
    };
}
