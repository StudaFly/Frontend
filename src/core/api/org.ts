import apiClient from './client';
import type { ApiResponse, OrgRole, OrganizationSummary, Paginated } from './types';

export type FollowUp = 'ok' | 'warning' | 'danger';

export interface OrgInfo extends OrganizationSummary {
    settings: Record<string, unknown>;
    myMemberId: string;
    myOrgRole: OrgRole;
    myCountries: string[];
    myZones: string[];
}

export interface Member {
    id: string;
    userId: string;
    email: string;
    name: string;
    orgRole: OrgRole;
    isActive: boolean;
    userStatus: string;
    createdAt: string;
}

export interface Zone {
    key: string;
    countries: string[];
}

export interface Perimeter {
    memberId: string;
    countries: string[];
    zones: string[];
}

export interface AdvisorRef {
    memberId: string;
    name: string;
}

export interface StudentMobility {
    id: string;
    type: string;
    status: string;
    departureDate: string;
    returnDate: string | null;
    city: string;
    country: string;
    countryCode: string | null;
    advisor: AdvisorRef | null;
    assignment: 'override' | 'perimeter' | null;
    tasksDone: number;
    tasksTotal: number;
    overdueTasks: number;
    progress: number;
}

export interface StudentListItem {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
    followUp: FollowUp | null;
    mobility: StudentMobility | null;
}

export interface StudentDetail {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    joinedAt: string;
    source: string;
    followUp: FollowUp | null;
    mobilities: (StudentMobility & {
        categories: { category: string; done: number; total: number }[];
        documents: { id: string; category: string | null; uploadedAt: string }[];
    })[];
}

export interface Note {
    id: string;
    body: string;
    author: AdvisorRef | null;
    createdAt: string;
}

export interface Invitation {
    id: string;
    email: string;
    kind: 'student' | 'staff';
    orgRole: OrgRole | null;
    status: 'pending' | 'accepted' | 'revoked' | 'expired';
    fromCsv: boolean;
    expiresAt: string;
    acceptedAt: string | null;
    createdAt: string;
}

export interface ImportReport {
    invited: number;
    resent: number;
    skipped: number;
    lines: { line: number; email: string | null; status: string }[];
}

export interface OrgContract {
    state: 'none' | 'current' | 'read_only' | 'blocked';
    contract: {
        plan: string;
        status: string;
        startDate: string;
        endDate: string;
        priceCents: number;
        currency: string;
        studentQuota: number | null;
    } | null;
    activeStudents: number;
}

export interface AuditEntry {
    id: string;
    actorId: string | null;
    actorAccountType: string;
    action: string;
    targetType: string;
    targetId: string | null;
    organizationId: string | null;
    changes: Record<string, unknown>;
    ip: string | null;
    createdAt: string;
}

export interface StudentFilters {
    q?: string;
    status?: FollowUp;
    zone?: string;
    advisorId?: string;
    unassigned?: boolean;
    page?: number;
    perPage?: number;
}

const clean = (params: object) =>
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== false));

export const orgApi = {
    get: () => apiClient.get<ApiResponse<OrgInfo>>('/org'),
    update: (payload: { logoUrl?: string | null; branding?: object; settings?: object }) =>
        apiClient.patch<ApiResponse<OrgInfo>>('/org', payload),
    contract: () => apiClient.get<ApiResponse<OrgContract>>('/org/contract'),
    members: () => apiClient.get<ApiResponse<Member[]>>('/org/members'),
    inviteStaff: (email: string, orgRole: OrgRole) =>
        apiClient.post<ApiResponse<Invitation>>('/org/members', { email, orgRole }),
    updateMember: (id: string, payload: { orgRole?: OrgRole; isActive?: boolean }) =>
        apiClient.patch<ApiResponse<Member>>(`/org/members/${id}`, payload),
    removeMember: (id: string) => apiClient.delete(`/org/members/${id}`),
    zones: () => apiClient.get<ApiResponse<Zone[]>>('/org/zones'),
    perimeter: (memberId: string) =>
        apiClient.get<ApiResponse<Perimeter>>(`/org/members/${memberId}/perimeter`),
    setPerimeter: (memberId: string, countries: string[], reassign = false) =>
        apiClient.put<ApiResponse<Perimeter>>(`/org/members/${memberId}/perimeter`, { countries, reassign }),
    students: (filters: StudentFilters = {}) =>
        apiClient.get<Paginated<StudentListItem>>('/org/students', { params: clean(filters) }),
    student: (id: string) => apiClient.get<ApiResponse<StudentDetail>>(`/org/students/${id}`),
    revokeStudent: (id: string) => apiClient.delete(`/org/students/${id}`),
    notes: (studentId: string) => apiClient.get<ApiResponse<Note[]>>(`/org/students/${studentId}/notes`),
    addNote: (studentId: string, body: string) =>
        apiClient.post<ApiResponse<Note>>(`/org/students/${studentId}/notes`, { body }),
    assignAdvisor: (mobilityId: string, memberId: string) =>
        apiClient.put(`/org/mobilities/${mobilityId}/advisor`, { memberId }),
    clearAdvisor: (mobilityId: string) => apiClient.delete(`/org/mobilities/${mobilityId}/advisor`),
    invitations: (params: { status?: string; kind?: string } = {}) =>
        apiClient.get<ApiResponse<Invitation[]>>('/org/invitations', { params: clean(params) }),
    inviteStudent: (email: string) => apiClient.post<ApiResponse<Invitation>>('/org/invitations', { email }),
    importInvitations: (file: File) => {
        const form = new FormData();
        form.append('file', file);
        return apiClient.post<ApiResponse<ImportReport>>('/org/invitations/import', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    revokeInvitation: (id: string) => apiClient.delete(`/org/invitations/${id}`),
    joinCode: () => apiClient.get<ApiResponse<{ joinCode: string }>>('/org/join-code'),
    rotateJoinCode: () => apiClient.post<ApiResponse<{ joinCode: string }>>('/org/join-code/rotate'),
    auditLogs: (page = 1) => apiClient.get<Paginated<AuditEntry>>('/org/audit-logs', { params: { page } }),
};
