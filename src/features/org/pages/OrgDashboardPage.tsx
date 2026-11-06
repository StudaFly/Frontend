import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, PageHeader, Stat } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { orgApi } from "@/core/api/org";
import { FollowUpBadge } from "../components/FollowUpBadge";
import { useAllStudents } from "../hooks";

export default function OrgDashboardPage() {
    const { user } = useAuth();
    const students = useAllStudents();
    const joinCode = useQuery({ queryKey: ["org", "join-code"], queryFn: () => orgApi.joinCode().then((r) => r.data.data.joinCode) });
    const list = students.data ?? [];
    const alerts = list.filter((s) => s.followUp === "danger" || s.followUp === "warning");
    const unassigned = list.filter((s) => s.mobility && !s.mobility.advisor);

    return (
        <>
            <PageHeader
                title={`Bonjour ${user?.firstName ?? ""}`}
                subtitle={user?.orgRole === "manager" ? "Vue d'ensemble de votre établissement" : "Les étudiants de votre périmètre"}
            />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Stat label="Étudiants suivis" value={list.length} />
                <Stat label="Critiques" value={list.filter((s) => s.followUp === "danger").length} tone="red" />
                <Stat label="En retard" value={list.filter((s) => s.followUp === "warning").length} tone="amber" />
                {user?.orgRole === "manager" ? <Stat label="Non affectés" value={unassigned.length} /> : <Stat label="En bonne voie" value={list.filter((s) => s.followUp === "ok").length} />}
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <Card title="À traiter en priorité" className="lg:col-span-2" actions={<Link to="/org/alerts" className="text-sm font-semibold text-primary-light">Toutes les alertes</Link>}>
                    {alerts.length === 0 ? (
                        <p className="text-sm text-gray-600">Aucune alerte : tout le monde est en bonne voie.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {alerts.slice(0, 6).map((s) => (
                                <li key={s.id} className="flex items-center justify-between gap-2 py-2">
                                    <Link to={`/org/students/${s.id}`} className="font-semibold text-primary-dark hover:underline">{s.name}</Link>
                                    <span className="text-sm text-gray-600">{s.mobility?.city} · {s.mobility?.progress}%</span>
                                    <FollowUpBadge value={s.followUp} />
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card title="Code d'école">
                    <p className="font-mono text-2xl font-bold tracking-widest text-primary-dark">{joinCode.data ?? "…"}</p>
                    <p className="mt-2 text-sm text-gray-600">À communiquer aux étudiants : ils le saisissent dans leur profil pour rejoindre l'établissement.</p>
                </Card>
            </div>
        </>
    );
}
