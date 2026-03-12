import { useState, useMemo, useEffect } from 'react';
import { CATEGORY_META } from '../data/tasks';
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
            .catch((err) => setError(err.response?.data?.message ?? 'Erreur lors du chargement des tâches'))
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
        const counts = {} as Record<TaskCategory | 'all', number>;
        counts['all'] = allTasks.length;
        for (const meta of CATEGORY_META) {
            if (meta.id !== 'all') {
                counts[meta.id] = allTasks.filter((t) => t.category === meta.id).length;
            }
        }
        return counts;
    }, [allTasks]);

    const toggleTask = (id: string) => {
        setAllTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
        );
        if (mobilityId) {
            completeTask(id).catch(() => {
                setAllTasks((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
                );
            });
        }
    };

    const addTask = (data: NewTaskFormData) => {
        if (mobilityId) {
            createTask(mobilityId, data)
                .then(({ data: res }) => setAllTasks((prev) => [...prev, res.data]))
                .catch((err) => setError(err.response?.data?.message ?? 'Erreur lors de la création de la tâche'));
        } else {
            const newTask: Task = {
                id: crypto.randomUUID(),
                title: data.title,
                description: data.description || undefined,
                category: data.category,
                deadline: data.deadline || undefined,
                priority: data.priority,
                isCompleted: false,
                isCustom: true,
            };
            setAllTasks((prev) => [...prev, newTask]);
        }
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
