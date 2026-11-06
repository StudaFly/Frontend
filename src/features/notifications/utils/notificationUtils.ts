import type { AppNotification } from '@/core/api/notifications';

/** Page that a notification opens when clicked, or null if it is informational only. */
export function notificationLink(notification: AppNotification): string | null {
    switch (notification.type) {
        case 'task_due_soon':
        case 'task_due_today':
        case 'task_overdue':
            return '/checklist';
        case 'invitation_accepted':
            return '/org/invitations';
        default:
            return null;
    }
}

/** "à l'instant", "il y a 5 min", "il y a 3 h", "il y a 2 j", then the date. */
export function formatRelativeTime(isoDate: string, locale = 'fr', now: Date = new Date()): string {
    const seconds = Math.round((new Date(isoDate).getTime() - now.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' });
    const abs = Math.abs(seconds);
    if (abs < 60) return rtf.format(0, 'second');
    if (abs < 3600) return rtf.format(Math.round(seconds / 60), 'minute');
    if (abs < 86_400) return rtf.format(Math.round(seconds / 3600), 'hour');
    if (abs < 7 * 86_400) return rtf.format(Math.round(seconds / 86_400), 'day');
    return new Date(isoDate).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

/** Badge text: the count, capped at "9+". */
export function formatBadge(count: number): string {
    return count > 9 ? '9+' : String(count);
}
