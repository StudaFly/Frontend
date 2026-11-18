import { tokenStorage } from "./tokenStorage";

export interface AccessClaims {
    sub?: string;
    account_type?: string;
    org_role?: string | null;
    mfa?: boolean;
}

/** Reads the access token payload for UI decisions only (the API re-checks everything). */
export function readAccessClaims(token = tokenStorage.getAccessToken()): AccessClaims {
    if (!token) return {};
    try {
        const payload = token.split(".")[1];
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json) as AccessClaims;
    } catch {
        return {};
    }
}
