import apiClient from './client';
import type { ApiResponse, OrgRole, OrganizationSummary } from './types';
import type { AuthPayload } from './auth';

export interface ConsentScope {
    sharedWithSchool: string[];
    neverShared: string[];
}

export interface InvitationPreview extends ConsentScope {
    organization: OrganizationSummary;
    kind: 'student' | 'staff';
    orgRole: OrgRole | null;
    email: string;
    status: 'pending' | 'accepted' | 'revoked' | 'expired';
    expiresAt: string;
}

export interface InvitationAcceptResult {
    kind: 'student' | 'staff';
    organization: OrganizationSummary;
    auth: AuthPayload | null;
}

export const previewByCode = (code: string) =>
    apiClient.get<ApiResponse<ConsentScope & { organization: OrganizationSummary }>>(
        `/organizations/by-code/${encodeURIComponent(code)}`,
    );

export const joinOrganization = (code: string) =>
    apiClient.post<ApiResponse<OrganizationSummary>>('/organizations/join', { code });

export const previewInvitation = (token: string) =>
    apiClient.get<ApiResponse<InvitationPreview>>(`/invitations/${encodeURIComponent(token)}`);

export const acceptInvitation = (token: string, body?: { name: string; password: string }) =>
    apiClient.post<ApiResponse<InvitationAcceptResult>>(
        `/invitations/${encodeURIComponent(token)}/accept`,
        body,
    );
