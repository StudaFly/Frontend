import apiClient from './client';
import type { ApiResponse } from './types';

import type { TimelineTask } from './timeline';

/** Keys of GET /reference → mobilityTypes (labels come from the API). */
export type MobilityType = 'erasmus' | 'stage' | 'semestre' | 'double_diplome';

export interface Mobility {
    id: string;
    userId: string;
    destinationId: string;
    type: MobilityType;
    departureDate: string;
    returnDate: string | null;
    status: 'preparing' | 'departed' | 'completed';
    school: string | null;
    createdAt: string;
    /** Computed by the backend. */
    daysUntilDeparture: number;
    stayMonths: number | null;
}

/** GET /mobilities/{id}/progress — dashboard figures computed by the backend. */
export interface MobilityProgress {
    mobilityId: string;
    totalTasks: number;
    completedTasks: number;
    percent: number;
    daysUntilDeparture: number;
    overdueTasks: number;
    byCategory: { category: TimelineTask['category']; label: string; done: number; total: number }[];
    nextTasks: TimelineTask[];
}

export interface CreateMobilityPayload {
    destinationId: string;
    type: MobilityType;
    /** ISO date (YYYY-MM-DD) */
    departureDate: string;
    returnDate?: string;
    school?: string;
}

export const getMobilities = () =>
    apiClient.get<ApiResponse<Mobility[]>>('/mobilities');

export const getMobility = (id: string) =>
    apiClient.get<ApiResponse<Mobility>>(`/mobilities/${id}`);

/** Creates the mobility; the backend generates its parcours (tasks) in the same call. */
export const createMobility = (payload: CreateMobilityPayload) =>
    apiClient.post<ApiResponse<Mobility>>('/mobilities', payload);

export const getProgress = (id: string) =>
    apiClient.get<ApiResponse<MobilityProgress>>(`/mobilities/${id}/progress`);

export const updateMobility = (id: string, payload: Partial<Mobility>) =>
    apiClient.patch<ApiResponse<Mobility>>(`/mobilities/${id}`, payload);

export const deleteMobility = (id: string) =>
    apiClient.delete(`/mobilities/${id}`);
