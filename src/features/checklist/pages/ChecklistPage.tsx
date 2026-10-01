import { useState, useEffect } from 'react';
import { useChecklist } from '../hooks/useChecklist';
import { useReference } from '@/core/hooks/useReference';
import type { CategoryMeta } from '../types/task';
import { ChecklistHeader } from '../components/ChecklistHeader';
import { CategoryTabs } from '../components/CategoryTabs';
import { TaskList } from '../components/TaskList';
import { AddTaskFab } from '../components/AddTaskFab';
import { AddTaskModal } from '../components/AddTaskModal';
import { getMobilities } from '@/core/api/mobilities';
import { NoMobilityState } from '@/features/dashboard/components/NoMobilityState';

export default function ChecklistPage() {
    const { taskCategories } = useReference();
    const categories: CategoryMeta[] = [
        { id: 'all', label: 'Toutes' },
        ...taskCategories.map((c) => ({ id: c.key as CategoryMeta['id'], label: c.label })),
    ];
    const [mobilityId, setMobilityId] = useState<string | undefined>();
    const [mobilityError, setMobilityError] = useState(false);

    useEffect(() => {
        getMobilities()
            .then(({ data }) => {
                if (data.data.length > 0) {
                    setMobilityId(data.data[0].id);
                } else {
                    setMobilityError(true);
                }
            })
            .catch(() => setMobilityError(true));
    }, []);

    const {
        tasks,
        completedCount,
        totalCount,
        activeCategory,
        taskCountByCategory,
        isModalOpen,
        isLoading,
        error,
        toggleTask,
        setActiveCategory,
        openModal,
        closeModal,
        addTask,
    } = useChecklist(mobilityId);

    if (mobilityError) {
        return <NoMobilityState message="Configure ta mobilité pour générer ta checklist personnalisée." />;
    }

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50">
            <ChecklistHeader total={totalCount} completed={completedCount} />

            <div className="mx-auto max-w-3xl px-4 py-8">
                {isLoading && (
                    <p className="text-center text-gray-400">Chargement des tâches…</p>
                )}
                {error && (
                    <p className="text-center text-red-500">{error}</p>
                )}
                {!isLoading && !error && (
                    <div className="flex flex-col gap-5">
                        <CategoryTabs
                            categories={categories}
                            activeCategory={activeCategory}
                            taskCountByCategory={taskCountByCategory}
                            onSelect={setActiveCategory}
                        />
                        <TaskList tasks={tasks} onToggle={toggleTask} />
                    </div>
                )}
            </div>

            <AddTaskFab onClick={openModal} />
            <AddTaskModal isOpen={isModalOpen} onClose={closeModal} onAdd={addTask} />
        </div>
    );
}
