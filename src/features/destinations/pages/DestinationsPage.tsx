import { useDestinations } from '../hooks/useDestinations';
import { DestinationsHero } from '../components/list/DestinationsHero';
import { DestinationsList } from '../components/list/DestinationsList';

export default function DestinationsPage() {
    const { searchTerm, setSearchTerm, destinations, isLoading, error } = useDestinations();

    return (
        <div className="min-h-screen bg-background-light">
            <DestinationsHero searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <DestinationsList
                destinations={destinations}
                isLoading={isLoading}
                error={error}
                onReset={() => setSearchTerm('')}
            />
        </div>
    );
}
