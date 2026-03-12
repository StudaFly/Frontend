import { Link } from 'react-router-dom';

export function DestinationNotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background-light">
            <h1 className="text-2xl font-bold text-primary-dark">Destination introuvable</h1>
            <Link to="/destinations" className="text-primary-dark hover:underline">
                ← Retour aux destinations
            </Link>
        </div>
    );
}
