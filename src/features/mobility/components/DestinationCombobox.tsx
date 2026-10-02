import { useEffect, useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, MapPin, Search } from "lucide-react";
import { getDestinations, type Destination } from "@/core/api/destinations";

interface DestinationComboboxProps {
    selected: Destination | null;
    onSelect: (destination: Destination | null) => void;
}

const MAX_SUGGESTIONS = 8;

/** Destination search restricted to the destinations known by the backend. */
export function DestinationCombobox({ selected, onSelect }: DestinationComboboxProps) {
    const listId = useId();
    const [query, setQuery] = useState(selected ? `${selected.city}, ${selected.country}` : "");
    const [debounced, setDebounced] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(query.trim()), 250);
        return () => clearTimeout(timer);
    }, [query]);

    const search = useQuery({
        queryKey: ["destinations", selected ? "" : debounced],
        queryFn: async () => (await getDestinations(debounced || undefined)).data.data,
        enabled: !selected,
        staleTime: 1000 * 60 * 10,
    });
    const suggestions = (search.data ?? []).slice(0, MAX_SUGGESTIONS);

    return (
        <div className="space-y-3">
            <label htmlFor={`${listId}-input`} className="sr-only">
                Rechercher une destination
            </label>
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden />
                <input
                    id={`${listId}-input`}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (selected) onSelect(null);
                    }}
                    placeholder="ex : Barcelone, Berlin, Lisbonne…"
                    autoComplete="off"
                    aria-controls={listId}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                />
            </div>

            {selected ? (
                <p className="flex items-center gap-2 text-sm font-medium text-green-600" role="status">
                    <Check className="h-4 w-4" aria-hidden /> {selected.city}, {selected.country} sélectionnée
                </p>
            ) : search.isLoading ? (
                <p className="text-sm text-gray-500">Recherche…</p>
            ) : search.isError ? (
                <p className="text-sm text-red-600">Impossible de charger les destinations.</p>
            ) : suggestions.length === 0 ? (
                <p className="text-sm text-gray-500">
                    Aucune destination trouvée. StudaFly couvre pour l'instant une sélection de villes européennes.
                </p>
            ) : (
                <ul id={listId} className="grid gap-2 sm:grid-cols-2" aria-label="Destinations proposées">
                    {suggestions.map((destination) => (
                        <li key={destination.id}>
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery(`${destination.city}, ${destination.country}`);
                                    onSelect(destination);
                                }}
                                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-secondary hover:bg-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                            >
                                <MapPin className="h-4 w-4 text-secondary" aria-hidden />
                                <span className="font-semibold text-primary-dark">{destination.city}</span>
                                <span className="text-sm text-gray-500">{destination.country}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
