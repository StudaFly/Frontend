import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, Button, Card, Field, Input, Modal, PageHeader, Pagination, Select, Table } from "@/components/ui";
import { adminApi } from "@/core/api/admin";
import { getApiErrorMessage } from "@/core/api/errors";
import { ORG_STATUS } from "@/core/labels";

function CreateOrganizationModal({ onClose }: { onClose: () => void }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", managerEmail: "", managerName: "" });
    const create = useMutation({
        mutationFn: () => adminApi.createOrganization({ name: form.name, manager: { email: form.managerEmail, name: form.managerName } }),
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ["admin"] });
            toast.success("Organisation créée : le manager a reçu son lien de création de mot de passe");
            navigate(`/admin/organizations/${data.data.id}`);
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
    });
    return (
        <Modal title="Nouvelle organisation" onClose={onClose}>
            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    create.mutate();
                }}
            >
                <Field label="Nom de l'école"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                <p className="text-sm text-gray-600">Premier manager (obligatoire : une organisation active a toujours un manager)</p>
                <Field label="Email du manager"><Input type="email" required value={form.managerEmail} onChange={(e) => setForm({ ...form, managerEmail: e.target.value })} /></Field>
                <Field label="Nom du manager"><Input required value={form.managerName} onChange={(e) => setForm({ ...form, managerName: e.target.value })} /></Field>
                <Button type="submit" disabled={create.isPending}>Créer</Button>
            </form>
        </Modal>
    );
}

export default function AdminOrganizationsPage() {
    const [params, setParams] = useState({ page: 1, q: "", status: "" });
    const [creating, setCreating] = useState(false);
    const organizations = useQuery({ queryKey: ["admin", "organizations", params], queryFn: () => adminApi.organizations({ ...params, perPage: 20 }).then((r) => r.data) });
    const set = (patch: Partial<typeof params>) => setParams((p) => ({ ...p, ...patch, page: patch.page ?? 1 }));
    return (
        <>
            <PageHeader title="Organisations" actions={<Button onClick={() => setCreating(true)}>Nouvelle organisation</Button>} />
            <Card>
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <Field label="Recherche"><Input value={params.q} onChange={(e) => set({ q: e.target.value })} /></Field>
                    <Field label="Statut">
                        <Select value={params.status} onChange={(e) => set({ status: e.target.value })}>
                            <option value="">Tous</option>
                            {Object.entries(ORG_STATUS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </Field>
                </div>
                <Table headers={["Organisation", "Statut", "Membres", "Étudiants", "Code"]}>
                    {(organizations.data?.data ?? []).map((o) => (
                        <tr key={o.id}>
                            <td className="px-3 py-3"><Link to={`/admin/organizations/${o.id}`} className="font-semibold text-primary-dark hover:underline">{o.name}</Link><p className="text-xs text-gray-500">{o.slug}</p></td>
                            <td className="px-3 py-3"><Badge tone={ORG_STATUS[o.status].tone}>{ORG_STATUS[o.status].label}</Badge></td>
                            <td className="px-3 py-3">{o.memberCount}</td>
                            <td className="px-3 py-3">{o.activeStudentCount}</td>
                            <td className="px-3 py-3 font-mono">{o.joinCode}</td>
                        </tr>
                    ))}
                </Table>
                {organizations.data && <Pagination page={params.page} total={organizations.data.total} perPage={organizations.data.perPage} onPage={(page) => set({ page })} />}
            </Card>
            {creating && <CreateOrganizationModal onClose={() => setCreating(false)} />}
        </>
    );
}
