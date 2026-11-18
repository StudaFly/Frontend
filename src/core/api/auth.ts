import apiClient from './client';
import type { ApiResponse } from './types';
import type { ApiUser } from './users';

export interface AuthPayload {
    user: ApiUser;
    accessToken: string;
    refreshToken: string;
    /** Platform admins: the code step is still required before /admin. */
    mfaRequired?: boolean;
    /** True right after an OAuth sign-up: the user still has to create a mobility. */
    isNewUser?: boolean;
}

export type AuthResponse = ApiResponse<AuthPayload>;

export const login = (payload: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', payload);

export const register = (payload: { name: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/register', payload);

export const logout = (explicitToken?: string) =>
    explicitToken
        ? apiClient.post('/auth/logout', undefined, { headers: { Authorization: `Bearer ${explicitToken}` } })
        : apiClient.post('/auth/logout');

export const forgotPassword = (payload: { email: string }) =>
    apiClient.post('/auth/forgot-password', payload);

export const resetPassword = (payload: { token: string; newPassword: string }) =>
    apiClient.post('/auth/reset-password', payload);

/** Web: authorization code from the GIS popup. Mobile apps send an `idToken` instead. */
export const oauthGoogle = (payload: { code: string } | { idToken: string }) =>
    apiClient.post<AuthResponse>('/auth/oauth/google', payload);

// Not implemented by the backend yet (501).
export const oauthMicrosoft = (payload: { token: string }) =>
    apiClient.post<AuthResponse>('/auth/oauth/microsoft', payload);

export const oauthApple = (payload: { token: string }) =>
    apiClient.post<AuthResponse>('/auth/oauth/apple', payload);

export const mfaSetup = () =>
    apiClient.post<ApiResponse<{ secret: string; otpauthUri: string }>>('/auth/mfa/setup');

export const mfaActivate = (code: string) =>
    apiClient.post<ApiResponse<AuthPayload & { backupCodes: string[] }>>('/auth/mfa/activate', { code });

export const mfaVerify = (code: string) =>
    apiClient.post<AuthResponse>('/auth/mfa/verify', { code });
