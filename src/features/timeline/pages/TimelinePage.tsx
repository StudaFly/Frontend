import { useTimeline } from '../hooks/useTimeline';
import { TimelineHeader } from '../components/TimelineHeader';
import { TimelinePeriodSection } from '../components/TimelinePeriodSection';
import { TimelineLegend } from '../components/TimelineLegend';
import { ExpandControls } from '../components/ExpandControls';

export default function TimelinePage() {
    const {
        periods,
        openPeriods,
        eventsByPeriod,
        totalEvents,
        togglePeriod,
        expandAll,
        collapseAll,
    } = useTimeline();

    const allExpanded = openPeriods.size === periods.length;

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50">
            <TimelineHeader totalEvents={totalEvents} />

            <div className="mx-auto max-w-3xl px-4 py-8">
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
            </div>
        </div>
    );
}
