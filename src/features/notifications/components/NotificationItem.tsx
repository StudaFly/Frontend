import { useTranslation } from 'react-i18next';
import { AlarmClock, AlertTriangle, Bell, CalendarClock, School, Trash2, UserCheck } from 'lucide-react';
import type { AppNotification } from '@/core/api/notifications';
import { formatRelativeTime } from '../utils/notificationUtils';

const ICONS: Record<string, typeof Bell> = {
    task_due_soon: CalendarClock,
    task_due_today: AlarmClock,
    task_overdue: AlertTriangle,
    organization_invitation: School,
    invitation_accepted: UserCheck,
};

interface NotificationItemProps {
    notification: AppNotification;
    onOpen: (notification: AppNotification) => void;
    onDelete?: (id: string) => void;
    compact?: boolean;
}

export function NotificationItem({ notification, onOpen, onDelete, compact = false }: NotificationItemProps) {
    const { t, i18n } = useTranslation();
    const Icon = ICONS[notification.type] ?? Bell;
    const isOverdue = notification.type === 'task_overdue';

    return (
        <li
            className={`group flex items-start gap-3 ${compact ? 'px-4 py-3' : 'rounded-xl border border-slate-100 bg-white p-4 shadow-sm'} ${
                notification.isRead ? '' : 'bg-secondary/10'
            }`}
        >
            <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isOverdue ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary-dark'
                }`}
                aria-hidden="true"
            >
                <Icon className="h-4 w-4" />
            </span>

            <button
                type="button"
                onClick={() => onOpen(notification)}
                className="min-w-0 flex-1 text-left focus:outline-none"
            >
                <p className={`text-sm text-gray-900 ${notification.isRead ? 'font-medium' : 'font-bold'}`}>
                    {notification.title}
                </p>
                {notification.body && (
                    <p className={`mt-0.5 text-sm text-gray-600 ${compact ? 'line-clamp-2' : ''}`}>{notification.body}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(notification.createdAt, i18n.language)}</p>
            </button>

            {!notification.isRead && (
                <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary"
                    aria-label={t('notifications.unread', { defaultValue: 'Non lue' })}
                />
            )}
            {onDelete && (
                <button
                    type="button"
                    onClick={() => onDelete(notification.id)}
                    className="shrink-0 rounded p-1 text-gray-300 hover:bg-red-50 hover:text-danger"
                    aria-label={t('notifications.delete', { defaultValue: 'Supprimer' })}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </li>
    );
}
