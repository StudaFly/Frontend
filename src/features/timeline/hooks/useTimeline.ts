import { useState, useMemo } from 'react';
import { TIMELINE_PERIODS, TIMELINE_EVENTS } from '../data/events';
import type { TimelinePeriodId, TimelineEvent } from '../types/event';

interface UseTimelineReturn {
    periods: typeof TIMELINE_PERIODS;
    openPeriods: Set<TimelinePeriodId>;
    eventsByPeriod: Record<TimelinePeriodId, TimelineEvent[]>;
    totalEvents: number;
    togglePeriod: (id: TimelinePeriodId) => void;
    expandAll: () => void;
    collapseAll: () => void;
}

export function useTimeline(): UseTimelineReturn {
    const [openPeriods, setOpenPeriods] = useState<Set<TimelinePeriodId>>(
        new Set(['six-months-before']),
    );

    const eventsByPeriod = useMemo(() => {
        const map = {} as Record<TimelinePeriodId, TimelineEvent[]>;
        for (const period of TIMELINE_PERIODS) {
            map[period.id] = TIMELINE_EVENTS.filter((e) => e.periodId === period.id);
        }
        return map;
    }, []);

    const togglePeriod = (id: TimelinePeriodId) => {
        setOpenPeriods((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandAll = () => {
        setOpenPeriods(new Set(TIMELINE_PERIODS.map((p) => p.id)));
    };

    const collapseAll = () => {
        setOpenPeriods(new Set());
    };

    return {
        periods: TIMELINE_PERIODS,
        openPeriods,
        eventsByPeriod,
        totalEvents: TIMELINE_EVENTS.length,
        togglePeriod,
        expandAll,
        collapseAll,
    };
}
