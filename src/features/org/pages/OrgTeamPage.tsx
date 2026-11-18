import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, Button, Card, ConfirmDialog, Field, Input, PageHeader, Select, Table } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/core/api/errors";
import { orgApi, type Member } from "@/core/api/org";
import type { OrgRole } from "@/core/api/types";
import { formatDate, INVITATION_STATUS, ORG_ROLE_LABELS } from "@/core/labels";
import { useMembers } from "../hooks";

export default function OrgTeamPage() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const members = useMembers();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<OrgRole>("advisor");
    const [removing, setRemoving] = useState<Member | null>(null);
    const invitations = useQuery({
        queryKey: ["org", "invitations", "staff"],
        queryFn: () => orgApi.invitations({ kind: "staff", status: "pending" }).then((r) => r.data.data),
    });
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["org"] });
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));

    const invite = useMutation({
        mutationFn: () => orgApi.inviteStaff(email, role),
        onSuccess: () => {
            setEmail("");
            refresh();
            toast.success("Invitation envoyée");
        },
        onError,
    });
    const update = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: { orgRole?: OrgRole; isActive?: boolean } }) => orgApi.updateMember(id, payload),
        onSuccess: refresh,
        onError,
    });
    const remove = useMutation({
        mutationFn: (id: string) => orgApi.removeMember(id),
        onSuccess: () => {
            setRemoving(null);
            refresh();
        },
        onError,
    });

    return (
        <>
            <PageHeader title="Équipe RI" subtitle="Au moins un manager actif est toujours requis." />
            <Card title="Membres">
                <Table headers={["Nom", "Rôle", "Statut", "Depuis", ""]}>
                    {(members.data ?? []).map((m) => (
                        <tr key={m.id}>
                            <td className="px-3 py-3">
                                <p className="font-semibold">{m.name}{m.userId === user?.id && " (vous)"}</p>
                                <p className="text-xs text-gray-500">{m.email}</p>
                            </td>
                            <td className="px-3 py-3">
                                <Select
                                    aria-label={`Rôle de ${m.name}`}
                                    value={m.orgRole}
                                    onChange={(e) => update.mutate({ id: m.id, payload: { orgRole: e.target.value as OrgRole } })}
                                    className="w-44"
                                >
                                    {Object.entries(ORG_ROLE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                </Select>
                            </td>
                            <td className="px-3 py-3"><Badge tone={m.isActive ? "green" : "gray"}>{m.isActive ? "Actif" : "Désactivé"}</Badge></td>
                            <td className="px-3 py-3">{formatDate(m.createdAt)}</td>
                            <td className="space-x-1 px-3 py-3 text-right">
                                <Button variant="ghost" onClick={() => update.mutate({ id: m.id, payload: { isActive: !m.isActive } })}>
                                    {m.isActive ? "Désactiver" : "Réactiver"}
                                </Button>
                                <Button variant="ghost" onClick={() => setRemoving(m)}>Retirer</Button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Card title="Inviter un membre">
                    <form
                        className="space-y-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            invite.mutate();
                        }}
                    >
                        <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
                        <Field label="Rôle">
                            <Select value={role} onChange={(e) => setRole(e.target.value as OrgRole)}>
                                {Object.entries(ORG_ROLE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                            </Select>
                        </Field>
                        <Button type="submit" disabled={invite.isPending}>Envoyer l'invitation</Button>
                    </form>
                </Card>
                <Card title="Invitations en attente">
                    <ul className="space-y-2 text-sm">
                        {(invitations.data ?? []).map((i) => (
                            <li key={i.id} className="flex items-center justify-between">
                                <span>{i.email} · {i.orgRole ? ORG_ROLE_LABELS[i.orgRole] : ""}</span>
                                <Badge tone={INVITATION_STATUS[i.status].tone}>{INVITATION_STATUS[i.status].label}</Badge>
                            </li>
                        ))}
                        {invitations.data?.length === 0 && <li className="text-gray-500">Aucune.</li>}
                    </ul>
                </Card>
            </div>
            {removing && (
                <ConfirmDialog
                    title={`Retirer ${removing.name} ?`}
                    description="Le compte perd l'accès à l'espace établissement. Ses pays repassent « non affectés »."
                    expected={removing.email}
                    confirmLabel="Retirer"
                    pending={remove.isPending}
                    onConfirm={() => remove.mutate(removing.id)}
                    onClose={() => setRemoving(null)}
                />
            )}
        </>
    );
}
