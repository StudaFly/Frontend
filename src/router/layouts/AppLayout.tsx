import { Outlet, ScrollRestoration } from "react-router-dom";
import { Navbar } from "@/components/shared/Navbar";
import { ApiStatusBanner } from "@/components/shared/ApiStatusBanner";

export function AppLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background-light">
            <ScrollRestoration />
            <ApiStatusBanner />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

