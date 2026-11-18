import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
            <Compass className="h-12 w-12 text-primary-light" aria-hidden />
            <h1 className="mt-4 font-heading text-2xl font-bold text-primary-dark">Page introuvable (404)</h1>
            <p className="mt-2 max-w-md text-gray-600">Cette page n'existe pas ou n'est plus disponible.</p>
            <Link to="/" className="mt-6 rounded-lg bg-primary-light px-5 py-3 font-semibold text-white hover:bg-primary">
                Retour à l'accueil
            </Link>
        </div>
    );
}
