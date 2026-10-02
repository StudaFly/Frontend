import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

export function NoMobilityState({ message }: { message: string }) {
    return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
            <Plane className="h-12 w-12 text-secondary" aria-hidden />
            <h1 className="font-heading text-2xl font-bold text-primary-dark">Aucune mobilité configurée</h1>
            <p className="text-gray-600">{message}</p>
            <Link
                to="/mobility/new"
                className="rounded-lg bg-secondary px-6 py-3 font-bold text-primary-dark transition-colors hover:bg-secondary/80"
            >
                Créer ma mobilité
            </Link>
        </div>
    );
}
