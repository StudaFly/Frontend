/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTimeline } from '@/features/timeline/hooks/useTimeline';
import type { TimelineTask } from '@/core/api/timeline';

vi.mock('@/core/api/timeline', () => ({
    getTimeline: vi.fn(),
}));

import { getTimeline } from '@/core/api/timeline';

// Departure: 2025-09-01
// six-months-before  : dep - deadline > 180 days  → deadline before ~2025-03-05
// three-months-before: 90 < dep - deadline ≤ 180  → deadline ~2025-03-05..2025-06-03
// one-month-before   : 0  < dep - deadline ≤ 90   → deadline ~2025-06-04..2025-08-31
// after-arrival      : no deadline
const DEPARTURE_DATE = '2025-09-01';

// API-shaped fixtures (missing deadline → null, daysUntilDeadline computed by the backend)
const RAW_TIMELINE_TASKS: (Omit<TimelineTask, 'deadline' | 'daysUntilDeadline'> & { deadline?: string })[] = [
    // six-months-before (3 events)
    { id: 'e1', mobilityId: 'test-id', title: 'Dépôt du dossier Erasmus / bourse', description: 'Desc', category: 'admin', deadline: '2025-01-15', isCompleted: false, priority: 1 },
    { id: 'e2', mobilityId: 'test-id', title: 'Recherche de logement', description: 'Desc', category: 'housing', deadline: '2025-01-20', isCompleted: false, priority: 1 },
    { id: 'e3', mobilityId: 'test-id', title: 'Planification du budget global', description: 'Desc', category: 'finance', deadline: '2025-02-01', isCompleted: false, priority: 2 },
    // three-months-before (4 events)
    { id: 'e4', mobilityId: 'test-id', title: 'Demande de visa', description: 'Desc', category: 'admin', deadline: '2025-04-01', isCompleted: false, priority: 1 },
    { id: 'e5', mobilityId: 'test-id', title: 'Signature du contrat de logement', description: 'Desc', category: 'housing', deadline: '2025-04-15', isCompleted: false, priority: 1 },
    { id: 'e6', mobilityId: 'test-id', title: 'Demande CEAM', description: 'Desc', category: 'health', deadline: '2025-05-01', isCompleted: false, priority: 1 },
    { id: 'e7', mobilityId: 'test-id', title: 'Ouverture compte bancaire international', description: 'Desc', category: 'finance', deadline: '2025-05-15', isCompleted: false, priority: 2 },
    // one-month-before (4 events)
    { id: 'e8', mobilityId: 'test-id', title: "Achat du billet d'avion", description: 'Desc', category: 'practical', deadline: '2025-07-01', isCompleted: false, priority: 2 },
    { id: 'e9', mobilityId: 'test-id', title: 'Stock de médicaments essentiels', description: 'Desc', category: 'health', deadline: '2025-07-15', isCompleted: false, priority: 2 },
    { id: 'e10', mobilityId: 'test-id', title: 'Souscription assurance voyage', description: 'Desc', category: 'health', deadline: '2025-08-01', isCompleted: false, priority: 3 },
    { id: 'e11', mobilityId: 'test-id', title: 'Préparation des valises', description: 'Desc', category: 'practical', deadline: '2025-08-15', isCompleted: false, priority: 2 },
    // after-arrival (4 events, no deadline)
    { id: 'e12', mobilityId: 'test-id', title: "Inscription à l'université d'accueil", description: 'Desc', category: 'admin', isCompleted: false, priority: 1 },
    { id: 'e13', mobilityId: 'test-id', title: 'Achat SIM locale', description: 'Desc', category: 'practical', isCompleted: false, priority: 2 },
    { id: 'e14', mobilityId: 'test-id', title: 'Inventaire du logement', description: 'Desc', category: 'housing', isCompleted: false, priority: 3 },
    { id: 'e15', mobilityId: 'test-id', title: 'Découverte du quartier et du campus', description: 'Desc', category: 'practical', isCompleted: false, priority: 3 },
];
const MOCK_TIMELINE_TASKS: TimelineTask[] = RAW_TIMELINE_TASKS.map((task) => ({
    ...task,
    deadline: task.deadline ?? null,
    daysUntilDeadline: null,
}));

beforeEach(() => {
    vi.mocked(getTimeline).mockResolvedValue({
        data: { data: [...MOCK_TIMELINE_TASKS], message: 'ok' },
    } as any);
});

describe('useTimeline', () => {
    describe('initial state', () => {
        it('returns 4 periods', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.periods).toHaveLength(4));
        });

        it('returns 15 events in total', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.totalEvents).toBe(15));
        });

        it('opens only the first period by default', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.totalEvents).toBe(15));
            expect(result.current.openPeriods.size).toBe(1);
            expect(result.current.openPeriods.has('six-months-before')).toBe(true);
        });

        it('groups events by period', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.totalEvents).toBe(15));
            const { eventsByPeriod } = result.current;
            expect(eventsByPeriod['six-months-before']).toHaveLength(3);
            expect(eventsByPeriod['three-months-before']).toHaveLength(4);
            expect(eventsByPeriod['one-month-before']).toHaveLength(4);
            expect(eventsByPeriod['after-arrival']).toHaveLength(4);
        });
    });

    describe('togglePeriod', () => {
        it('opens a closed period', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.totalEvents).toBe(15));
            act(() => {
                result.current.togglePeriod('three-months-before');
            });
            expect(result.current.openPeriods.has('three-months-before')).toBe(true);
        });

        it('closes an open period', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.totalEvents).toBe(15));
            act(() => {
                result.current.togglePeriod('six-months-before');
            });
            expect(result.current.openPeriods.has('six-months-before')).toBe(false);
        });

        it('can open several periods independently', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.totalEvents).toBe(15));
            act(() => {
                result.current.togglePeriod('three-months-before');
                result.current.togglePeriod('one-month-before');
            });
            expect(result.current.openPeriods.size).toBe(3);
            expect(result.current.openPeriods.has('six-months-before')).toBe(true);
            expect(result.current.openPeriods.has('three-months-before')).toBe(true);
            expect(result.current.openPeriods.has('one-month-before')).toBe(true);
        });
    });

    describe('expandAll', () => {
        it('opens all 4 periods', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.periods).toHaveLength(4));
            act(() => {
                result.current.expandAll();
            });
            expect(result.current.openPeriods.size).toBe(4);
            expect(result.current.openPeriods.has('six-months-before')).toBe(true);
            expect(result.current.openPeriods.has('three-months-before')).toBe(true);
            expect(result.current.openPeriods.has('one-month-before')).toBe(true);
            expect(result.current.openPeriods.has('after-arrival')).toBe(true);
        });
    });

    describe('collapseAll', () => {
        it('closes every period', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.periods).toHaveLength(4));
            act(() => {
                result.current.expandAll();
                result.current.collapseAll();
            });
            expect(result.current.openPeriods.size).toBe(0);
        });

        it('works even when no period is open', async () => {
            const { result } = renderHook(() => useTimeline('test-id', DEPARTURE_DATE));
            await waitFor(() => expect(result.current.periods).toHaveLength(4));
            act(() => {
                result.current.collapseAll();
                result.current.collapseAll();
            });
            expect(result.current.openPeriods.size).toBe(0);
        });
    });
});
