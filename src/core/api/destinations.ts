import apiClient from './client';
import type { ApiResponse } from './types';

/** DestinationRead — list item (GET /destinations). */
export interface Destination {
    id: string;
    country: string;
    city: string;
    imageUrl: string | null;
    summary: string | null;
}

export interface DestinationFacts {
    language?: string | null;
    currency?: string | null;
    climate?: string | null;
    visaRequired?: boolean | null;
    internationalStudents?: number | null;
}

/** DestinationDetail — GET /destinations/{id}. */
export interface DestinationDetail extends Destination {
    facts: DestinationFacts | null;
    hasBudget: boolean;
    hasGuide: boolean;
}

export type BudgetCategoryKey = 'housing' | 'food' | 'transport' | 'leisure';

export interface BudgetCategory {
    key: BudgetCategoryKey;
    label: string;
    amountMin: number;
    amountMax: number;
    currency: string;
}

/** Monthly cost of living (GET /destinations/{id}/budget). */
export interface BudgetEstimate {
    destinationId: string;
    city: string;
    country: string;
    monthlyTotalMin: number;
    monthlyTotalMax: number;
    currency: string;
    breakdown: BudgetCategory[];
    tips: string[];
}

export interface GuideStep {
    title: string;
    description: string;
    timing: string;
}

export interface GuideSection {
    key: string;
    title: string;
    content: string;
}

/** Destination guide (GET /destinations/{id}/guide). */
export interface DestinationGuide {
    destinationId: string;
    city: string;
    country: string;
    sections: GuideSection[];
    tips: string[];
    keySteps: GuideStep[];
    emergencyContacts: Record<string, string>;
    usefulApps: string[];
}

export const getDestinations = (query?: string) =>
    apiClient.get<ApiResponse<Destination[]>>('/destinations', { params: query ? { query } : undefined });

export const getDestination = (id: string) =>
    apiClient.get<ApiResponse<DestinationDetail>>(`/destinations/${id}`);

export const getDestinationBudget = (id: string) =>
    apiClient.get<ApiResponse<BudgetEstimate>>(`/destinations/${id}/budget`);

export const getDestinationGuide = (id: string) =>
    apiClient.get<ApiResponse<DestinationGuide>>(`/destinations/${id}/guide`);
