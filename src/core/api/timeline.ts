import apiClient from './client';

export interface TimelineTask {
    id: string;
    mobilityId: string;
    title: string;
    description?: string;
    category: 'admin' | 'finance' | 'housing' | 'health' | 'practical';
    deadline?: string;
    isCompleted: boolean;
    priority: 1 | 2 | 3;
}

interface ApiResponse<T> {
    data: T;
    message: string;
}

export const getTimeline = (mobilityId: string) =>
    apiClient.get<ApiResponse<TimelineTask[]>>(`/mobilities/${mobilityId}/timeline`);
