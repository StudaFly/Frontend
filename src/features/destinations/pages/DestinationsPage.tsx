import { useState } from "react";
import { countries } from "../data/countries";
import { DestinationsHero } from "../components/list/DestinationsHero";
import { DestinationCard } from "../components/list/DestinationCard";
import { DestinationsEmptyState } from "../components/list/DestinationsEmptyState";

export default function DestinationsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCountries = countries.filter(
        (country) =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background-light">
            <DestinationsHero searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="mb-10 text-2xl font-bold text-primary-dark md:text-3xl">
                    Toutes les destinations ({filteredCountries.length})
                </h2>

                {filteredCountries.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCountries.map((destination) => (
                            <DestinationCard key={destination.slug} destination={destination} />
                        ))}
                    </div>
                ) : (
                    <DestinationsEmptyState onReset={() => setSearchTerm("")} />
                )}
            </div>
        </div>
    );
}
