import apiClient from './client';
import type { ApiResponse } from './types';

/** User as returned by the backend (UserRead). */
export interface ApiUser {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'admin' | 'superadmin';
    institutionId: string | null;
    isPremium: boolean;
    emailVerified: boolean;
    oauthProvider: string | null;
    avatarEmoji: string | null;
    phone: string | null;
    enableNotifications: boolean;
    createdAt: string;
}

export interface UpdateMePayload {
    firstName?: string;
    lastName?: string;
    phone?: string;
    enableNotifications?: boolean;
    avatarEmoji?: string;
}

export const getMe = () => apiClient.get<ApiResponse<ApiUser>>('/users/me');

export const updateMe = (payload: UpdateMePayload) =>
    apiClient.patch<ApiResponse<ApiUser>>('/users/me', payload);

/** RGPD: deletes the account and all its data. */
export const deleteMe = () => apiClient.delete('/users/me');
