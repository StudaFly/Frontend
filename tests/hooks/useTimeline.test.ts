import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTimeline } from '@/features/timeline/hooks/useTimeline';

describe('useTimeline', () => {
    describe('état initial', () => {
        it('retourne 4 périodes', () => {
            const { result } = renderHook(() => useTimeline());
            expect(result.current.periods).toHaveLength(4);
        });

        it('retourne 15 événements au total', () => {
            const { result } = renderHook(() => useTimeline());
            expect(result.current.totalEvents).toBe(15);
        });

        it("ouvre uniquement la première période par défaut", () => {
            const { result } = renderHook(() => useTimeline());
            expect(result.current.openPeriods.size).toBe(1);
            expect(result.current.openPeriods.has('six-months-before')).toBe(true);
        });

        it('groupe correctement les événements par période', () => {
            const { result } = renderHook(() => useTimeline());
            const { eventsByPeriod } = result.current;
            expect(eventsByPeriod['six-months-before']).toHaveLength(3);
            expect(eventsByPeriod['three-months-before']).toHaveLength(4);
            expect(eventsByPeriod['one-month-before']).toHaveLength(4);
            expect(eventsByPeriod['after-arrival']).toHaveLength(4);
        });
    });

    describe('togglePeriod', () => {
        it('ouvre une période fermée', () => {
            const { result } = renderHook(() => useTimeline());
            act(() => {
                result.current.togglePeriod('three-months-before');
            });
            expect(result.current.openPeriods.has('three-months-before')).toBe(true);
        });

        it('ferme une période ouverte', () => {
            const { result } = renderHook(() => useTimeline());
            act(() => {
                result.current.togglePeriod('six-months-before');
            });
            expect(result.current.openPeriods.has('six-months-before')).toBe(false);
        });

        it('peut ouvrir plusieurs périodes indépendamment', () => {
            const { result } = renderHook(() => useTimeline());
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
        it('ouvre toutes les 4 périodes', () => {
            const { result } = renderHook(() => useTimeline());
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
        it('ferme toutes les périodes', () => {
            const { result } = renderHook(() => useTimeline());
            act(() => {
                result.current.expandAll();
                result.current.collapseAll();
            });
            expect(result.current.openPeriods.size).toBe(0);
        });

        it("fonctionne même si aucune période n'est ouverte", () => {
            const { result } = renderHook(() => useTimeline());
            act(() => {
                result.current.collapseAll();
                result.current.collapseAll();
            });
            expect(result.current.openPeriods.size).toBe(0);
        });
    });
});
