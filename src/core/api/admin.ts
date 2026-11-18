import apiClient from './client';
import type { AccountType, ApiResponse, OrgRole, OrganizationSummary, Paginated, Premium } from './types';
import type { AuditEntry, Member } from './org';

export interface ManagedUser {
    id: string;
    email: string;
    name: string;
    accountType: AccountType;
    status: 'active' | 'suspended' | 'pending_deletion';
    orgRole: OrgRole | null;
    organization: OrganizationSummary | null;
    premium: Premium;
    mfaEnabled: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

export interface PremiumGrant {
    id: string;
    source: 'purchase' | 'admin_grant';
    startsAt: string;
    endsAt: string | null;
    revokedAt: string | null;
    reason: string | null;
    amountCents: number | null;
    currency: string | null;
    createdAt: string;
}

export interface ManagedUserDetail extends ManagedUser {
    phone: string | null;
    suspendedAt: string | null;
    suspendedReason: string | null;
    deletionScheduledAt: string | null;
    mobilities: { id: string; type: string; status: string; departureDate: string; returnDate: string | null; city: string; country: string }[];
    premiumGrants: PremiumGrant[];
}

export interface AdminOrganization extends OrganizationSummary {
    settings: Record<string, unknown>;
    status: 'active' | 'suspended' | 'archived';
    joinCode: string;
    memberCount: number;
    activeStudentCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Enrollment {
    id: string;
    studentId: string;
    email: string;
    name: string;
    status: 'active' | 'left' | 'revoked';
    source: string;
    joinedAt: string;
    endedAt: string | null;
}

export type ContractStatus = 'pilot' | 'active' | 'expired' | 'suspended' | 'cancelled';

export interface Contract {
    id: string;
    organizationId: string;
    plan: string;
    status: ContractStatus;
    startDate: string;
    endDate: string;
    priceCents: number;
    currency: string;
    studentQuota: number | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Overview {
    users: { total: number; byStatus: Record<string, number>; byAccountType: Record<string, number> };
    organizations: { total: number; byStatus: Record<string, number> };
    contracts: { total: number; byStatus: Record<string, number> };
    activePremiumGrants: { purchase: number; adminGrant: number };
}

export interface Purchase extends PremiumGrant {
    userId: string;
    email: string;
    stripePaymentRef: string | null;
}

type Params = Record<string, string | number | undefined>;
const clean = (params: Params) =>
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''));

export const adminApi = {
    overview: () => apiClient.get<ApiResponse<Overview>>('/admin/overview'),
    users: (params: Params = {}) => apiClient.get<Paginated<ManagedUser>>('/admin/users', { params: clean(params) }),
    user: (id: string) => apiClient.get<ApiResponse<ManagedUserDetail>>(`/admin/users/${id}`),
    createUser: (payload: { email: string; name: string; accountType: 'student' | 'org_staff'; organizationId?: string; orgRole?: OrgRole }) =>
        apiClient.post<ApiResponse<ManagedUserDetail>>('/admin/users', payload),
    updateUser: (id: string, payload: { name?: string; email?: string; phone?: string | null }) =>
        apiClient.patch<ApiResponse<ManagedUserDetail>>(`/admin/users/${id}`, payload),
    suspendUser: (id: string, reason: string) =>
        apiClient.post<ApiResponse<ManagedUserDetail>>(`/admin/users/${id}/suspend`, { reason }),
    reactivateUser: (id: string) => apiClient.post<ApiResponse<ManagedUserDetail>>(`/admin/users/${id}/reactivate`),
    deleteUser: (id: string) => apiClient.delete<ApiResponse<ManagedUserDetail>>(`/admin/users/${id}`),
    grantPremium: (id: string, reason: string, endsAt?: string) =>
        apiClient.post<ApiResponse<PremiumGrant>>(`/admin/users/${id}/premium-grants`, { reason, endsAt }),
    revokePremium: (id: string, grantId: string, reason: string) =>
        apiClient.delete(`/admin/users/${id}/premium-grants/${grantId}`, { params: { reason } }),
    purchases: (page = 1) => apiClient.get<Paginated<Purchase>>('/admin/purchases', { params: { page } }),
    organizations: (params: Params = {}) =>
        apiClient.get<Paginated<AdminOrganization>>('/admin/organizations', { params: clean(params) }),
    organization: (id: string) => apiClient.get<ApiResponse<AdminOrganization>>(`/admin/organizations/${id}`),
    createOrganization: (payload: { name: string; slug?: string; manager: { email: string; name: string } }) =>
        apiClient.post<ApiResponse<AdminOrganization>>('/admin/organizations', payload),
    updateOrganization: (id: string, payload: { name?: string; slug?: string; logoUrl?: string | null; branding?: object }) =>
        apiClient.patch<ApiResponse<AdminOrganization>>(`/admin/organizations/${id}`, payload),
    setOrganizationStatus: (id: string, action: 'suspend' | 'reactivate' | 'archive') =>
        apiClient.post(`/admin/organizations/${id}/${action}`),
    members: (id: string) => apiClient.get<ApiResponse<Member[]>>(`/admin/organizations/${id}/members`),
    addMember: (id: string, payload: { email: string; name: string; orgRole: OrgRole }) =>
        apiClient.post<ApiResponse<Member>>(`/admin/organizations/${id}/members`, payload),
    updateMember: (id: string, memberId: string, payload: { orgRole?: OrgRole; isActive?: boolean }) =>
        apiClient.patch<ApiResponse<Member>>(`/admin/organizations/${id}/members/${memberId}`, payload),
    removeMember: (id: string, memberId: string) => apiClient.delete(`/admin/organizations/${id}/members/${memberId}`),
    enrollments: (id: string, status = 'active') =>
        apiClient.get<ApiResponse<Enrollment[]>>(`/admin/organizations/${id}/students`, { params: { status } }),
    enroll: (id: string, studentId: string) =>
        apiClient.post<ApiResponse<Enrollment>>(`/admin/organizations/${id}/students`, { studentId }),
    unenroll: (id: string, studentId: string) => apiClient.delete(`/admin/organizations/${id}/students/${studentId}`),
    organizationContracts: (id: string) => apiClient.get<ApiResponse<Contract[]>>(`/admin/organizations/${id}/contracts`),
    createContract: (id: string, payload: Omit<Contract, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>) =>
        apiClient.post<ApiResponse<Contract>>(`/admin/organizations/${id}/contracts`, payload),
    updateContract: (id: string, contractId: string, payload: Partial<Contract>) =>
        apiClient.patch<ApiResponse<Contract>>(`/admin/organizations/${id}/contracts/${contractId}`, payload),
    contracts: (params: Params = {}) => apiClient.get<Paginated<Contract>>('/admin/contracts', { params: clean(params) }),
    auditLogs: (params: Params = {}) => apiClient.get<Paginated<AuditEntry>>('/admin/audit-logs', { params: clean(params) }),
};
