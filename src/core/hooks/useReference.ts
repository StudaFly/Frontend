import { useQuery } from '@tanstack/react-query';
import { getReference, type ReferenceData } from '@/core/api/reference';

const EMPTY: ReferenceData = { mobilityTypes: [], taskCategories: [], taskPriorities: [], avatarEmojis: [] };

/** Backend reference data (labels, choices). Loaded once per session. */
export function useReference() {
    const query = useQuery({
        queryKey: ['reference'],
        queryFn: async () => (await getReference()).data.data,
        staleTime: Infinity,
        gcTime: Infinity,
    });
    const data = query.data ?? EMPTY;

    const find = <T extends { key: string }>(list: T[], key: string) => list.find((item) => item.key === key);

    return {
        ...data,
        isLoading: query.isLoading,
        isError: query.isError,
        categoryLabel: (key: string) => find(data.taskCategories, key)?.label ?? key,
        mobilityTypeLabel: (key: string) => find(data.mobilityTypes, key)?.label ?? key,
        priorityLabel: (value: number) => data.taskPriorities.find((p) => p.value === value)?.label ?? String(value),
    };
}
