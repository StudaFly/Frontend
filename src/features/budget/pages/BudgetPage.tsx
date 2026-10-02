import { useQuery } from "@tanstack/react-query";
import { Wallet } from "lucide-react";
import { getDestinationBudget } from "@/core/api/destinations";
import { getApiErrorMessage } from "@/core/api/errors";
import { useActiveMobility } from "@/core/hooks/useActiveMobility";
import { NoMobilityState } from "@/features/dashboard/components/NoMobilityState";
import { BudgetBreakdown } from "../components/BudgetBreakdown";

export default function BudgetPage() {
    const { mobility, destination, isLoading, hasNoMobility } = useActiveMobility();
    const budget = useQuery({
        queryKey: ["budget", mobility?.destinationId],
        queryFn: async () => (await getDestinationBudget(mobility!.destinationId)).data.data,
        enabled: !!mobility,
    });

    if (hasNoMobility) return <NoMobilityState message="Configure ta mobilité pour estimer ton budget sur place." />;

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50">
            <div className="bg-gradient-to-r from-primary-dark to-primary-light px-6 py-12 text-center text-white">
                <Wallet className="mx-auto mb-4 h-10 w-10 text-secondary" aria-hidden />
                <h1 className="font-heading text-4xl font-bold">Simulateur budget</h1>
                <p className="mt-2 text-white/80">{destination ? `${destination.city} · données de référence` : " "}</p>
            </div>
            <div className="mx-auto max-w-3xl px-4 py-8">
                {isLoading || budget.isLoading ? (
                    <p className="text-center text-gray-400">Chargement du budget…</p>
                ) : budget.isError || !budget.data ? (
                    <p className="text-center text-red-500" role="alert">
                        {getApiErrorMessage(budget.error, "Pas encore d'estimation pour cette destination.")}
                    </p>
                ) : (
                    <BudgetBreakdown budget={budget.data} months={mobility?.stayMonths} />
                )}
            </div>
        </div>
    );
}
