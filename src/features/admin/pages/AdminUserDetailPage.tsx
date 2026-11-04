import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, Button, Card, ConfirmDialog, Field, Input, PageHeader, Table } from "@/components/ui";
import { PageLoader } from "@/components/shared/PageLoader";
import { adminApi } from "@/core/api/admin";
import { getApiErrorMessage } from "@/core/api/errors";
import { ACCOUNT_TYPE_LABELS, formatDate, ORG_ROLE_LABELS, USER_STATUS } from "@/core/labels";

type Action = "suspend" | "delete" | { revoke: string } | null;

export default function AdminUserDetailPage() {
    const { id = "" } = useParams();
    const queryClient = useQueryClient();
    const [action, setAction] = useState<Action>(null);
    const [grantReason, setGrantReason] = useState("");
    const [grantEnd, setGrantEnd] = useState("");
    const user = useQuery({ queryKey: ["admin", "user", id], queryFn: () => adminApi.user(id).then((r) => r.data.data) });
    const done = (message: string) => () => {
        queryClient.invalidateQueries({ queryKey: ["admin"] });
        setAction(null);
        toast.success(message);
    };
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));
    const suspend = useMutation({ mutationFn: (reason: string) => adminApi.suspendUser(id, reason), onSuccess: done("Compte suspendu"), onError });
    const reactivate = useMutation({ mutationFn: () => adminApi.reactivateUser(id), onSuccess: done("Compte réactivé"), onError });
    const remove = useMutation({ mutationFn: () => adminApi.deleteUser(id), onSuccess: done("Suppression programmée dans 30 jours"), onError });
    const grant = useMutation({
        mutationFn: () => adminApi.grantPremium(id, grantReason, grantEnd ? new Date(`${grantEnd}T23:59:59`).toISOString() : undefined),
        onSuccess: () => {
            setGrantReason("");
            setGrantEnd("");
            done("Premium accordé")();
        },
        onError,
    });
    const revoke = useMutation({
        mutationFn: ({ grantId, reason }: { grantId: string; reason: string }) => adminApi.revokePremium(id, grantId, reason),
        onSuccess: done("Premium retiré"),
        onError,
    });

    if (!user.data) return <PageLoader />;
    const u = user.data;
    const isAdmin = u.accountType === "platform_admin";

    return (
        <>
            <PageHeader
                title={u.name}
                subtitle={<>{u.email} · {ACCOUNT_TYPE_LABELS[u.accountType]}{u.orgRole && ` (${ORG_ROLE_LABELS[u.orgRole]})`}{u.organization && ` · ${u.organization.name}`}</>}
                actions={
                    !isAdmin && (
                        <div className="flex flex-wrap gap-2">
                            {u.status === "active" ? (
                                <Button variant="outline" onClick={() => setAction("suspend")}>Suspendre</Button>
                            ) : (
                                <Button variant="outline" onClick={() => reactivate.mutate()}>
                                    {u.status === "pending_deletion" ? "Annuler la suppression" : "Réactiver"}
                                </Button>
                            )}
                            {u.status !== "pending_deletion" && <Button variant="danger" onClick={() => setAction("delete")}>Supprimer</Button>}
                        </div>
                    )
                }
            />
            {isAdmin && <p className="mb-4 rounded-lg bg-amber-100 p-3 text-sm text-amber-900">Les admins plateforme se gèrent uniquement en ligne de commande.</p>}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Compte">
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                        <dt className="text-gray-500">Statut</dt><dd><Badge tone={USER_STATUS[u.status].tone}>{USER_STATUS[u.status].label}</Badge></dd>
                        {u.suspendedReason && <><dt className="text-gray-500">Motif</dt><dd>{u.suspendedReason}</dd></>}
                        {u.deletionScheduledAt && <><dt className="text-gray-500">Purge prévue</dt><dd>{formatDate(u.deletionScheduledAt)}</dd></>}
                        <dt className="text-gray-500">MFA</dt><dd>{u.mfaEnabled ? "Activée" : "—"}</dd>
                        <dt className="text-gray-500">Dernière connexion</dt><dd>{formatDate(u.lastLoginAt)}</dd>
                        <dt className="text-gray-500">Créé le</dt><dd>{formatDate(u.createdAt)}</dd>
                    </dl>
                </Card>
                <Card title="Premium">
                    <p className="mb-3 text-sm">{u.premium.active ? <>Actif ({u.premium.source}){u.premium.until && ` jusqu'au ${formatDate(u.premium.until)}`}</> : "Inactif"}</p>
                    <ul className="mb-4 space-y-2 text-sm">
                        {u.premiumGrants.map((g) => (
                            <li key={g.id} className="flex items-center justify-between gap-2 rounded-lg bg-background-light px-3 py-2">
                                <span>{g.source === "purchase" ? "Achat" : "Offert"} · {formatDate(g.startsAt)}{g.endsAt && ` → ${formatDate(g.endsAt)}`}{g.revokedAt && " · révoqué"}</span>
                                {!g.revokedAt && <Button variant="ghost" onClick={() => setAction({ revoke: g.id })}>Retirer</Button>}
                            </li>
                        ))}
                    </ul>
                    {u.accountType === "student" && (
                        <form
                            className="grid gap-2 sm:grid-cols-[1fr_10rem_auto] sm:items-end"
                            onSubmit={(e) => {
                                e.preventDefault();
                                grant.mutate();
                            }}
                        >
                            <Field label="Motif"><Input value={grantReason} onChange={(e) => setGrantReason(e.target.value)} required minLength={3} /></Field>
                            <Field label="Fin (optionnelle)"><Input type="date" value={grantEnd} onChange={(e) => setGrantEnd(e.target.value)} /></Field>
                            <Button type="submit" disabled={grant.isPending}>Offrir</Button>
                        </form>
                    )}
                </Card>
            </div>
            <Card title="Mobilités" className="mt-6">
                <p className="mb-2 text-xs text-gray-500">Le contenu des documents n'est jamais accessible, même aux admins.</p>
                <Table headers={["Destination", "Type", "Statut", "Départ", "Retour"]}>
                    {u.mobilities.map((m) => (
                        <tr key={m.id}>
                            <td className="px-3 py-2">{m.city}, {m.country}</td>
                            <td className="px-3 py-2">{m.type}</td>
                            <td className="px-3 py-2">{m.status}</td>
                            <td className="px-3 py-2">{formatDate(m.departureDate)}</td>
                            <td className="px-3 py-2">{formatDate(m.returnDate)}</td>
                        </tr>
                    ))}
                </Table>
            </Card>
            {action === "suspend" && (
                <ConfirmDialog title="Suspendre le compte" description="Toutes les sessions sont coupées immédiatement. Réversible." expected={u.email} askReason confirmLabel="Suspendre" pending={suspend.isPending} onConfirm={(reason) => suspend.mutate(reason)} onClose={() => setAction(null)} />
            )}
            {action === "delete" && (
                <ConfirmDialog title="Supprimer le compte" description="Le compte est bloqué tout de suite et purgé définitivement dans 30 jours (annulable d'ici là)." expected={u.email} confirmLabel="Programmer la suppression" pending={remove.isPending} onConfirm={() => remove.mutate()} onClose={() => setAction(null)} />
            )}
            {action && typeof action === "object" && (
                <ConfirmDialog title="Retirer le Premium" description="L'octroi est révoqué immédiatement." askReason confirmLabel="Retirer" pending={revoke.isPending} onConfirm={(reason) => revoke.mutate({ grantId: action.revoke, reason })} onClose={() => setAction(null)} />
            )}
        </>
    );
}
