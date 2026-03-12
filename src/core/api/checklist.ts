import apiClient from './client';
import type { Task, NewTaskFormData } from '@/features/checklist/types/task';

interface ApiResponse<T> {
    data: T;
    message: string;
}

export const getTasks = (mobilityId: string) =>
    apiClient.get<ApiResponse<Task[]>>(`/mobilities/${mobilityId}/tasks`);

export const createTask = (mobilityId: string, payload: NewTaskFormData) =>
    apiClient.post<ApiResponse<Task>>(`/mobilities/${mobilityId}/tasks`, payload);

export const updateTask = (taskId: string, payload: Partial<Task>) =>
    apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}`, payload);

export const completeTask = (taskId: string) =>
    apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/complete`);

export const deleteTask = (taskId: string) =>
    apiClient.delete(`/tasks/${taskId}`);
