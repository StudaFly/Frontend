import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { withSuspense } from "./utils";

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
const BudgetSimulatorPage = lazy(() => import("@/features/budget/pages/BudgetSimulatorPage"));

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

            // Protected app routes
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/checklist", element: withSuspense(<ChecklistPage />) },
                    { path: "/timeline", element: withSuspense(<TimelinePage />) },
                    { path: "/profile", element: withSuspense(<ProfilePage />) },
                    { path: "/budget", element: withSuspense(<BudgetSimulatorPage />) },
                ],
            },
        ],
    },
]);
