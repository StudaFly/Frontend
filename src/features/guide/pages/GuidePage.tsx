import { useQuery } from "@tanstack/react-query";
import { Map } from "lucide-react";
import { getDestinationGuide } from "@/core/api/destinations";
import { getApiErrorMessage } from "@/core/api/errors";
import { useActiveMobility } from "@/core/hooks/useActiveMobility";
import { NoMobilityState } from "@/features/dashboard/components/NoMobilityState";
import { GuideContent } from "../components/GuideContent";

export default function GuidePage() {
    const { mobility, destination, isLoading, hasNoMobility } = useActiveMobility();
    const guide = useQuery({
        queryKey: ["guide", mobility?.destinationId],
        queryFn: async () => (await getDestinationGuide(mobility!.destinationId)).data.data,
        enabled: !!mobility,
        staleTime: 1000 * 60 * 60,
    });

    if (hasNoMobility) return <NoMobilityState message="Configure ta mobilité pour découvrir le guide de ta destination." />;

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50">
            <div className="bg-gradient-to-r from-primary-dark to-primary-light px-6 py-12 text-center text-white">
                <Map className="mx-auto mb-4 h-10 w-10 text-secondary" aria-hidden />
                <p className="text-sm text-white/70">Guide de destination</p>
                <h1 className="font-heading text-4xl font-bold">{destination?.city ?? "Guide"}</h1>
                {destination ? <p className="mt-1 text-white/80">{destination.country}</p> : null}
            </div>
            <div className="mx-auto max-w-3xl px-4 py-8">
                {isLoading || guide.isLoading ? (
                    <p className="text-center text-gray-400">Chargement du guide…</p>
                ) : guide.isError || !guide.data ? (
                    <p className="text-center text-red-500" role="alert">
                        {getApiErrorMessage(guide.error, "Pas encore de guide pour cette destination.")}
                    </p>
                ) : (
                    <GuideContent guide={guide.data} />
                )}
            </div>
        </div>
    );
}
