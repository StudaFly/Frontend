import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>{children}</Suspense>
);

// Composant inline temporaire pour la HomePage
function HomePage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-600 mb-4">
                    StudaFly
                </h1>
                <p className="text-gray-600">
                    Prépare ton départ à l'étranger, sereinement.
                </p>
            </div>
        </div>
    );
}

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
            { path: "/register", element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
        ],
    },
    {
        element: <AppLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/profile", element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper> },
        ],
    },
]);
