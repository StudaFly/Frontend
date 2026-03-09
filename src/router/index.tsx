import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { withSuspense } from "./utils";

// Lazy-loaded pages
const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
const DestinationsPage = lazy(() => import("@/features/destinations/pages/DestinationsPage"));
const AboutPage = lazy(() => import("@/features/about/pages/AboutPage"));

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
        // App routes (authenticated)
        element: <AppLayout />,
        children: [
            { path: "/", element: withSuspense(<HomePage />) },
            { path: "/destinations", element: withSuspense(<DestinationsPage />) },
            { path: "/about", element: withSuspense(<AboutPage />) },
            { path: "/profile", element: withSuspense(<ProfilePage />) },
        ],
    },
]);
