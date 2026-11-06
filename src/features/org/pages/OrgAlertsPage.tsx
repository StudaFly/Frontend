import { Link } from "react-router-dom";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import type { StudentListItem } from "@/core/api/org";
import { FollowUpBadge } from "../components/FollowUpBadge";
import { useAllStudents } from "../hooks";

function AlertList({ students, empty }: { students: StudentListItem[]; empty: string }) {
    if (students.length === 0) return <EmptyState>{empty}</EmptyState>;
    return (
        <ul className="divide-y divide-gray-100">
            {students.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                        <Link to={`/org/students/${s.id}`} className="font-semibold text-primary-dark hover:underline">{s.name}</Link>
                        <p className="text-xs text-gray-500">
                            {s.mobility?.city} · départ le {s.mobility ? new Date(s.mobility.departureDate).toLocaleDateString("fr-FR") : "—"} · {s.mobility?.progress}% · {s.mobility?.overdueTasks} tâche(s) en retard
                        </p>
                    </div>
                    <FollowUpBadge value={s.followUp} />
                </li>
            ))}
        </ul>
    );
}

export default function OrgAlertsPage() {
    const students = useAllStudents();
    const list = students.data ?? [];
    return (
        <>
            <PageHeader title="Alertes" subtitle="Calculées à partir du seuil de l'établissement (par défaut : moins de 50 % à J-30) et des tâches en retard." />
            <div className="space-y-6">
                <Card title="Critiques"><AlertList students={list.filter((s) => s.followUp === "danger")} empty="Aucun étudiant critique." /></Card>
                <Card title="En retard"><AlertList students={list.filter((s) => s.followUp === "warning")} empty="Aucun étudiant en retard." /></Card>
            </div>
        </>
    );
}
