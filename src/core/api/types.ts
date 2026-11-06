/** Success envelope used by every backend endpoint. */
export interface ApiResponse<T> {
    data: T;
    message: string;
}

/** Paginated list envelope (admin and organization lists). */
export interface Paginated<T> {
    data: T[];
    total: number;
    page: number;
    perPage: number;
}

export type AccountType = 'student' | 'org_staff' | 'platform_admin';
export type OrgRole = 'manager' | 'advisor';
export type PremiumSource = 'purchase' | 'admin_grant' | 'organization' | 'grandfathered';

export interface OrganizationSummary {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    branding: { primary_color?: string; accent_color?: string } & Record<string, unknown>;
}

export interface Premium {
    active: boolean;
    source: PremiumSource | null;
    until: string | null;
}
