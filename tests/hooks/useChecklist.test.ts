/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChecklist } from '@/features/checklist/hooks/useChecklist';
import { TASKS } from '@/features/checklist/data/tasks';

vi.mock('@/core/api/checklist', () => ({
    getTasks: vi.fn(),
    createTask: vi.fn(),
    completeTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
}));

import { getTasks, createTask, completeTask } from '@/core/api/checklist';

beforeEach(() => {
    vi.mocked(getTasks).mockResolvedValue({
        data: { data: TASKS.map((t) => ({ ...t })), message: 'ok' },
    } as any);
    vi.mocked(completeTask).mockResolvedValue({
        data: { data: TASKS[0], message: 'ok' },
    } as any);
    vi.mocked(createTask).mockImplementation((_mobilityId, data) =>
        Promise.resolve({
            data: {
                data: {
                    id: `new-${Date.now()}`,
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    deadline: data.deadline || undefined,
                    priority: data.priority,
                    isCompleted: false,
                    isCustom: true,
                },
                message: 'ok',
            },
        } as any),
    );
});

describe('useChecklist', () => {
    describe('état initial', () => {
        it('retourne 11 tâches au total', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            expect(result.current.allTasks).toHaveLength(11);
        });

        it('démarre avec 0 tâche complétée', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            expect(result.current.completedCount).toBe(0);
        });

        it('démarre sur la catégorie "all"', () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            expect(result.current.activeCategory).toBe('all');
        });

        it('la modale est fermée par défaut', () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            expect(result.current.isModalOpen).toBe(false);
        });

        it('retourne les compteurs par catégorie corrects', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            const counts = result.current.taskCountByCategory;
            expect(counts.all).toBe(11);
            expect(counts.admin).toBe(3);
            expect(counts.finance).toBe(2);
            expect(counts.health).toBe(2);
            expect(counts.housing).toBe(2);
            expect(counts.practical).toBe(2);
        });
    });

    describe('toggleTask', () => {
        it('marque une tâche comme complétée', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            act(() => {
                result.current.toggleTask('1');
            });
            expect(result.current.completedCount).toBe(1);
            expect(result.current.allTasks.find((t) => t.id === '1')?.isCompleted).toBe(true);
        });

        it('re-marque une tâche comme non complétée au second appel', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            act(() => {
                result.current.toggleTask('1');
                result.current.toggleTask('1');
            });
            expect(result.current.completedCount).toBe(0);
            expect(result.current.allTasks.find((t) => t.id === '1')?.isCompleted).toBe(false);
        });

        it("n'affecte pas les autres tâches", async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            act(() => {
                result.current.toggleTask('1');
            });
            const others = result.current.allTasks.filter((t) => t.id !== '1');
            expect(others.every((t) => !t.isCompleted)).toBe(true);
        });
    });

    describe('setActiveCategory', () => {
        it('filtre les tâches par catégorie admin', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            act(() => {
                result.current.setActiveCategory('admin');
            });
            expect(result.current.tasks).toHaveLength(3);
            expect(result.current.tasks.every((t) => t.category === 'admin')).toBe(true);
        });

        it('filtre les tâches par catégorie finance', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            act(() => {
                result.current.setActiveCategory('finance');
            });
            expect(result.current.tasks).toHaveLength(2);
            expect(result.current.tasks.every((t) => t.category === 'finance')).toBe(true);
        });

        it('revient à toutes les tâches quand on sélectionne "all"', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            act(() => {
                result.current.setActiveCategory('admin');
                result.current.setActiveCategory('all');
            });
            expect(result.current.tasks).toHaveLength(11);
        });

        it("ne modifie pas le totalCount (compte sur toutes les tâches)", async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            act(() => {
                result.current.setActiveCategory('admin');
            });
            expect(result.current.totalCount).toBe(11);
        });
    });

    describe('addTask', () => {
        it('ajoute une nouvelle tâche', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            await act(async () => {
                result.current.addTask({
                    title: 'Nouvelle tâche test',
                    description: 'Description test',
                    category: 'finance',
                    deadline: '',
                    priority: 2,
                });
            });
            expect(result.current.totalCount).toBe(12);
        });

        it('la nouvelle tâche a les bonnes propriétés', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            await act(async () => {
                result.current.addTask({
                    title: 'Ouvrir un compte',
                    description: 'Desc',
                    category: 'finance',
                    deadline: '2025-09-01',
                    priority: 1,
                });
            });
            const newTask = result.current.allTasks.find((t) => t.title === 'Ouvrir un compte');
            expect(newTask).toBeDefined();
            expect(newTask?.isCompleted).toBe(false);
            expect(newTask?.isCustom).toBe(true);
            expect(newTask?.category).toBe('finance');
            expect(newTask?.priority).toBe(1);
        });

        it('la nouvelle tâche apparaît dans le filtre de sa catégorie', async () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            await waitFor(() => expect(result.current.totalCount).toBe(11));
            await act(async () => {
                result.current.addTask({
                    title: 'Tâche santé',
                    description: '',
                    category: 'health',
                    deadline: '',
                    priority: 3,
                });
            });
            act(() => {
                result.current.setActiveCategory('health');
            });
            expect(result.current.tasks).toHaveLength(3);
        });
    });

    describe('modal', () => {
        it('openModal passe isModalOpen à true', () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            act(() => {
                result.current.openModal();
            });
            expect(result.current.isModalOpen).toBe(true);
        });

        it('closeModal passe isModalOpen à false', () => {
            const { result } = renderHook(() => useChecklist('test-id'));
            act(() => {
                result.current.openModal();
                result.current.closeModal();
            });
            expect(result.current.isModalOpen).toBe(false);
        });
    });
});
