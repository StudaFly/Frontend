import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function AuthLayout() {
    return (
        <div className="relative min-h-screen">
            {/* Back to home arrow */}
            <Link
                to="/"
                className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-dark"
            >
                <ArrowLeft size={16} />
                Accueil
            </Link>

            <Outlet />
        </div>
    );
}
