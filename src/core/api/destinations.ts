import apiClient from './client';

export interface DestinationStep {
    timing: string;
    title: string;
    description: string;
}

export interface Destination {
    id: string;
    country: string;
    city: string;
    imageUrl?: string;
    guideContent?: {
        overview?: string;
        housing?: string;
        transport?: string;
        tips?: string[];
        climate?: string;
        language?: string;
        visa_required?: boolean;
        visa_note?: string;
        currency?: string;
        international_students?: string;
        steps?: DestinationStep[];
    };
    costOfLiving?: {
        currency?: string;
        monthly_budget?: { min: number; max: number };
        rent?: { shared: number; studio: number };
        food?: number;
        transport?: number;
        leisure?: number;
        misc?: number;
    };
}

interface ApiResponse<T> {
    data: T;
    message: string;
}

export const getDestinations = (query?: string) =>
    apiClient.get<ApiResponse<Destination[]>>('/destinations', { params: query ? { query } : undefined });

export const getDestination = (id: string) =>
    apiClient.get<ApiResponse<Destination>>(`/destinations/${id}`);
