import { useTranslation } from 'react-i18next';
import { PRIORITY_CONFIG } from '../constants';
import type { TaskPriority } from '../types/task';

interface TaskPriorityBadgeProps {
    priority: TaskPriority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
    const { t } = useTranslation();
    const config = PRIORITY_CONFIG[priority];

    return (
        <span
            className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}
        >
            {t(config.labelKey)}
        </span>
    );
}
