import { useState, useEffect } from 'react';
import { getDestination, type Destination } from '@/core/api/destinations';

export function useDestination(id: string | undefined) {
    const [destination, setDestination] = useState<Destination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        getDestination(id)
            .then(({ data }) => setDestination(data.data))
            .catch(() => setError('Destination introuvable.'))
            .finally(() => setIsLoading(false));
    }, [id]);

    return { destination, isLoading, error };
}
