import { useQuery } from "@tanstack/react-query";
import { Card, PageHeader, Stat } from "@/components/ui";
import { adminApi } from "@/core/api/admin";
import { ACCOUNT_TYPE_LABELS, CONTRACT_STATUS, ORG_STATUS, USER_STATUS } from "@/core/labels";

function Breakdown({ title, values, labels }: { title: string; values: Record<string, number>; labels: Record<string, string | { label: string }> }) {
    return (
        <Card title={title}>
            <ul className="space-y-1 text-sm">
                {Object.entries(values).map(([key, n]) => {
                    const label = labels[key];
                    return (
                        <li key={key} className="flex justify-between">
                            <span>{typeof label === "string" ? label : label?.label ?? key}</span>
                            <span className="font-semibold">{n}</span>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}

export default function AdminOverviewPage() {
    const overview = useQuery({ queryKey: ["admin", "overview"], queryFn: () => adminApi.overview().then((r) => r.data.data) });
    const data = overview.data;
    if (!data) return null;
    return (
        <>
            <PageHeader title="Vue d'ensemble" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Stat label="Utilisateurs" value={data.users.total} />
                <Stat label="Organisations" value={data.organizations.total} />
                <Stat label="Contrats" value={data.contracts.total} />
                <Stat label="Premium (achats / offerts)" value={`${data.activePremiumGrants.purchase} / ${data.activePremiumGrants.adminGrant}`} />
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Breakdown title="Par type de compte" values={data.users.byAccountType} labels={ACCOUNT_TYPE_LABELS} />
                <Breakdown title="Par statut" values={data.users.byStatus} labels={USER_STATUS} />
                <Breakdown title="Organisations" values={data.organizations.byStatus} labels={ORG_STATUS} />
                <Breakdown title="Contrats" values={data.contracts.byStatus} labels={CONTRACT_STATUS} />
            </div>
        </>
    );
}
