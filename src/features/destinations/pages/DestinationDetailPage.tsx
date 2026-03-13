import { useParams } from 'react-router-dom';
import { useDestination } from '../hooks/useDestination';
import { DestinationHero } from '../components/detail/DestinationHero';
import { DestinationStatsBar } from '../components/detail/DestinationStatsBar';
import { DestinationAboutCard } from '../components/detail/DestinationAboutCard';
import { DestinationStepsCard } from '../components/detail/DestinationStepsCard';
import { DestinationBudgetCard } from '../components/detail/DestinationBudgetCard';
import { DestinationOverviewCard } from '../components/detail/DestinationOverviewCard';
import { DestinationCtaButton } from '../components/detail/DestinationCtaButton';
import { DestinationNotFound } from '../components/detail/DestinationNotFound';

export default function DestinationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { destination, isLoading, error } = useDestination(id);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light">
                <p className="text-gray-400">Chargement…</p>
            </div>
        );
    }

    if (error || !destination) return <DestinationNotFound />;

    return (
        <div className="min-h-screen bg-background-light">
            <DestinationHero destination={destination} />
            <DestinationStatsBar destination={destination} />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <DestinationAboutCard destination={destination} />
                        <DestinationStepsCard destination={destination} />
                    </div>

                    <div className="space-y-6">
                        <DestinationBudgetCard destination={destination} />
                        <DestinationOverviewCard destination={destination} />
                        <DestinationCtaButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
