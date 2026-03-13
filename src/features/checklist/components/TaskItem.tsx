import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Trash2 } from 'lucide-react';
import { CATEGORY_ICON_MAP } from '../constants';
import { TaskCheckbox } from './TaskCheckbox';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskDeadlineBadge } from './TaskDeadlineBadge';
import { TaskDescription } from './TaskDescription';
import type { Task } from '../types/task';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const Icon = CATEGORY_ICON_MAP[task.category];

    const title = t(`checklist.tasks.t_${task.id}.title`, { defaultValue: task.title });
    const description = task.isCustom
        ? (task.description ?? '')
        : t(`checklist.tasks.t_${task.id}.description`, { defaultValue: task.description ?? '' });

    const hasDescription = task.isCustom ? !!task.description : true;

    const borderClass = task.isCompleted
        ? 'border-l-4 border-l-secondary'
        : 'border-l-4 border-l-primary-dark';

    return (
        <div
            className={`group rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-opacity ${borderClass} ${task.isCompleted ? 'opacity-70' : ''}`}
        >
            {/* Main row */}
            <div
                role={hasDescription ? 'button' : undefined}
                tabIndex={hasDescription ? 0 : undefined}
                onClick={() => hasDescription && setIsOpen((o) => !o)}
                onKeyDown={(e) => {
                    if (hasDescription && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setIsOpen((o) => !o);
                    }
                }}
                className={`flex items-center gap-4 px-5 py-4 ${hasDescription ? 'cursor-pointer select-none' : ''}`}
            >
                <TaskCheckbox
                    isCompleted={task.isCompleted}
                    onToggle={() => onToggle(task.id)}
                />

                <Icon size={20} className="flex-shrink-0 text-primary-dark" />

                <span
                    className={`flex-1 font-medium transition-colors ${
                        task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}
                >
                    {title}
                </span>

                {task.deadline && !task.isCompleted && (
                    <TaskDeadlineBadge deadline={task.deadline} />
                )}

                <TaskPriorityBadge priority={task.priority} />

                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                    className="ml-1 flex-shrink-0 rounded-lg p-1 text-gray-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    aria-label="Supprimer la tâche"
                >
                    <Trash2 size={15} />
                </button>

                {hasDescription && (
                    <ChevronDown
                        size={16}
                        className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                )}
            </div>

            {/* Expandable description */}
            {hasDescription && isOpen && <TaskDescription description={description} />}
        </div>
    );
}
