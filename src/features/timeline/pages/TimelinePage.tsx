import { useState, useEffect } from 'react';
import { useTimeline } from '../hooks/useTimeline';
import { TimelineHeader } from '../components/TimelineHeader';
import { TimelinePeriodSection } from '../components/TimelinePeriodSection';
import { TimelineLegend } from '../components/TimelineLegend';
import { ExpandControls } from '../components/ExpandControls';
import { getMobilities, Mobility } from '@/core/api/mobilities';

export default function TimelinePage() {
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

    const {
        periods,
        openPeriods,
        eventsByPeriod,
        totalEvents,
        isLoading,
        error,
        togglePeriod,
        expandAll,
        collapseAll,
    } = useTimeline(mobility?.id, mobility?.departureDate);

    const allExpanded = openPeriods.size === periods.length;

    if (mobilityError) {
        return (
            <div className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-gray-50">
                <p className="text-gray-500">Aucune mobilité configurée — utilise l'app mobile StudaFly pour commencer.</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50">
            <TimelineHeader totalEvents={totalEvents} />

            <div className="mx-auto max-w-3xl px-4 py-8">
                {isLoading && (
                    <p className="text-center text-gray-400">Chargement de la timeline…</p>
                )}
                {error && (
                    <p className="text-center text-red-500">{error}</p>
                )}
                {!isLoading && !error && periods.length > 0 && (
                    <div className="flex flex-col gap-5">
                        <ExpandControls
                            openCount={openPeriods.size}
                            totalCount={periods.length}
                            allExpanded={allExpanded}
                            onExpandAll={expandAll}
                            onCollapseAll={collapseAll}
                        />

                        {periods.map((period) => (
                            <TimelinePeriodSection
                                key={period.id}
                                period={period}
                                events={eventsByPeriod[period.id]}
                                isOpen={openPeriods.has(period.id)}
                                onToggle={() => togglePeriod(period.id)}
                            />
                        ))}

                        <TimelineLegend />
                    </div>
                )}
                {!isLoading && !error && periods.length === 0 && mobility && (
                    <p className="text-center text-gray-400">Aucune tâche dans la timeline pour le moment.</p>
                )}
            </div>
        </div>
    );
}
