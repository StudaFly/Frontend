import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, Field, PageHeader, Select, Table } from "@/components/ui";
import { adminApi } from "@/core/api/admin";
import { CONTRACT_STATUS, formatDate, formatPrice } from "@/core/labels";

export default function AdminContractsPage() {
    const [expiring, setExpiring] = useState("");
    const [status, setStatus] = useState("");
    const contracts = useQuery({
        queryKey: ["admin", "contracts", "all", expiring, status],
        queryFn: () => adminApi.contracts({ expiringWithin: expiring || undefined, status: status || undefined, perPage: 100 }).then((r) => r.data),
    });
    const organizations = useQuery({ queryKey: ["admin", "organizations", "all"], queryFn: () => adminApi.organizations({ perPage: 100 }).then((r) => r.data.data) });
    const nameOf = (id: string) => organizations.data?.find((o) => o.id === id)?.name ?? id.slice(0, 8);
    return (
        <>
            <PageHeader title="Contrats" subtitle="Facturation B2B manuelle : StudaFly saisit les contrats signés." />
            <Card>
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <Field label="Expire dans">
                        <Select value={expiring} onChange={(e) => setExpiring(e.target.value)}>
                            <option value="">Peu importe</option>
                            <option value="30">30 jours</option>
                            <option value="90">90 jours</option>
                        </Select>
                    </Field>
                    <Field label="Statut">
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Tous</option>
                            {Object.entries(CONTRACT_STATUS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </Field>
                </div>
                <Table headers={["Organisation", "Formule", "Statut", "Fin", "Prix", "Quota"]}>
                    {(contracts.data?.data ?? []).map((c) => (
                        <tr key={c.id}>
                            <td className="px-3 py-3"><Link to={`/admin/organizations/${c.organizationId}`} className="font-semibold text-primary-dark hover:underline">{nameOf(c.organizationId)}</Link></td>
                            <td className="px-3 py-3">{c.plan}</td>
                            <td className="px-3 py-3"><Badge tone={CONTRACT_STATUS[c.status].tone}>{CONTRACT_STATUS[c.status].label}</Badge></td>
                            <td className="px-3 py-3">{formatDate(c.endDate)}</td>
                            <td className="px-3 py-3">{formatPrice(c.priceCents, c.currency)}</td>
                            <td className="px-3 py-3">{c.studentQuota ?? "∞"}</td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </>
    );
}
