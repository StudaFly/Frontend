import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, Button, Card, ConfirmDialog, EmptyState, Field, Input, PageHeader, Select, Table } from "@/components/ui";
import { AuditTable } from "@/components/shared/AuditTable";
import { PageLoader } from "@/components/shared/PageLoader";
import { adminApi, type ContractStatus } from "@/core/api/admin";
import { getApiErrorMessage } from "@/core/api/errors";
import type { OrgRole } from "@/core/api/types";
import { CONTRACT_STATUS, formatDate, formatPrice, ORG_ROLE_LABELS, ORG_STATUS } from "@/core/labels";

const TABS = ["Infos", "Équipe", "Étudiants", "Contrats", "Journal"] as const;
type Tab = (typeof TABS)[number];

export default function AdminOrganizationDetailPage() {
    const { id = "" } = useParams();
    const queryClient = useQueryClient();
    const [tab, setTab] = useState<Tab>("Infos");
    const [confirm, setConfirm] = useState<"suspend" | "archive" | null>(null);
    const organization = useQuery({ queryKey: ["admin", "organization", id], queryFn: () => adminApi.organization(id).then((r) => r.data.data) });
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin"] });
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));
    const status = useMutation({
        mutationFn: (action: "suspend" | "reactivate" | "archive") => adminApi.setOrganizationStatus(id, action),
        onSuccess: () => {
            setConfirm(null);
            refresh();
            toast.success("Statut mis à jour");
        },
        onError,
    });

    if (!organization.data) return <PageLoader />;
    const o = organization.data;

    return (
        <>
            <PageHeader
                title={o.name}
                subtitle={<>Code d'école <span className="font-mono">{o.joinCode}</span> · {o.memberCount} membres · {o.activeStudentCount} étudiants</>}
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={ORG_STATUS[o.status].tone}>{ORG_STATUS[o.status].label}</Badge>
                        {o.status === "active" && <Button variant="outline" onClick={() => setConfirm("suspend")}>Suspendre</Button>}
                        {o.status !== "active" && <Button variant="outline" onClick={() => status.mutate("reactivate")}>Réactiver</Button>}
                        {o.status !== "archived" && <Button variant="danger" onClick={() => setConfirm("archive")}>Archiver</Button>}
                    </div>
                }
            />
            <div role="tablist" className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-200">
                {TABS.map((t) => (
                    <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`min-h-[44px] px-4 text-sm font-semibold ${tab === t ? "border-b-2 border-primary-light text-primary-dark" : "text-gray-500"}`}>
                        {t}
                    </button>
                ))}
            </div>
            {tab === "Infos" && <InfoTab id={id} name={o.name} slug={o.slug} color={o.branding?.primary_color ?? "#33518A"} />}
            {tab === "Équipe" && <TeamTab id={id} />}
            {tab === "Étudiants" && <StudentsTab id={id} />}
            {tab === "Contrats" && <ContractsTab id={id} />}
            {tab === "Journal" && <JournalTab id={id} />}
            {confirm && (
                <ConfirmDialog
                    title={confirm === "suspend" ? "Suspendre l'organisation" : "Archiver l'organisation"}
                    description={
                        confirm === "suspend"
                            ? "L'équipe RI perd l'accès à son espace. Réversible."
                            : "Les rattachements sont révoqués et l'équipe est désactivée. Les étudiants gardent leur Premium jusqu'à la fin de leur mobilité en cours."
                    }
                    expected={o.name}
                    confirmLabel={confirm === "suspend" ? "Suspendre" : "Archiver"}
                    pending={status.isPending}
                    onConfirm={() => status.mutate(confirm)}
                    onClose={() => setConfirm(null)}
                />
            )}
        </>
    );
}

function InfoTab({ id, name, slug, color }: { id: string; name: string; slug: string; color: string }) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ name, slug, color });
    const save = useMutation({
        mutationFn: () => adminApi.updateOrganization(id, { name: form.name, slug: form.slug, branding: { primary_color: form.color } }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin"] });
            toast.success("Organisation mise à jour");
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
    });
    return (
        <Card>
            <form className="grid gap-3 sm:grid-cols-3" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
                <Field label="Nom"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
                <Field label="Couleur"><Input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></Field>
                <div><Button type="submit" disabled={save.isPending}>Enregistrer</Button></div>
            </form>
        </Card>
    );
}

function TeamTab({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ email: "", name: "", orgRole: "advisor" as OrgRole });
    const members = useQuery({ queryKey: ["admin", "members", id], queryFn: () => adminApi.members(id).then((r) => r.data.data) });
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin"] });
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));
    const add = useMutation({ mutationFn: () => adminApi.addMember(id, form), onSuccess: () => { setForm({ email: "", name: "", orgRole: "advisor" }); refresh(); }, onError });
    const update = useMutation({ mutationFn: ({ memberId, payload }: { memberId: string; payload: { orgRole?: OrgRole; isActive?: boolean } }) => adminApi.updateMember(id, memberId, payload), onSuccess: refresh, onError });
    const remove = useMutation({ mutationFn: (memberId: string) => adminApi.removeMember(id, memberId), onSuccess: refresh, onError });
    return (
        <div className="space-y-6">
            <Card title="Membres">
                <Table headers={["Nom", "Rôle", "Statut", ""]}>
                    {(members.data ?? []).map((m) => (
                        <tr key={m.id}>
                            <td className="px-3 py-3"><p className="font-semibold">{m.name}</p><p className="text-xs text-gray-500">{m.email}</p></td>
                            <td className="px-3 py-3">
                                <Select aria-label={`Rôle de ${m.name}`} value={m.orgRole} onChange={(e) => update.mutate({ memberId: m.id, payload: { orgRole: e.target.value as OrgRole } })} className="w-44">
                                    {Object.entries(ORG_ROLE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                </Select>
                            </td>
                            <td className="px-3 py-3"><Badge tone={m.isActive ? "green" : "gray"}>{m.isActive ? "Actif" : "Désactivé"}</Badge></td>
                            <td className="space-x-1 px-3 py-3 text-right">
                                <Button variant="ghost" onClick={() => update.mutate({ memberId: m.id, payload: { isActive: !m.isActive } })}>{m.isActive ? "Désactiver" : "Réactiver"}</Button>
                                <Button variant="ghost" onClick={() => window.confirm(`Retirer ${m.name} ?`) && remove.mutate(m.id)}>Retirer</Button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
            <Card title="Ajouter un membre">
                <form className="grid gap-3 sm:grid-cols-4 sm:items-end" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
                    <Field label="Email"><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                    <Field label="Nom"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                    <Field label="Rôle">
                        <Select value={form.orgRole} onChange={(e) => setForm({ ...form, orgRole: e.target.value as OrgRole })}>
                            {Object.entries(ORG_ROLE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </Field>
                    <Button type="submit" disabled={add.isPending}>Ajouter</Button>
                </form>
            </Card>
        </div>
    );
}

function StudentsTab({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState("active");
    const [search, setSearch] = useState("");
    const enrollments = useQuery({ queryKey: ["admin", "enrollments", id, status], queryFn: () => adminApi.enrollments(id, status).then((r) => r.data.data) });
    const candidates = useQuery({
        queryKey: ["admin", "users", "candidates", search],
        queryFn: () => adminApi.users({ q: search, accountType: "student", perPage: 5 }).then((r) => r.data.data),
        enabled: search.length >= 2,
    });
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin"] });
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));
    const enroll = useMutation({ mutationFn: (studentId: string) => adminApi.enroll(id, studentId), onSuccess: () => { setSearch(""); refresh(); toast.success("Étudiant rattaché"); }, onError });
    const unenroll = useMutation({ mutationFn: (studentId: string) => adminApi.unenroll(id, studentId), onSuccess: refresh, onError });
    return (
        <div className="space-y-6">
            <Card title="Rattacher un étudiant">
                <Field label="Rechercher un compte étudiant"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom ou email" /></Field>
                <ul className="mt-2 space-y-1 text-sm">
                    {(candidates.data ?? []).map((u) => (
                        <li key={u.id} className="flex items-center justify-between rounded-lg bg-background-light px-3 py-2">
                            <span>{u.name} · {u.email}{u.organization && ` (déjà chez ${u.organization.name})`}</span>
                            <Button variant="ghost" disabled={!!u.organization} onClick={() => enroll.mutate(u.id)}>Rattacher</Button>
                        </li>
                    ))}
                </ul>
            </Card>
            <Card title="Étudiants" actions={<Select aria-label="Statut" value={status} onChange={(e) => setStatus(e.target.value)} className="w-40"><option value="active">Actifs</option><option value="revoked">Révoqués</option><option value="left">Partis</option></Select>}>
                {enrollments.data?.length === 0 ? <EmptyState>Aucun étudiant.</EmptyState> : (
                    <Table headers={["Étudiant", "Source", "Depuis", ""]}>
                        {(enrollments.data ?? []).map((e) => (
                            <tr key={e.id}>
                                <td className="px-3 py-3"><p className="font-semibold">{e.name}</p><p className="text-xs text-gray-500">{e.email}</p></td>
                                <td className="px-3 py-3">{e.source}</td>
                                <td className="px-3 py-3">{formatDate(e.joinedAt)}</td>
                                <td className="px-3 py-3 text-right">{e.status === "active" && <Button variant="ghost" onClick={() => window.confirm(`Détacher ${e.name} ?`) && unenroll.mutate(e.studentId)}>Détacher</Button>}</td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
        </div>
    );
}

const today = () => new Date().toISOString().slice(0, 10);
const inOneYear = () => new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);

function ContractsTab({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ plan: "standard", status: "active" as ContractStatus, startDate: today(), endDate: inOneYear(), price: "1000", quota: "", notes: "" });
    const contracts = useQuery({ queryKey: ["admin", "contracts", id], queryFn: () => adminApi.organizationContracts(id).then((r) => r.data.data) });
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin"] });
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));
    const create = useMutation({
        mutationFn: () =>
            adminApi.createContract(id, {
                plan: form.plan,
                status: form.status,
                startDate: form.startDate,
                endDate: form.endDate,
                priceCents: form.status === "pilot" ? 0 : Math.round(Number(form.price) * 100),
                currency: "EUR",
                studentQuota: form.quota ? Number(form.quota) : null,
                notes: form.notes || null,
            }),
        onSuccess: () => { refresh(); toast.success("Contrat créé"); },
        onError,
    });
    const update = useMutation({ mutationFn: ({ contractId, status }: { contractId: string; status: ContractStatus }) => adminApi.updateContract(id, contractId, { status }), onSuccess: refresh, onError });
    return (
        <div className="space-y-6">
            <Card title="Contrats">
                {contracts.data?.length === 0 ? <EmptyState>Aucun contrat : les étudiants n'ont pas de Premium via l'école.</EmptyState> : (
                    <Table headers={["Formule", "Statut", "Période", "Prix", "Quota", "Notes internes"]}>
                        {(contracts.data ?? []).map((c) => (
                            <tr key={c.id}>
                                <td className="px-3 py-3">{c.plan}</td>
                                <td className="px-3 py-3">
                                    <Select aria-label="Statut du contrat" value={c.status} onChange={(e) => update.mutate({ contractId: c.id, status: e.target.value as ContractStatus })} className="w-36">
                                        {Object.entries(CONTRACT_STATUS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                                    </Select>
                                </td>
                                <td className="px-3 py-3">{formatDate(c.startDate)} → {formatDate(c.endDate)}</td>
                                <td className="px-3 py-3">{formatPrice(c.priceCents, c.currency)}</td>
                                <td className="px-3 py-3">{c.studentQuota ?? "∞"}</td>
                                <td className="px-3 py-3 text-xs text-gray-600">{c.notes ?? "—"}</td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
            <Card title="Nouveau contrat">
                <form className="grid gap-3 sm:grid-cols-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
                    <Field label="Formule"><Input value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} required /></Field>
                    <Field label="Statut">
                        <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContractStatus })}>
                            {Object.entries(CONTRACT_STATUS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </Field>
                    <Field label="Prix (€)" hint="0 pour un pilote"><Input type="number" min={0} value={form.status === "pilot" ? "0" : form.price} disabled={form.status === "pilot"} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
                    <Field label="Début"><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></Field>
                    <Field label="Fin"><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></Field>
                    <Field label="Quota d'étudiants" hint="Vide = illimité"><Input type="number" min={1} value={form.quota} onChange={(e) => setForm({ ...form, quota: e.target.value })} /></Field>
                    <div className="sm:col-span-3"><Field label="Notes internes (jamais montrées à l'école)"><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field></div>
                    <div><Button type="submit" disabled={create.isPending}>Créer le contrat</Button></div>
                </form>
            </Card>
        </div>
    );
}

function JournalTab({ id }: { id: string }) {
    const logs = useQuery({ queryKey: ["admin", "audit", "organization", id], queryFn: () => adminApi.auditLogs({ organizationId: id, perPage: 50 }).then((r) => r.data.data) });
    return <Card><AuditTable entries={logs.data ?? []} /></Card>;
}
