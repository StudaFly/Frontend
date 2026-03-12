import { useState, useEffect } from 'react';
import { getMobilities, type Mobility } from '@/core/api/mobilities';

interface UseMobilityReturn {
    mobility: Mobility | undefined;
    mobilityError: boolean;
}

export function useMobility(): UseMobilityReturn {
    const [mobility, setMobility] = useState<Mobility | undefined>();
    const [mobilityError, setMobilityError] = useState(false);

    useEffect(() => {
        getMobilities()
            .then(({ data }) => {
                if (data.data.length > 0) {
                    setMobility(data.data[0]);
                } else {
                    setMobilityError(true);
                }
            })
            .catch(() => setMobilityError(true));
    }, []);

    return { mobility, mobilityError };
}
