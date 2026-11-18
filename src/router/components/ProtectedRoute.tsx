import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/shared/PageLoader";
import type { AccountType, OrgRole } from "@/core/api/types";
import ForbiddenPage from "@/features/errors/pages/ForbiddenPage";

interface ProtectedRouteProps {
    accountTypes?: AccountType[];
    orgRoles?: OrgRole[];
    requireMfa?: boolean;
}

/** UI guard only: the backend checks every request again. */
export function ProtectedRoute({ accountTypes, orgRoles, requireMfa = false }: ProtectedRouteProps) {
    const { isAuthenticated, isRestoring, user, mfaVerified } = useAuth();
    const location = useLocation();

    if (isRestoring) {
        return <PageLoader />;
    }

    if (!isAuthenticated || !user) {
        const redirect = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirect=${redirect}`} replace />;
    }

    const accountType = user.accountType ?? "student";
    if (accountTypes && !accountTypes.includes(accountType)) {
        return <ForbiddenPage />;
    }
    if (orgRoles && (!user.orgRole || !orgRoles.includes(user.orgRole))) {
        return <ForbiddenPage />;
    }
    if (requireMfa && !mfaVerified) {
        return <Navigate to="/admin/mfa" replace />;
    }

    return <Outlet />;
}
