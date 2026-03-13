import { useTranslation } from 'react-i18next';
import { ClipboardCheck } from 'lucide-react';
import { TaskItem } from './TaskItem';
import type { Task } from '../types/task';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
    const { t } = useTranslation();

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm ring-1 ring-slate-100">
                <ClipboardCheck size={48} className="mb-4 text-gray-300" />
                <p className="font-medium text-gray-500">{t('checklist.empty.title')}</p>
                <p className="mt-1 text-sm text-gray-400">{t('checklist.empty.subtitle')}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
        </div>
    );
}
