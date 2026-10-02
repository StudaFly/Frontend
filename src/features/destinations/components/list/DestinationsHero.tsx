import { Search, Globe } from "lucide-react";

interface DestinationsHeroProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export function DestinationsHero({ searchTerm, onSearchChange }: DestinationsHeroProps) {
    return (
        <div className="bg-gradient-to-br from-primary-dark to-primary-light py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <Globe className="mx-auto mb-6 h-16 w-16 text-secondary" />
                <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
                    Découvrez <span className="text-secondary">le Monde</span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
                    Explorez nos destinations étudiantes et trouvez celle qui correspond
                    parfaitement à vos rêves de mobilité internationale.
                </p>

                {/* Search bar */}
                <div className="relative mx-auto max-w-md">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Rechercher un pays ou une ville..."
                        className="w-full rounded-xl border-2 border-transparent bg-white py-4 pl-12 pr-4 text-gray-900 shadow-lg outline-none transition-all focus:border-secondary focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
