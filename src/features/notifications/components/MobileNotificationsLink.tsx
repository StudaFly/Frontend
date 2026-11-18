import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '../hooks/useNotifications';
import { formatBadge } from '../utils/notificationUtils';

export function MobileNotificationsLink({ onClick }: { onClick: () => void }) {
    const { t } = useTranslation();
    const { data: unread = 0 } = useUnreadCount();

    return (
        <Link
            to="/notifications"
            onClick={onClick}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 font-sans text-base font-medium text-primary-dark hover:bg-slate-50"
        >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {t('notifications.title', { defaultValue: 'Notifications' })}
            {unread > 0 && (
                <span className="rounded-full bg-danger px-2 text-xs font-bold text-white">{formatBadge(unread)}</span>
            )}
        </Link>
    );
}
