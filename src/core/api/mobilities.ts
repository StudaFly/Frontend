import apiClient from './client';

export interface Mobility {
    id: string;
    userId: string;
    destinationId: string;
    type: 'erasmus' | 'stage' | 'semestre' | 'double_diplome';
    departureDate: string;
    returnDate?: string;
    status: 'preparing' | 'departed' | 'completed';
    school?: string;
    createdAt: string;
}

interface ApiResponse<T> {
    data: T;
    message: string;
}

export const getMobilities = () =>
    apiClient.get<ApiResponse<Mobility[]>>('/mobilities/');

export const getMobility = (id: string) =>
    apiClient.get<ApiResponse<Mobility>>(`/mobilities/${id}`);

export const updateMobility = (id: string, payload: Partial<Mobility>) =>
    apiClient.patch<ApiResponse<Mobility>>(`/mobilities/${id}`, payload);

export const deleteMobility = (id: string) =>
    apiClient.delete(`/mobilities/${id}`);
