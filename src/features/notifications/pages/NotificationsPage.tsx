import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { getApiErrorMessage } from '@/core/api/errors';
import { NotificationItem } from '../components/NotificationItem';
import { useNotificationActions, useNotifications } from '../hooks/useNotifications';
import { useOpenNotification } from '../hooks/useOpenNotification';

type Filter = 'all' | 'unread';

export default function NotificationsPage() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<Filter>('all');
    const { data, isLoading, error } = useNotifications({ unreadOnly: filter === 'unread', limit: 100 });
    const { markAllRead, remove, isMarkingAll } = useNotificationActions();
    const open = useOpenNotification();
    const unread = data?.unreadCount ?? 0;

    const filters: { id: Filter; label: string }[] = [
        { id: 'all', label: t('notifications.filter_all', { defaultValue: 'Toutes' }) },
        {
            id: 'unread',
            label: t('notifications.filter_unread', { count: unread, defaultValue: `Non lues (${unread})` }),
        },
    ];

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50">
            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="flex items-center gap-2 font-heading text-2xl font-bold text-primary-dark">
                        <Bell className="h-6 w-6" aria-hidden="true" />
                        {t('notifications.title', { defaultValue: 'Notifications' })}
                    </h1>
                    <button
                        type="button"
                        onClick={() => void markAllRead()}
                        disabled={unread === 0 || isMarkingAll}
                        className="rounded-md bg-secondary px-4 py-2 text-sm font-bold text-primary-dark shadow-sm hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t('notifications.mark_all_read', { defaultValue: 'Tout marquer comme lu' })}
                    </button>
                </div>

                <div className="mb-5 flex gap-2" role="tablist">
                    {filters.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={filter === id}
                            onClick={() => setFilter(id)}
                            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                                filter === id ? 'bg-primary-dark text-white' : 'bg-white text-gray-600 hover:bg-slate-100'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {isLoading && (
                    <p className="text-center text-gray-400">{t('notifications.loading', { defaultValue: 'Chargement…' })}</p>
                )}
                {error && (
                    <p className="text-center text-danger">
                        {getApiErrorMessage(error, t('notifications.error', { defaultValue: 'Impossible de charger les notifications.' }))}
                    </p>
                )}
                {data && data.items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-gray-500">
                        {filter === 'unread'
                            ? t('notifications.empty_unread', { defaultValue: 'Tout est lu, bravo !' })
                            : t('notifications.empty', { defaultValue: "Aucune notification pour l'instant." })}
                    </div>
                )}
                {data && data.items.length > 0 && (
                    <ul className="flex flex-col gap-3">
                        {data.items.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onOpen={open}
                                onDelete={(id) => void remove(id)}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
