import { useChecklist } from '../hooks/useChecklist';
import { CATEGORY_META } from '../data/tasks';
import { ChecklistHeader } from '../components/ChecklistHeader';
import { CategoryTabs } from '../components/CategoryTabs';
import { TaskList } from '../components/TaskList';
import { AddTaskFab } from '../components/AddTaskFab';
import { AddTaskModal } from '../components/AddTaskModal';
import { useMobility } from '@/core/hooks/useMobility';
import { NoMobilityState } from '@/components/shared/NoMobilityState';

export default function ChecklistPage() {
    const { mobility, mobilityError } = useMobility();

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
        removeTask,
        setActiveCategory,
        openModal,
        closeModal,
        addTask,
    } = useChecklist(mobility?.id);

    if (mobilityError) return <NoMobilityState />;

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
                        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={removeTask} />
                    </div>
                )}
            </div>

            <AddTaskFab onClick={openModal} />
            <AddTaskModal isOpen={isModalOpen} onClose={closeModal} onAdd={addTask} />
        </div>
    );
}
