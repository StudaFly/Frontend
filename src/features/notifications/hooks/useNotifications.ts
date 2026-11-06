import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    deleteNotification,
    getNotifications,
    getUnreadCount,
    markAllNotificationsRead,
    markNotificationRead,
    type NotificationList,
} from '@/core/api/notifications';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;
const UNREAD_COUNT_QUERY_KEY = [...NOTIFICATIONS_QUERY_KEY, 'unread-count'] as const;

/** How often the navbar badge checks for new notifications (reminders are created daily). */
export const UNREAD_POLL_INTERVAL_MS = 60_000;

export function useNotifications(options: { unreadOnly?: boolean; limit?: number } = {}) {
    const { unreadOnly = false, limit = 50 } = options;
    return useQuery({
        queryKey: [...NOTIFICATIONS_QUERY_KEY, 'list', { unreadOnly, limit }],
        queryFn: async (): Promise<NotificationList> =>
            (await getNotifications({ unreadOnly, limit })).data.data,
        staleTime: 30_000,
    });
}

export function useUnreadCount(enabled = true) {
    return useQuery({
        queryKey: UNREAD_COUNT_QUERY_KEY,
        queryFn: async () => (await getUnreadCount()).data.data.count,
        enabled,
        refetchInterval: UNREAD_POLL_INTERVAL_MS,
        refetchOnWindowFocus: true,
        staleTime: 30_000,
    });
}

/** Mark as read / read all / delete; every change refreshes the list and the badge. */
export function useNotificationActions() {
    const queryClient = useQueryClient();
    const refresh = () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

    const markRead = useMutation({ mutationFn: (id: string) => markNotificationRead(id), onSuccess: refresh });
    const markAllRead = useMutation({ mutationFn: () => markAllNotificationsRead(), onSuccess: refresh });
    const remove = useMutation({ mutationFn: (id: string) => deleteNotification(id), onSuccess: refresh });

    return {
        markRead: (id: string) => markRead.mutateAsync(id),
        markAllRead: () => markAllRead.mutateAsync(),
        remove: (id: string) => remove.mutateAsync(id),
        isMarkingAll: markAllRead.isPending,
    };
}
