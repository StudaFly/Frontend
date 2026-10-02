import apiClient from './client';
import type { ApiResponse } from './types';

export interface TimelineTask {
    id: string;
    mobilityId: string;
    title: string;
    description: string | null;
    category: 'admin' | 'finance' | 'housing' | 'health' | 'practical';
    deadline: string | null;
    /** Computed by the backend: days to the deadline, negative when overdue. */
    daysUntilDeadline: number | null;
    isCompleted: boolean;
    priority: 1 | 2 | 3;
}


export const getTimeline = (mobilityId: string) =>
    apiClient.get<ApiResponse<TimelineTask[]>>(`/mobilities/${mobilityId}/timeline`);
