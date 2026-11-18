import apiClient from './client';
import type { AccountType, ApiResponse, OrgRole, OrganizationSummary, Premium } from './types';

/** User as returned by the backend (UserRead). */
export interface ApiUser {
    id: string;
    email: string;
    name: string;
    accountType: AccountType;
    orgRole: OrgRole | null;
    organization: OrganizationSummary | null;
    premium: Premium;
    mfaEnabled: boolean;
    /** Deprecated by the backend: use accountType / orgRole / organization / premium. */
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

/** RGPD: schedules the deletion of the account (purged after 30 days). */
export const deleteMe = () => apiClient.delete('/users/me');

/** RGPD: every personal data as a JSON file. */
export const exportMe = () => apiClient.get<Record<string, unknown>>('/users/me/export');

export const leaveOrganization = () => apiClient.delete('/users/me/organization');
