import { useState, useMemo, useEffect } from 'react';
import { getApiErrorMessage } from '@/core/api/errors';
import { getTasks, createTask, completeTask } from '@/core/api/checklist';
import type { Task, TaskCategory, NewTaskFormData } from '../types/task';

interface UseChecklistReturn {
    tasks: Task[];
    allTasks: Task[];
    activeCategory: TaskCategory | 'all';
    completedCount: number;
    totalCount: number;
    taskCountByCategory: Record<TaskCategory | 'all', number>;
    isModalOpen: boolean;
    isLoading: boolean;
    error: string | null;
    toggleTask: (id: string) => void;
    setActiveCategory: (cat: TaskCategory | 'all') => void;
    openModal: () => void;
    closeModal: () => void;
    addTask: (data: NewTaskFormData) => void;
}

export function useChecklist(mobilityId?: string): UseChecklistReturn {
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!mobilityId) return;
        setIsLoading(true);
        setError(null);
        getTasks(mobilityId)
            .then(({ data }) => setAllTasks(data.data))
            .catch((err) => setError(getApiErrorMessage(err, 'Erreur lors du chargement des tâches')))
            .finally(() => setIsLoading(false));
    }, [mobilityId]);

    const tasks = useMemo(
        () =>
            activeCategory === 'all'
                ? allTasks
                : allTasks.filter((t) => t.category === activeCategory),
        [allTasks, activeCategory],
    );

    const completedCount = useMemo(
        () => allTasks.filter((t) => t.isCompleted).length,
        [allTasks],
    );

    const totalCount = allTasks.length;

    const taskCountByCategory = useMemo(() => {
        const counts = { all: allTasks.length } as Record<TaskCategory | 'all', number>;
        for (const task of allTasks) {
            counts[task.category] = (counts[task.category] ?? 0) + 1;
        }
        return counts;
    }, [allTasks]);

    const toggleTask = (id: string) => {
        if (!mobilityId) return;
        // Optimistic toggle, then the server's version of the task wins.
        setAllTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
        );
        completeTask(id)
            .then(({ data: res }) => setAllTasks((prev) => prev.map((t) => (t.id === id ? res.data : t))))
            .catch((err) => {
                setAllTasks((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
                );
                setError(getApiErrorMessage(err, 'Erreur lors de la mise à jour de la tâche'));
            });
    };

    const addTask = (data: NewTaskFormData) => {
        if (!mobilityId) return;
        createTask(mobilityId, data)
            .then(({ data: res }) => setAllTasks((prev) => [...prev, res.data]))
            .catch((err) => setError(getApiErrorMessage(err, 'Erreur lors de la création de la tâche')));
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return {
        tasks,
        allTasks,
        activeCategory,
        completedCount,
        totalCount,
        taskCountByCategory,
        isModalOpen,
        isLoading,
        error,
        toggleTask,
        setActiveCategory,
        openModal,
        closeModal,
        addTask,
    };
}
