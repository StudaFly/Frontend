import apiClient from './client';
import type { ApiResponse } from './types';

/** Labels and choices owned by the backend (GET /reference). */
export interface ReferenceData {
    mobilityTypes: { key: string; label: string; description: string }[];
    taskCategories: { key: string; label: string }[];
    taskPriorities: { value: number; label: string }[];
    avatarEmojis: string[];
}

/** Real figures for the landing page (GET /stats). */
export interface PublicStats {
    countries: number;
    destinations: number;
    students: number;
    preparationSteps: number;
}

export const getReference = () => apiClient.get<ApiResponse<ReferenceData>>('/reference');

export const getStats = () => apiClient.get<ApiResponse<PublicStats>>('/stats');

export const getHealth = () => apiClient.get<ApiResponse<{ status: string }>>('/health');
