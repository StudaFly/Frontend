import { useQuery } from "@tanstack/react-query";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { orgApi } from "@/core/api/org";
import { CONTRACT_STATUS, formatDate, formatPrice } from "@/core/labels";

const STATE_LABELS = { none: "Aucun contrat", current: "En cours", read_only: "Expiré : lecture seule", blocked: "Suspendu ou résilié" };

export default function OrgContractPage() {
    const contract = useQuery({ queryKey: ["org", "contract"], queryFn: () => orgApi.contract().then((r) => r.data.data) });
    const data = contract.data;
    return (
        <>
            <PageHeader title="Contrat" subtitle="Consultation seule : contactez StudaFly pour toute modification." />
            <Card title={data ? STATE_LABELS[data.state] : "…"}>
                {!data?.contract ? (
                    <EmptyState>Aucun contrat enregistré pour l'établissement.</EmptyState>
                ) : (
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                        <div><dt className="text-gray-500">Formule</dt><dd className="font-semibold">{data.contract.plan}</dd></div>
                        <div><dt className="text-gray-500">Statut</dt><dd><Badge tone={CONTRACT_STATUS[data.contract.status]?.tone}>{CONTRACT_STATUS[data.contract.status]?.label}</Badge></dd></div>
                        <div><dt className="text-gray-500">Période</dt><dd className="font-semibold">{formatDate(data.contract.startDate)} → {formatDate(data.contract.endDate)}</dd></div>
                        <div><dt className="text-gray-500">Prix</dt><dd className="font-semibold">{formatPrice(data.contract.priceCents, data.contract.currency)}</dd></div>
                        <div><dt className="text-gray-500">Étudiants rattachés</dt><dd className="font-semibold">{data.activeStudents}{data.contract.studentQuota ? ` / ${data.contract.studentQuota}` : " (illimité)"}</dd></div>
                    </dl>
                )}
            </Card>
        </>
    );
}
