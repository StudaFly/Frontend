import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, Button, Card, ConfirmDialog, EmptyState, PageHeader, Select } from "@/components/ui";
import { PageLoader } from "@/components/shared/PageLoader";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/core/api/errors";
import { orgApi } from "@/core/api/org";
import { formatDate } from "@/core/labels";
import { FollowUpBadge, ProgressBar } from "../components/FollowUpBadge";
import { countryName, useMembers } from "../hooks";

const CATEGORY_LABELS: Record<string, string> = { admin: "Administratif", finance: "Finances", housing: "Logement", health: "Santé", practical: "Pratique" };

export default function OrgStudentDetailPage() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const isManager = user?.orgRole === "manager";
    const [note, setNote] = useState("");
    const [confirmRevoke, setConfirmRevoke] = useState(false);
    const members = useMembers();
    const student = useQuery({ queryKey: ["org", "student", id], queryFn: () => orgApi.student(id).then((r) => r.data.data), retry: false });
    const notes = useQuery({ queryKey: ["org", "notes", id], queryFn: () => orgApi.notes(id).then((r) => r.data.data), enabled: student.isSuccess });

    const refresh = () => queryClient.invalidateQueries({ queryKey: ["org"] });
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));
    const assign = useMutation({
        mutationFn: ({ mobilityId, memberId }: { mobilityId: string; memberId: string }) =>
            memberId ? orgApi.assignAdvisor(mobilityId, memberId) : orgApi.clearAdvisor(mobilityId),
        onSuccess: () => {
            refresh();
            toast.success("Affectation mise à jour");
        },
        onError,
    });
    const addNote = useMutation({
        mutationFn: () => orgApi.addNote(id, note.trim()),
        onSuccess: () => {
            setNote("");
            queryClient.invalidateQueries({ queryKey: ["org", "notes", id] });
        },
        onError,
    });
    const revoke = useMutation({
        mutationFn: () => orgApi.revokeStudent(id),
        onSuccess: () => {
            refresh();
            toast.success("Rattachement révoqué");
            navigate("/org/students");
        },
        onError,
    });

    if (student.isLoading) return <PageLoader />;
    if (!student.data) {
        return <EmptyState>Étudiant introuvable ou hors de votre périmètre. <Link to="/org/students" className="font-semibold text-primary-light">Retour à la liste</Link></EmptyState>;
    }
    const s = student.data;

    return (
        <>
            <PageHeader
                title={s.name}
                subtitle={<>{s.email}{s.phone && ` · ${s.phone}`} · rattaché·e le {formatDate(s.joinedAt)}</>}
                actions={
                    <div className="flex items-center gap-2">
                        <FollowUpBadge value={s.followUp} />
                        {isManager && <Button variant="outline" onClick={() => setConfirmRevoke(true)}>Révoquer le rattachement</Button>}
                    </div>
                }
            />
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {s.mobilities.length === 0 && <EmptyState>Pas encore de mobilité.</EmptyState>}
                    {s.mobilities.map((m) => (
                        <Card key={m.id} title={`${m.city}, ${countryName(m.countryCode)}`} actions={<Badge tone={m.status === "completed" ? "gray" : "blue"}>{m.type} · {m.status}</Badge>}>
                            <p className="text-sm text-gray-600">Départ le {formatDate(m.departureDate)}{m.returnDate && ` · retour le ${formatDate(m.returnDate)}`}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-4">
                                <ProgressBar value={m.progress} />
                                <span className="text-sm text-gray-600">{m.tasksDone}/{m.tasksTotal} tâches · {m.overdueTasks} en retard</span>
                            </div>
                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                {m.categories.map((c) => (
                                    <div key={c.category} className="flex justify-between rounded-lg bg-background-light px-3 py-2 text-sm">
                                        <span>{CATEGORY_LABELS[c.category] ?? c.category}</span>
                                        <span className="font-semibold">{c.done}/{c.total}</span>
                                    </div>
                                ))}
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-primary-dark">Documents (statut uniquement)</h3>
                            {m.documents.length === 0 ? (
                                <p className="text-sm text-gray-500">Aucun document déposé.</p>
                            ) : (
                                <ul className="mt-1 text-sm text-gray-700">
                                    {m.documents.map((d) => <li key={d.id}>✓ {d.category ?? "Document"} — déposé le {formatDate(d.uploadedAt)}</li>)}
                                </ul>
                            )}
                            <div className="mt-4 border-t border-gray-100 pt-4 text-sm">
                                <span className="font-semibold">Conseiller : </span>
                                {m.advisor ? `${m.advisor.name}${m.assignment === "override" ? " (affectation manuelle)" : " (périmètre)"}` : <span className="text-amber-700">non affecté</span>}
                                {isManager && m.status !== "completed" && (
                                    <div className="mt-2 flex max-w-sm items-center gap-2">
                                        <Select
                                            aria-label={`Conseiller pour ${m.city}`}
                                            defaultValue={m.assignment === "override" ? m.advisor?.memberId : ""}
                                            onChange={(e) => assign.mutate({ mobilityId: m.id, memberId: e.target.value })}
                                        >
                                            <option value="">Selon les périmètres</option>
                                            {(members.data ?? []).filter((x) => x.isActive).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
                <Card title="Notes internes">
                    <p className="mb-3 text-xs text-gray-500">Visibles par l'équipe RI uniquement, mais incluses dans l'export RGPD de l'étudiant : restez factuel.</p>
                    <form
                        className="space-y-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (note.trim()) addNote.mutate();
                        }}
                    >
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            aria-label="Nouvelle note"
                            rows={3}
                            maxLength={5000}
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-primary-light focus:outline-none"
                        />
                        <Button type="submit" disabled={addNote.isPending || !note.trim()}>Ajouter la note</Button>
                    </form>
                    <ul className="mt-4 space-y-3">
                        {(notes.data ?? []).map((n) => (
                            <li key={n.id} className="rounded-lg bg-background-light p-3 text-sm">
                                <p className="whitespace-pre-wrap text-gray-800">{n.body}</p>
                                <p className="mt-1 text-xs text-gray-500">{n.author?.name ?? "Ancien membre"} · {formatDate(n.createdAt)}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
            {confirmRevoke && (
                <ConfirmDialog
                    title="Révoquer le rattachement ?"
                    description={`${s.name} ne fera plus partie de l'établissement. Son Premium reste actif jusqu'à la fin de sa mobilité en cours.`}
                    expected={s.email}
                    confirmLabel="Révoquer"
                    pending={revoke.isPending}
                    onConfirm={() => revoke.mutate()}
                    onClose={() => setConfirmRevoke(false)}
                />
            )}
        </>
    );
}
