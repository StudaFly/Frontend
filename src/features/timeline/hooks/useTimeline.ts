import { useState, useMemo, useEffect } from 'react';
import { getTimeline, TimelineTask } from '@/core/api/timeline';
import type { TimelineEventCategory, TimelineEvent, TimelinePeriod, TimelinePeriodId } from '../types/event';

const PERIODS: TimelinePeriod[] = [
    {
        id: 'six-months-before',
        label: '6 mois avant le départ',
        shortLabel: '-6 mois',
        description: "Les démarches à anticiper longtemps à l'avance",
        color: 'border-blue-400',
        bgColor: 'bg-blue-50',
        dotColor: 'bg-blue-400',
    },
    {
        id: 'three-months-before',
        label: '3 mois avant le départ',
        shortLabel: '-3 mois',
        description: 'Le cœur de la préparation administrative',
        color: 'border-indigo-400',
        bgColor: 'bg-indigo-50',
        dotColor: 'bg-indigo-400',
    },
    {
        id: 'one-month-before',
        label: '1 mois avant le départ',
        shortLabel: '-1 mois',
        description: "Les dernières vérifications avant l'aventure",
        color: 'border-purple-400',
        bgColor: 'bg-purple-50',
        dotColor: 'bg-purple-400',
    },
    {
        id: 'after-arrival',
        label: "Après l'arrivée",
        shortLabel: 'Arrivée',
        description: "Ce qu'il faut faire une fois sur place",
        color: 'border-green-400',
        bgColor: 'bg-green-50',
        dotColor: 'bg-green-400',
    },
];

const CATEGORY_ICON: Record<string, string> = {
    admin: 'FileText',
    finance: 'CreditCard',
    housing: 'Home',
    health: 'Heart',
    practical: 'Wrench',
};

function getPeriodId(deadline: string | undefined, departureDate: string | undefined): TimelinePeriodId {
    if (!deadline || !departureDate) return 'after-arrival';
    const dep = new Date(departureDate).getTime();
    const dl = new Date(deadline).getTime();
    const daysUntilDep = (dep - dl) / (1000 * 60 * 60 * 24);
    if (daysUntilDep > 180) return 'six-months-before';
    if (daysUntilDep > 90) return 'three-months-before';
    if (daysUntilDep > 0) return 'one-month-before';
    return 'after-arrival';
}

interface UseTimelineReturn {
    periods: TimelinePeriod[];
    openPeriods: Set<TimelinePeriodId>;
    eventsByPeriod: Record<TimelinePeriodId, TimelineEvent[]>;
    totalEvents: number;
    isLoading: boolean;
    error: string | null;
    togglePeriod: (id: TimelinePeriodId) => void;
    expandAll: () => void;
    collapseAll: () => void;
}

export function useTimeline(mobilityId?: string, departureDate?: string): UseTimelineReturn {
    const [tasks, setTasks] = useState<TimelineTask[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openPeriods, setOpenPeriods] = useState<Set<TimelinePeriodId>>(
        new Set(['six-months-before']),
    );

    useEffect(() => {
        if (!mobilityId) return;
        setIsLoading(true);
        setError(null);
        getTimeline(mobilityId)
            .then(({ data }) => {
                setTasks(data.data);
                if (data.data.length > 0) {
                    const firstPeriod = getPeriodId(data.data[0].deadline, departureDate);
                    setOpenPeriods(new Set([firstPeriod]));
                }
            })
            .catch((err) => setError(err.response?.data?.message ?? 'Erreur lors du chargement de la timeline'))
            .finally(() => setIsLoading(false));
    }, [mobilityId, departureDate]);

    const events = useMemo((): TimelineEvent[] =>
        tasks.map((task) => ({
            id: task.id,
            periodId: getPeriodId(task.deadline, departureDate),
            title: task.title,
            description: task.description ?? '',
            category: task.category as TimelineEventCategory,
            icon: CATEGORY_ICON[task.category] ?? 'Circle',
            isOptional: task.priority === 3,
            isCompleted: task.isCompleted,
        })),
        [tasks, departureDate],
    );

    const periods = useMemo(
        () => PERIODS.filter((p) => events.some((e) => e.periodId === p.id)),
        [events],
    );

    const eventsByPeriod = useMemo(() => {
        const map = {} as Record<TimelinePeriodId, TimelineEvent[]>;
        for (const period of PERIODS) {
            map[period.id] = events.filter((e) => e.periodId === period.id);
        }
        return map;
    }, [events]);

    const togglePeriod = (id: TimelinePeriodId) => {
        setOpenPeriods((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const expandAll = () => setOpenPeriods(new Set(periods.map((p) => p.id)));
    const collapseAll = () => setOpenPeriods(new Set());

    return {
        periods,
        openPeriods,
        eventsByPeriod,
        totalEvents: events.length,
        isLoading,
        error,
        togglePeriod,
        expandAll,
        collapseAll,
    };
}
