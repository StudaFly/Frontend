import apiClient from './client';

export interface AuthResponse {
    data: {
        user: {
            id: string;
            email: string;
            name: string;
            role: 'student' | 'admin' | 'superadmin';
            isPremium: boolean;
            createdAt: string;
        };
        accessToken: string;
        refreshToken: string;
    };
    message: string;
}

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

export const oauthGoogle = (payload: { token: string }) =>
    apiClient.post<AuthResponse>('/auth/oauth/google', payload);

export const oauthMicrosoft = (payload: { token: string }) =>
    apiClient.post<AuthResponse>('/auth/oauth/microsoft', payload);

export const oauthApple = (payload: { token: string }) =>
    apiClient.post<AuthResponse>('/auth/oauth/apple', payload);
