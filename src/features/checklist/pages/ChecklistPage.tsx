import { useState, useEffect } from 'react';
import { useChecklist } from '../hooks/useChecklist';
import { CATEGORY_META } from '../data/tasks';
import { ChecklistHeader } from '../components/ChecklistHeader';
import { CategoryTabs } from '../components/CategoryTabs';
import { TaskList } from '../components/TaskList';
import { AddTaskFab } from '../components/AddTaskFab';
import { AddTaskModal } from '../components/AddTaskModal';
import { getMobilities } from '@/core/api/mobilities';

export default function ChecklistPage() {
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
        return (
            <div className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-gray-50">
                <p className="text-gray-500">Aucune mobilité configurée — utilise l'app mobile StudaFly pour commencer.</p>
            </div>
        );
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
                            categories={CATEGORY_META}
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
