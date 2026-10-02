import { useReference } from '@/core/hooks/useReference';
import { PRIORITY_CONFIG } from '../constants';
import type { TaskPriority } from '../types/task';

interface TaskPriorityBadgeProps {
    priority: TaskPriority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
    const { priorityLabel } = useReference();
    const config = PRIORITY_CONFIG[priority];

    return (
        <span
            className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}
        >
            {priorityLabel(priority)}
        </span>
    );
}
