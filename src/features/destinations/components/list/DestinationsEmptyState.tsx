import { Globe } from "lucide-react";

interface DestinationsEmptyStateProps {
    onReset: () => void;
}

export function DestinationsEmptyState({ onReset }: DestinationsEmptyStateProps) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
            <Globe className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-xl font-bold text-gray-900">Aucune destination trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
            <button
                onClick={onReset}
                className="mt-6 rounded-lg bg-secondary px-6 py-2 font-semibold text-primary-dark transition-colors hover:bg-secondary/80"
            >
                Réinitialiser la recherche
            </button>
        </div>
    );
}
