import type { User } from "@/contexts/AuthContext";

export function homePath(user: User | null, mfaVerified: boolean): string {
    if (!user) return "/login";
    if (user.accountType === "org_staff") return "/org";
    if (user.accountType === "platform_admin") return mfaVerified ? "/admin" : "/admin/mfa";
    return "/dashboard";
}

/** Only same-app paths are followed after login (no open redirect). */
export function safeRedirect(target: string | null): string | null {
    return target && target.startsWith("/") && !target.startsWith("//") ? target : null;
}
