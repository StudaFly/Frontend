import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "@/router/components/ProtectedRoute";
import type { AccountType, OrgRole } from "@/core/api/types";

const auth = vi.hoisted(() => ({
    isAuthenticated: true,
    isRestoring: false,
    mfaVerified: false,
    user: null as null | { accountType: AccountType; orgRole: OrgRole | null; firstName: string },
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => auth }));

function renderAt(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/login" element={<p>login page</p>} />
                <Route path="/admin/mfa" element={<p>mfa page</p>} />
                <Route element={<ProtectedRoute accountTypes={["student"]} />}>
                    <Route path="/dashboard" element={<p>student space</p>} />
                </Route>
                <Route element={<ProtectedRoute accountTypes={["org_staff"]} />}>
                    <Route path="/org" element={<p>org space</p>} />
                    <Route element={<ProtectedRoute accountTypes={["org_staff"]} orgRoles={["manager"]} />}>
                        <Route path="/org/team" element={<p>team page</p>} />
                    </Route>
                </Route>
                <Route element={<ProtectedRoute accountTypes={["platform_admin"]} requireMfa />}>
                    <Route path="/admin" element={<p>admin space</p>} />
                </Route>
            </Routes>
        </MemoryRouter>,
    );
}

const as = (accountType: AccountType, orgRole: OrgRole | null = null) => {
    auth.user = { accountType, orgRole, firstName: "Test" };
};

describe("ProtectedRoute", () => {
    beforeEach(() => {
        auth.isAuthenticated = true;
        auth.isRestoring = false;
        auth.mfaVerified = false;
    });

    it("sends anonymous visitors to the login page", () => {
        auth.isAuthenticated = false;
        auth.user = null;
        renderAt("/org");
        expect(screen.getByText("login page")).toBeInTheDocument();
    });

    it.each([
        ["student", null, "/org"],
        ["student", null, "/admin"],
        ["org_staff", "advisor", "/dashboard"],
        ["org_staff", "advisor", "/org/team"],
        ["platform_admin", null, "/org"],
    ] as const)("shows a clean 403 to a %s (%s) on %s", (accountType, orgRole, path) => {
        as(accountType, orgRole);
        renderAt(path);
        expect(screen.getByRole("heading", { name: /accès refusé/i })).toBeInTheDocument();
    });

    it.each([
        ["student", null, "/dashboard", "student space"],
        ["org_staff", "advisor", "/org", "org space"],
        ["org_staff", "manager", "/org/team", "team page"],
    ] as const)("lets a %s (%s) open %s", (accountType, orgRole, path, text) => {
        as(accountType, orgRole);
        renderAt(path);
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it("requires the MFA step before the admin space", () => {
        as("platform_admin");
        renderAt("/admin");
        expect(screen.getByText("mfa page")).toBeInTheDocument();
    });

    it("opens the admin space once MFA is verified", () => {
        as("platform_admin");
        auth.mfaVerified = true;
        renderAt("/admin");
        expect(screen.getByText("admin space")).toBeInTheDocument();
    });
});
