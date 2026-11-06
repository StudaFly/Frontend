import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { homePath } from "@/core/auth/home";

export default function ForbiddenPage() {
    const { user, mfaVerified } = useAuth();
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
            <ShieldOff className="h-12 w-12 text-primary-light" aria-hidden />
            <h1 className="mt-4 font-heading text-2xl font-bold text-primary-dark">Accès refusé (403)</h1>
            <p className="mt-2 max-w-md text-gray-600">Ton compte n'a pas accès à cette page.</p>
            <Link to={homePath(user, mfaVerified)} className="mt-6 rounded-lg bg-primary-light px-5 py-3 font-semibold text-white hover:bg-primary">
                Retour à mon espace
            </Link>
        </div>
    );
}
