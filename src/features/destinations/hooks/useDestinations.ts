import { useState, useEffect, useCallback } from 'react';
import { getDestinations, type Destination } from '@/core/api/destinations';

export function useDestinations() {
    const [searchTerm, setSearchTerm] = useState('');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDestinations = useCallback((query: string) => {
        setIsLoading(true);
        setError(null);
        getDestinations(query || undefined)
            .then(({ data }) => setDestinations(data.data ?? []))
            .catch(() => setError('Impossible de charger les destinations.'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchDestinations(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm, fetchDestinations]);

    return { searchTerm, setSearchTerm, destinations, isLoading, error };
}
