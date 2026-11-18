import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { useNotificationActions, useNotifications, useUnreadCount } from '../hooks/useNotifications';
import { useOpenNotification } from '../hooks/useOpenNotification';
import { NotificationItem } from './NotificationItem';
import { formatBadge } from '../utils/notificationUtils';

const PREVIEW_SIZE = 5;

interface NotificationBellProps {
    /** Full notifications page of the current space (student or school staff). */
    allPath?: string;
}

export function NotificationBell({ allPath = '/notifications' }: NotificationBellProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { data: unread = 0 } = useUnreadCount();
    const list = useNotifications({ limit: PREVIEW_SIZE });
    const { markAllRead, isMarkingAll } = useNotificationActions();
    const open = useOpenNotification(() => setIsOpen(false));

    useEffect(() => {
        if (!isOpen) return;
        const close = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        const onEscape = (event: KeyboardEvent) => event.key === 'Escape' && setIsOpen(false);
        document.addEventListener('mousedown', close);
        document.addEventListener('keydown', onEscape);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('keydown', onEscape);
        };
    }, [isOpen]);

    const label = unread
        ? t('notifications.bell_label_unread', { count: unread, defaultValue: `Notifications (${unread} non lues)` })
        : t('notifications.title', { defaultValue: 'Notifications' });

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={label}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-primary-dark transition-colors hover:bg-slate-100"
            >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {unread > 0 && (
                    <span
                        data-testid="notification-badge"
                        className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white"
                    >
                        {formatBadge(unread)}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label={t('notifications.title', { defaultValue: 'Notifications' })}
                    className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
                >
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <p className="font-heading font-bold text-gray-900">
                            {t('notifications.title', { defaultValue: 'Notifications' })}
                        </p>
                        {unread > 0 && (
                            <button
                                type="button"
                                onClick={() => void markAllRead()}
                                disabled={isMarkingAll}
                                className="text-xs font-semibold text-primary-light hover:underline disabled:opacity-50"
                            >
                                {t('notifications.mark_all_read', { defaultValue: 'Tout marquer comme lu' })}
                            </button>
                        )}
                    </div>

                    {list.isLoading && (
                        <p className="px-4 py-6 text-center text-sm text-gray-400">
                            {t('notifications.loading', { defaultValue: 'Chargement…' })}
                        </p>
                    )}
                    {list.isError && (
                        <p className="px-4 py-6 text-center text-sm text-danger">
                            {t('notifications.error', { defaultValue: 'Impossible de charger les notifications.' })}
                        </p>
                    )}
                    {list.data && list.data.items.length === 0 && (
                        <p className="px-4 py-6 text-center text-sm text-gray-500">
                            {t('notifications.empty', { defaultValue: "Aucune notification pour l'instant." })}
                        </p>
                    )}
                    {list.data && list.data.items.length > 0 && (
                        <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
                            {list.data.items.map((notification) => (
                                <NotificationItem key={notification.id} notification={notification} onOpen={open} compact />
                            ))}
                        </ul>
                    )}

                    <Link
                        to={allPath}
                        onClick={() => setIsOpen(false)}
                        className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-semibold text-primary-dark hover:bg-slate-50"
                    >
                        {t('notifications.see_all', { defaultValue: 'Voir toutes les notifications' })}
                    </Link>
                </div>
            )}
        </div>
    );
}
