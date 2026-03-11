import { useState, useMemo } from 'react';
import { TASKS, CATEGORY_META } from '../data/tasks';
import type { Task, TaskCategory, NewTaskFormData } from '../types/task';

interface UseChecklistReturn {
    tasks: Task[];
    allTasks: Task[];
    activeCategory: TaskCategory | 'all';
    completedCount: number;
    totalCount: number;
    taskCountByCategory: Record<TaskCategory | 'all', number>;
    isModalOpen: boolean;
    toggleTask: (id: string) => void;
    setActiveCategory: (cat: TaskCategory | 'all') => void;
    openModal: () => void;
    closeModal: () => void;
    addTask: (data: NewTaskFormData) => void;
}

export function useChecklist(): UseChecklistReturn {
    const [allTasks, setAllTasks] = useState<Task[]>(TASKS);
    const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    };

    const addTask = (data: NewTaskFormData) => {
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
        toggleTask,
        setActiveCategory,
        openModal,
        closeModal,
        addTask,
    };
}
