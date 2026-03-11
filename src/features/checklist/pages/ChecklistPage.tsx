import { useChecklist } from '../hooks/useChecklist';
import { CATEGORY_META } from '../data/tasks';
import { ChecklistHeader } from '../components/ChecklistHeader';
import { CategoryTabs } from '../components/CategoryTabs';
import { TaskList } from '../components/TaskList';
import { AddTaskFab } from '../components/AddTaskFab';
import { AddTaskModal } from '../components/AddTaskModal';

export default function ChecklistPage() {
    const {
        tasks,
        completedCount,
        totalCount,
        activeCategory,
        taskCountByCategory,
        isModalOpen,
        toggleTask,
        setActiveCategory,
        openModal,
        closeModal,
        addTask,
    } = useChecklist();

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50">
            {/* Hero full-width */}
            <ChecklistHeader total={totalCount} completed={completedCount} />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="flex flex-col gap-5">
                    {/* Category filter tabs */}
                    <CategoryTabs
                        categories={CATEGORY_META}
                        activeCategory={activeCategory}
                        taskCountByCategory={taskCountByCategory}
                        onSelect={setActiveCategory}
                    />

                    {/* Task list */}
                    <TaskList tasks={tasks} onToggle={toggleTask} />
                </div>
            </div>

            {/* Floating action button */}
            <AddTaskFab onClick={openModal} />

            {/* Add task modal */}
            <AddTaskModal isOpen={isModalOpen} onClose={closeModal} onAdd={addTask} />
        </div>
    );
}
