import apiClient from './client';

export interface Destination {
    id: string;
    name: string;
    country: string;
    city: string;
    description: string;
    imageUrl?: string;
}

export interface BudgetEstimate {
    housing: number;
    food: number;
    transport: number;
    leisure: number;
    total: number;
    currency: string;
}

export interface DestinationGuide {
    sections: Array<{
        title: string;
        content: string;
    }>;
}

interface ApiResponse<T> {
    data: T;
    message: string;
}

export const getDestinations = (query?: string) =>
    apiClient.get<ApiResponse<Destination[]>>('/destinations/', { params: query ? { query } : undefined });

export const getDestination = (id: string) =>
    apiClient.get<ApiResponse<Destination>>(`/destinations/${id}`);

export const getDestinationBudget = (id: string) =>
    apiClient.get<ApiResponse<BudgetEstimate>>(`/destinations/${id}/budget`);

export const getDestinationGuide = (id: string) =>
    apiClient.get<ApiResponse<DestinationGuide>>(`/destinations/${id}/guide`);
