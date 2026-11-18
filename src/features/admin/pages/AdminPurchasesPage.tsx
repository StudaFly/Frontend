import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, EmptyState, PageHeader, Pagination, Table } from "@/components/ui";
import { adminApi } from "@/core/api/admin";
import { formatDate, formatPrice } from "@/core/labels";

export default function AdminPurchasesPage() {
    const [page, setPage] = useState(1);
    const purchases = useQuery({ queryKey: ["admin", "purchases", page], queryFn: () => adminApi.purchases(page).then((r) => r.data) });
    return (
        <>
            <PageHeader title="Achats Premium" subtitle="Achats B2C (9,99 €, paiement unique). Un remboursement Stripe révoque l'achat." />
            <Card>
                {purchases.data?.data.length === 0 ? <EmptyState>Aucun achat pour l'instant.</EmptyState> : (
                    <Table headers={["Étudiant", "Montant", "Date", "Référence", "Statut"]}>
                        {(purchases.data?.data ?? []).map((p) => (
                            <tr key={p.id}>
                                <td className="px-3 py-3"><Link to={`/admin/users/${p.userId}`} className="font-semibold text-primary-dark hover:underline">{p.email}</Link></td>
                                <td className="px-3 py-3">{formatPrice(p.amountCents, p.currency ?? "EUR")}</td>
                                <td className="px-3 py-3">{formatDate(p.startsAt)}</td>
                                <td className="px-3 py-3 font-mono text-xs">{p.stripePaymentRef}</td>
                                <td className="px-3 py-3">{p.revokedAt ? <Badge tone="red">Remboursé / révoqué</Badge> : <Badge tone="green">Actif</Badge>}</td>
                            </tr>
                        ))}
                    </Table>
                )}
                {purchases.data && <Pagination page={page} total={purchases.data.total} perPage={purchases.data.perPage} onPage={setPage} />}
            </Card>
        </>
    );
}
