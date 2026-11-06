import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, Button, Card, Field, Input, Modal, PageHeader, Pagination, Select, Table } from "@/components/ui";
import { adminApi } from "@/core/api/admin";
import { getApiErrorMessage } from "@/core/api/errors";
import type { OrgRole } from "@/core/api/types";
import { ACCOUNT_TYPE_LABELS, formatDate, ORG_ROLE_LABELS, USER_STATUS } from "@/core/labels";

function CreateUserModal({ onClose }: { onClose: () => void }) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ email: "", name: "", accountType: "student" as "student" | "org_staff", organizationId: "", orgRole: "advisor" as OrgRole });
    const organizations = useQuery({ queryKey: ["admin", "organizations", "all"], queryFn: () => adminApi.organizations({ perPage: 100 }).then((r) => r.data.data) });
    const create = useMutation({
        mutationFn: () =>
            adminApi.createUser({
                email: form.email,
                name: form.name,
                accountType: form.accountType,
                organizationId: form.organizationId || undefined,
                orgRole: form.accountType === "org_staff" ? form.orgRole : undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin"] });
            toast.success("Compte créé : un lien de création de mot de passe a été envoyé");
            onClose();
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
    });
    return (
        <Modal title="Créer un compte" onClose={onClose}>
            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    create.mutate();
                }}
            >
                <Field label="Email"><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                <Field label="Nom"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                <Field label="Type de compte" hint="Un admin plateforme ne se crée qu'en ligne de commande.">
                    <Select value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value as "student" | "org_staff" })}>
                        <option value="student">Étudiant</option>
                        <option value="org_staff">Personnel RI</option>
                    </Select>
                </Field>
                <Field label={form.accountType === "org_staff" ? "Organisation (obligatoire)" : "Organisation (optionnelle)"}>
                    <Select value={form.organizationId} required={form.accountType === "org_staff"} onChange={(e) => setForm({ ...form, organizationId: e.target.value })}>
                        <option value="">—</option>
                        {(organizations.data ?? []).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </Select>
                </Field>
                {form.accountType === "org_staff" && (
                    <Field label="Rôle">
                        <Select value={form.orgRole} onChange={(e) => setForm({ ...form, orgRole: e.target.value as OrgRole })}>
                            {Object.entries(ORG_ROLE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </Field>
                )}
                <Button type="submit" disabled={create.isPending}>Créer</Button>
            </form>
        </Modal>
    );
}

export default function AdminUsersPage() {
    const [params, setParams] = useState({ page: 1, q: "", accountType: "", status: "" });
    const [creating, setCreating] = useState(false);
    const users = useQuery({ queryKey: ["admin", "users", params], queryFn: () => adminApi.users({ ...params, perPage: 20 }).then((r) => r.data) });
    const set = (patch: Partial<typeof params>) => setParams((p) => ({ ...p, ...patch, page: patch.page ?? 1 }));

    return (
        <>
            <PageHeader title="Utilisateurs" actions={<Button onClick={() => setCreating(true)}>Créer un compte</Button>} />
            <Card>
                <div className="mb-4 grid gap-3 sm:grid-cols-3">
                    <Field label="Recherche"><Input placeholder="Nom ou email" value={params.q} onChange={(e) => set({ q: e.target.value })} /></Field>
                    <Field label="Type">
                        <Select value={params.accountType} onChange={(e) => set({ accountType: e.target.value })}>
                            <option value="">Tous</option>
                            {Object.entries(ACCOUNT_TYPE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </Field>
                    <Field label="Statut">
                        <Select value={params.status} onChange={(e) => set({ status: e.target.value })}>
                            <option value="">Tous</option>
                            {Object.entries(USER_STATUS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </Field>
                </div>
                <Table headers={["Utilisateur", "Type", "Organisation", "Statut", "Premium", "Créé le"]}>
                    {(users.data?.data ?? []).map((u) => (
                        <tr key={u.id}>
                            <td className="px-3 py-3">
                                <Link to={`/admin/users/${u.id}`} className="font-semibold text-primary-dark hover:underline">{u.name}</Link>
                                <p className="text-xs text-gray-500">{u.email}</p>
                            </td>
                            <td className="px-3 py-3">{ACCOUNT_TYPE_LABELS[u.accountType]}{u.orgRole && ` · ${ORG_ROLE_LABELS[u.orgRole]}`}</td>
                            <td className="px-3 py-3">{u.organization?.name ?? "—"}</td>
                            <td className="px-3 py-3"><Badge tone={USER_STATUS[u.status].tone}>{USER_STATUS[u.status].label}</Badge></td>
                            <td className="px-3 py-3">{u.premium.active ? <Badge tone="gold">{u.premium.source}</Badge> : "—"}</td>
                            <td className="px-3 py-3">{formatDate(u.createdAt)}</td>
                        </tr>
                    ))}
                </Table>
                {users.data && <Pagination page={params.page} total={users.data.total} perPage={users.data.perPage} onPage={(page) => set({ page })} />}
            </Card>
            {creating && <CreateUserModal onClose={() => setCreating(false)} />}
        </>
    );
}
