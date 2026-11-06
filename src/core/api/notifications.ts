import apiClient from './client';
import type { ApiResponse } from './types';

export type NotificationType =
    | 'task_due_soon'
    | 'task_due_today'
    | 'task_overdue'
    | 'organization_invitation'
    | 'invitation_accepted';

export interface AppNotification {
    id: string;
    /** Kept open (string) so a type added on the backend does not break the page. */
    type: NotificationType | (string & {});
    title: string;
    body: string | null;
    data: Record<string, string>;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
}

export interface NotificationList {
    items: AppNotification[];
    unreadCount: number;
}

export interface ListNotificationsParams {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
}

export const getNotifications = (params: ListNotificationsParams = {}) =>
    apiClient.get<ApiResponse<NotificationList>>('/notifications', { params });

export const getUnreadCount = () =>
    apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count');

export const markNotificationRead = (id: string) =>
    apiClient.patch<ApiResponse<AppNotification>>(`/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
    apiClient.post<ApiResponse<{ updated: number }>>('/notifications/read-all');

export const deleteNotification = (id: string) => apiClient.delete(`/notifications/${id}`);
