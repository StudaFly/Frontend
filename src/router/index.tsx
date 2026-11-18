import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { withSuspense } from "./utils";
import { OrgLayout } from "@/features/org/OrgLayout";
import { AdminLayout } from "@/features/admin/AdminLayout";

// Lazy-loaded pages
const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
const ChecklistPage = lazy(() => import("@/features/checklist/pages/ChecklistPage"));
const TimelinePage = lazy(() => import("@/features/timeline/pages/TimelinePage"));
const DestinationsPage = lazy(() => import("@/features/destinations/pages/DestinationsPage"));
const DestinationDetailPage = lazy(() => import("@/features/destinations/pages/DestinationDetailPage"));
const AboutPage = lazy(() => import("@/features/about/pages/AboutPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const CreateMobilityPage = lazy(() => import("@/features/mobility/pages/CreateMobilityPage"));
const BudgetPage = lazy(() => import("@/features/budget/pages/BudgetPage"));
const GuidePage = lazy(() => import("@/features/guide/pages/GuidePage"));
const InvitationPage = lazy(() => import("@/features/invitations/pages/InvitationPage"));
const NotFoundPage = lazy(() => import("@/features/errors/pages/NotFoundPage"));

const OrgDashboardPage = lazy(() => import("@/features/org/pages/OrgDashboardPage"));
const OrgStudentsPage = lazy(() => import("@/features/org/pages/OrgStudentsPage"));
const OrgStudentDetailPage = lazy(() => import("@/features/org/pages/OrgStudentDetailPage"));
const OrgAlertsPage = lazy(() => import("@/features/org/pages/OrgAlertsPage"));
const OrgStatsPage = lazy(() => import("@/features/org/pages/OrgStatsPage"));
const OrgInvitationsPage = lazy(() => import("@/features/org/pages/OrgInvitationsPage"));
const OrgTeamPage = lazy(() => import("@/features/org/pages/OrgTeamPage"));
const OrgPerimetersPage = lazy(() => import("@/features/org/pages/OrgPerimetersPage"));
const OrgSettingsPage = lazy(() => import("@/features/org/pages/OrgSettingsPage"));
const OrgContractPage = lazy(() => import("@/features/org/pages/OrgContractPage"));
const OrgJournalPage = lazy(() => import("@/features/org/pages/OrgJournalPage"));

const AdminMfaPage = lazy(() => import("@/features/admin/pages/AdminMfaPage"));
const AdminOverviewPage = lazy(() => import("@/features/admin/pages/AdminOverviewPage"));
const AdminUsersPage = lazy(() => import("@/features/admin/pages/AdminUsersPage"));
const AdminUserDetailPage = lazy(() => import("@/features/admin/pages/AdminUserDetailPage"));
const AdminOrganizationsPage = lazy(() => import("@/features/admin/pages/AdminOrganizationsPage"));
const AdminOrganizationDetailPage = lazy(() => import("@/features/admin/pages/AdminOrganizationDetailPage"));
const AdminContractsPage = lazy(() => import("@/features/admin/pages/AdminContractsPage"));
const AdminPurchasesPage = lazy(() => import("@/features/admin/pages/AdminPurchasesPage"));
const AdminAuditPage = lazy(() => import("@/features/admin/pages/AdminAuditPage"));
const NotificationsPage = lazy(() => import("@/features/notifications/pages/NotificationsPage"));

export const router = createBrowserRouter([
    {
        // Public routes (login, register)
        element: <AuthLayout />,
        children: [
            { path: "/login", element: withSuspense(<LoginPage />) },
            { path: "/register", element: withSuspense(<RegisterPage />) },
        ],
    },
    {
        // App routes with common layout
        element: <AppLayout />,
        children: [
            // Public app routes
            { path: "/", element: withSuspense(<HomePage />) },
            { path: "/destinations", element: withSuspense(<DestinationsPage />) },
            { path: "/destinations/:id", element: withSuspense(<DestinationDetailPage />) },
            { path: "/about", element: withSuspense(<AboutPage />) },
            { path: "/invitations/:token", element: withSuspense(<InvitationPage />) },

            // Student space
            {
                element: <ProtectedRoute accountTypes={["student"]} />,
                children: [
                    { path: "/dashboard", element: withSuspense(<DashboardPage />) },
                    { path: "/mobility/new", element: withSuspense(<CreateMobilityPage />) },
                    { path: "/checklist", element: withSuspense(<ChecklistPage />) },
                    { path: "/timeline", element: withSuspense(<TimelinePage />) },
                    { path: "/budget", element: withSuspense(<BudgetPage />) },
                    { path: "/guide", element: withSuspense(<GuidePage />) },
                    { path: "/profile", element: withSuspense(<ProfilePage />) },
                    { path: "/notifications", element: withSuspense(<NotificationsPage />) },
                ],
            },
            {
                element: <ProtectedRoute accountTypes={["platform_admin"]} />,
                children: [{ path: "/admin/mfa", element: withSuspense(<AdminMfaPage />) }],
            },
            { path: "*", element: withSuspense(<NotFoundPage />) },
        ],
    },
    {
        // Organization space (international relations staff)
        element: <ProtectedRoute accountTypes={["org_staff"]} />,
        children: [
            {
                element: <OrgLayout />,
                children: [
                    { path: "/org", element: withSuspense(<OrgDashboardPage />) },
                    { path: "/org/students", element: withSuspense(<OrgStudentsPage />) },
                    { path: "/org/students/:id", element: withSuspense(<OrgStudentDetailPage />) },
                    { path: "/org/alerts", element: withSuspense(<OrgAlertsPage />) },
                    { path: "/org/stats", element: withSuspense(<OrgStatsPage />) },
                    { path: "/org/invitations", element: withSuspense(<OrgInvitationsPage />) },
                    { path: "/org/notifications", element: withSuspense(<NotificationsPage />) },
                    {
                        element: <ProtectedRoute accountTypes={["org_staff"]} orgRoles={["manager"]} />,
                        children: [
                            { path: "/org/team", element: withSuspense(<OrgTeamPage />) },
                            { path: "/org/perimeters", element: withSuspense(<OrgPerimetersPage />) },
                            { path: "/org/unassigned", element: withSuspense(<OrgStudentsPage unassignedOnly />) },
                            { path: "/org/settings", element: withSuspense(<OrgSettingsPage />) },
                            { path: "/org/contract", element: withSuspense(<OrgContractPage />) },
                            { path: "/org/journal", element: withSuspense(<OrgJournalPage />) },
                        ],
                    },
                ],
            },
        ],
    },
    {
        // Platform admin space (web only, MFA required)
        element: <ProtectedRoute accountTypes={["platform_admin"]} requireMfa />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { path: "/admin", element: withSuspense(<AdminOverviewPage />) },
                    { path: "/admin/users", element: withSuspense(<AdminUsersPage />) },
                    { path: "/admin/users/:id", element: withSuspense(<AdminUserDetailPage />) },
                    { path: "/admin/organizations", element: withSuspense(<AdminOrganizationsPage />) },
                    { path: "/admin/organizations/:id", element: withSuspense(<AdminOrganizationDetailPage />) },
                    { path: "/admin/contracts", element: withSuspense(<AdminContractsPage />) },
                    { path: "/admin/purchases", element: withSuspense(<AdminPurchasesPage />) },
                    { path: "/admin/audit", element: withSuspense(<AdminAuditPage />) },
                ],
            },
        ],
    },
]);
