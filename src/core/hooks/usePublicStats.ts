import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/core/api/reference';

/** Real figures computed by the backend (GET /stats). */
export function usePublicStats() {
    return useQuery({
        queryKey: ['public-stats'],
        queryFn: async () => (await getStats()).data.data,
        staleTime: 1000 * 60 * 10,
    });
}
