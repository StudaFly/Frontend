import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/shared/Navbar";

export function AuthLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background-light">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
