import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, Field, Input, PageHeader, Pagination, Select, Table } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { orgApi, type FollowUp, type StudentFilters } from "@/core/api/org";
import { FOLLOW_UP, ZONE_LABELS } from "@/core/labels";
import { FollowUpBadge, ProgressBar } from "../components/FollowUpBadge";
import { countryName, useMembers } from "../hooks";

export default function OrgStudentsPage({ unassignedOnly = false }: { unassignedOnly?: boolean }) {
    const { user } = useAuth();
    const isManager = user?.orgRole === "manager";
    const [filters, setFilters] = useState<StudentFilters>({ page: 1, perPage: 20, unassigned: unassignedOnly });
    const members = useMembers();
    const students = useQuery({
        queryKey: ["org", "students", filters],
        queryFn: () => orgApi.students(filters).then((r) => r.data),
    });
    const set = (patch: Partial<StudentFilters>) => setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));

    return (
        <>
            <PageHeader
                title={unassignedOnly ? "Étudiants non affectés" : "Étudiants"}
                subtitle={unassignedOnly ? "Aucun conseiller ne couvre leur destination : affectez-les depuis leur fiche ou complétez les périmètres." : undefined}
            />
            <Card>
                <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Field label="Recherche">
                        <Input placeholder="Nom ou email" value={filters.q ?? ""} onChange={(e) => set({ q: e.target.value })} />
                    </Field>
                    <Field label="Statut de suivi">
                        <Select value={filters.status ?? ""} onChange={(e) => set({ status: (e.target.value || undefined) as FollowUp | undefined })}>
                            <option value="">Tous</option>
                            {Object.entries(FOLLOW_UP).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </Field>
                    <Field label="Zone">
                        <Select value={filters.zone ?? ""} onChange={(e) => set({ zone: e.target.value || undefined })}>
                            <option value="">Toutes</option>
                            {Object.entries(ZONE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </Field>
                    {isManager && !unassignedOnly && (
                        <Field label="Conseiller">
                            <Select value={filters.advisorId ?? ""} onChange={(e) => set({ advisorId: e.target.value || undefined })}>
                                <option value="">Tous</option>
                                {(members.data ?? []).filter((m) => m.isActive).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </Select>
                        </Field>
                    )}
                </div>
                {students.data && students.data.data.length === 0 ? (
                    <EmptyState>Aucun étudiant ne correspond.</EmptyState>
                ) : (
                    <Table headers={["Étudiant", "Destination", "Départ", "Conseiller", "Progression", "Suivi"]}>
                        {(students.data?.data ?? []).map((s) => (
                            <tr key={s.id}>
                                <td className="px-3 py-3">
                                    <Link to={`/org/students/${s.id}`} className="font-semibold text-primary-dark hover:underline">{s.name}</Link>
                                    <p className="text-xs text-gray-500">{s.email}</p>
                                </td>
                                <td className="px-3 py-3">{s.mobility ? `${s.mobility.city}, ${countryName(s.mobility.countryCode)}` : "—"}</td>
                                <td className="px-3 py-3">{s.mobility ? new Date(s.mobility.departureDate).toLocaleDateString("fr-FR") : "—"}</td>
                                <td className="px-3 py-3">
                                    {s.mobility?.advisor ? (
                                        <>{s.mobility.advisor.name}{s.mobility.assignment === "override" && <span className="ml-1 text-xs text-gray-500">(manuel)</span>}</>
                                    ) : (
                                        <span className="text-amber-700">Non affecté</span>
                                    )}
                                </td>
                                <td className="px-3 py-3">{s.mobility ? <ProgressBar value={s.mobility.progress} /> : "—"}</td>
                                <td className="px-3 py-3"><FollowUpBadge value={s.followUp} /></td>
                            </tr>
                        ))}
                    </Table>
                )}
                {students.data && (
                    <Pagination page={students.data.page} total={students.data.total} perPage={students.data.perPage} onPage={(page) => set({ page })} />
                )}
            </Card>
        </>
    );
}
