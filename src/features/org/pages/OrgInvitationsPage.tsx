import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Table } from "@/components/ui";
import { getApiErrorMessage } from "@/core/api/errors";
import { orgApi, type ImportReport } from "@/core/api/org";
import { formatDate, INVITATION_STATUS } from "@/core/labels";

const IMPORT_STATUS: Record<string, string> = {
    invited: "Invité·e",
    resent: "Relancé·e",
    already_member: "Déjà rattaché·e",
    not_a_student: "Compte non étudiant",
    invalid_email: "Email invalide",
    duplicate: "Doublon dans le fichier",
};

export default function OrgInvitationsPage() {
    const queryClient = useQueryClient();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("pending");
    const [file, setFile] = useState<File | null>(null);
    const [report, setReport] = useState<ImportReport | null>(null);
    const invitations = useQuery({
        queryKey: ["org", "invitations", status],
        queryFn: () => orgApi.invitations({ status: status || undefined, kind: "student" }).then((r) => r.data.data),
    });
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["org", "invitations"] });
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));

    const invite = useMutation({
        mutationFn: () => orgApi.inviteStudent(email),
        onSuccess: () => {
            setEmail("");
            refresh();
            toast.success("Invitation envoyée");
        },
        onError,
    });
    const importCsv = useMutation({
        mutationFn: (f: File) => orgApi.importInvitations(f),
        onSuccess: ({ data }) => {
            setReport(data.data);
            refresh();
        },
        onError,
    });
    const revoke = useMutation({ mutationFn: (id: string) => orgApi.revokeInvitation(id), onSuccess: refresh, onError });

    return (
        <>
            <PageHeader title="Invitations" subtitle="L'étudiant reçoit un lien valable 14 jours et doit accepter le rattachement." />
            <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Inviter un étudiant">
                    <form
                        className="flex flex-wrap items-end gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            invite.mutate();
                        }}
                    >
                        <div className="min-w-[14rem] flex-1">
                            <Field label="Email">
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Field>
                        </div>
                        <Button type="submit" disabled={invite.isPending}>Inviter</Button>
                    </form>
                </Card>
                <Card title="Import CSV">
                    <p className="mb-3 text-sm text-gray-600">Une colonne <code>email</code> obligatoire, séparateur « , » ou « ; », 1000 lignes maximum.</p>
                    <form
                        className="flex flex-wrap items-center gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (file) importCsv.mutate(file);
                        }}
                    >
                        <input type="file" accept=".csv,text/csv" aria-label="Fichier CSV" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
                        <Button type="submit" disabled={!file || importCsv.isPending}>Importer</Button>
                    </form>
                    {report && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold">{report.invited} invité·s · {report.resent} relancé·s · {report.skipped} ignoré·s</p>
                            <ul className="mt-2 max-h-48 overflow-y-auto text-sm">
                                {report.lines.map((line) => (
                                    <li key={line.line} className="flex justify-between border-b border-gray-100 py-1">
                                        <span>Ligne {line.line} · {line.email ?? "—"}</span>
                                        <span className={line.status === "invited" || line.status === "resent" ? "text-green-700" : "text-amber-700"}>{IMPORT_STATUS[line.status] ?? line.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
            </div>
            <Card
                className="mt-6"
                title="Invitations envoyées"
                actions={
                    <Select aria-label="Filtrer par statut" value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
                        <option value="">Toutes</option>
                        {Object.entries(INVITATION_STATUS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                    </Select>
                }
            >
                {invitations.data?.length === 0 ? (
                    <EmptyState>Aucune invitation.</EmptyState>
                ) : (
                    <Table headers={["Email", "Statut", "Origine", "Expire le", ""]}>
                        {(invitations.data ?? []).map((i) => (
                            <tr key={i.id}>
                                <td className="px-3 py-3">{i.email}</td>
                                <td className="px-3 py-3"><Badge tone={INVITATION_STATUS[i.status].tone}>{INVITATION_STATUS[i.status].label}</Badge></td>
                                <td className="px-3 py-3">{i.fromCsv ? "Import CSV" : "Unitaire"}</td>
                                <td className="px-3 py-3">{formatDate(i.expiresAt)}</td>
                                <td className="px-3 py-3 text-right">
                                    {i.status === "pending" && <Button variant="ghost" onClick={() => revoke.mutate(i.id)}>Révoquer</Button>}
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
        </>
    );
}
