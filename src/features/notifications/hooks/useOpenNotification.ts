import { useNavigate } from 'react-router-dom';
import type { AppNotification } from '@/core/api/notifications';
import { notificationLink } from '../utils/notificationUtils';
import { useNotificationActions } from './useNotifications';

/** Click on a notification: mark it read, then go to the page it is about (if any). */
export function useOpenNotification(onOpened?: () => void) {
    const navigate = useNavigate();
    const { markRead } = useNotificationActions();

    return (notification: AppNotification) => {
        if (!notification.isRead) void markRead(notification.id).catch(() => undefined);
        const link = notificationLink(notification);
        onOpened?.();
        if (link) navigate(link);
    };
}
