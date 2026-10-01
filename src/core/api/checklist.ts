import apiClient from './client';
import type { ApiResponse } from './types';
import type { Task, NewTaskFormData } from '@/features/checklist/types/task';


export const getTasks = (mobilityId: string) =>
    apiClient.get<ApiResponse<Task[]>>(`/mobilities/${mobilityId}/tasks`);

export const createTask = (mobilityId: string, form: NewTaskFormData) =>
    apiClient.post<ApiResponse<Task>>(`/mobilities/${mobilityId}/tasks`, {
        title: form.title.trim(),
        category: form.category,
        priority: form.priority,
        // Empty form fields must be sent as null, not "" (the API validates dates).
        description: form.description.trim() || null,
        deadline: form.deadline || null,
    });

export const updateTask = (taskId: string, payload: Partial<Task>) =>
    apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}`, payload);

export const completeTask = (taskId: string) =>
    apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/complete`);

export const deleteTask = (taskId: string) =>
    apiClient.delete(`/tasks/${taskId}`);
