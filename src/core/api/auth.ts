import apiClient from './client';
import type { ApiResponse } from './types';
import type { ApiUser } from './users';

export interface AuthPayload {
    user: ApiUser;
    accessToken: string;
    refreshToken: string;
    /** True when the account was just created (OAuth sign-up). */
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

// Not implemented by the backend yet (501): kept for the upcoming screens.
export const forgotPassword = (payload: { email: string }) =>
    apiClient.post('/auth/forgot-password', payload);

export const resetPassword = (payload: { token: string; newPassword: string }) =>
    apiClient.post('/auth/reset-password', payload);

/** Web: authorization code from the Google Identity Services popup. */
export const oauthGoogle = (payload: { code: string }) =>
    apiClient.post<AuthResponse>('/auth/oauth/google', payload);

export const oauthMicrosoft = (payload: { token: string }) =>
    apiClient.post<AuthResponse>('/auth/oauth/microsoft', payload);

export const oauthApple = (payload: { token: string }) =>
    apiClient.post<AuthResponse>('/auth/oauth/apple', payload);
