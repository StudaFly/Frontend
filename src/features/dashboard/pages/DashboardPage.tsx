import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock, ClipboardCheck, Clock, Map, Wallet, type LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProgress } from "@/core/api/mobilities";
import type { TimelineTask } from "@/core/api/timeline";
import { useActiveMobility } from "@/core/hooks/useActiveMobility";
import { useReference } from "@/core/hooks/useReference";
import { NoMobilityState } from "../components/NoMobilityState";

// Visual style only: labels and figures come from the API.
const CATEGORY_COLORS: Record<TimelineTask["category"], string> = {
    admin: "#3B82F6",
    finance: "#F59E0B",
    health: "#22C55E",
    housing: "#8B5CF6",
    practical: "#EC4899",
};

const QUICK_LINKS: { to: string; label: string; icon: LucideIcon }[] = [
    { to: "/timeline", label: "Timeline", icon: Clock },
    { to: "/checklist", label: "Checklist", icon: ClipboardCheck },
    { to: "/budget", label: "Budget", icon: Wallet },
    { to: "/guide", label: "Guide", icon: Map },
];

/** `days` is computed by the backend (TaskRead.daysUntilDeadline). */
function deadlineBadge(days: number): { text: string; className: string } {
    if (days < 0) return { text: `En retard de ${-days} j`, className: "bg-red-100 text-red-700" };
    if (days === 0) return { text: "Aujourd'hui", className: "bg-red-100 text-red-700" };
    if (days <= 7) return { text: `Dans ${days} jour${days > 1 ? "s" : ""}`, className: "bg-amber-100 text-amber-800" };
    return { text: `Dans ${days} jours`, className: "bg-indigo-100 text-indigo-700" };
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { mobility, destination, isLoading, hasNoMobility } = useActiveMobility();
    const { mobilityTypeLabel } = useReference();
    const progress = useQuery({
        queryKey: ["progress", mobility?.id],
        queryFn: async () => (await getProgress(mobility!.id)).data.data,
        enabled: !!mobility,
        // Tasks are completed from other pages that do not share this cache.
        staleTime: 0,
    });

    if (hasNoMobility) {
        return <NoMobilityState message="Configure ta mobilité pour générer ton parcours de préparation." />;
    }
    if (isLoading || !mobility || progress.isLoading || !progress.data) {
        return <p className="py-20 text-center text-gray-400">Chargement de ton tableau de bord…</p>;
    }

    const {
        completedTasks: completed,
        totalTasks,
        percent,
        daysUntilDeparture: days,
        nextTasks,
        byCategory,
    } = progress.data;

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50">
            <div className="bg-gradient-to-r from-primary-dark to-primary-light px-6 py-10 text-white">
                <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <p className="text-white/80">Bonjour 👋</p>
                        <h1 className="font-heading text-4xl font-bold">{user?.firstName ? `${user.firstName} !` : "Bienvenue !"}</h1>
                        <p className="mt-1 text-white/70">
                            {[destination?.city, mobilityTypeLabel(mobility.type)].filter(Boolean).join(" · ")}
                        </p>
                    </div>
                    <div className="flex gap-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20">
                        <div>
                            <p className="text-sm text-white/70">{days >= 0 ? "Départ dans" : "Sur place depuis"}</p>
                            <p className="font-heading text-4xl font-bold text-secondary">
                                {days === 0 ? "Jour J" : `${Math.abs(days)} j`}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-white/70">Progression</p>
                            <p className="font-heading text-4xl font-bold">{percent}%</p>
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-6 max-w-5xl">
                    <div
                        className="h-2 overflow-hidden rounded-full bg-white/20"
                        role="progressbar"
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Progression du parcours"
                    >
                        <div className="h-full rounded-full bg-secondary" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                        {completed} tâche{completed > 1 ? "s" : ""} sur {totalTasks} complétée{completed > 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-2">
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-heading text-xl font-bold text-primary-dark">⚡ À faire en priorité</h2>
                        <Link to="/timeline" className="text-sm font-semibold text-primary-light hover:underline">Tout voir</Link>
                    </div>
                    {nextTasks.length === 0 ? (
                        <p className="text-gray-500">Aucune échéance à venir. Bravo ! 🎉</p>
                    ) : (
                        <ul className="space-y-3">
                            {nextTasks.map((task) => {
                                const badge = deadlineBadge(task.daysUntilDeadline ?? 0);
                                return (
                                    <li key={task.id}>
                                        <Link
                                            to="/checklist"
                                            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                                        >
                                            <span className="font-semibold text-primary-dark">{task.title}</span>
                                            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${badge.className}`}>
                                                <CalendarClock className="h-3 w-3" aria-hidden /> {badge.text}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-heading text-xl font-bold text-primary-dark">📊 Avancement</h2>
                        <span className="text-sm text-gray-500">{completed}/{totalTasks} tâches</span>
                    </div>
                    <ul className="space-y-4">
                        {byCategory.map((c) => (
                            <li key={c.category}>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span className="text-gray-600">{c.label}</span>
                                    <span className={c.done === c.total ? "font-semibold text-green-600" : "text-gray-500"}>
                                        {c.done}/{c.total}
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-gray-200" aria-hidden>
                                    <div className="h-full rounded-full" style={{ width: `${(c.done / c.total) * 100}%`, backgroundColor: CATEGORY_COLORS[c.category] }} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <nav className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-2" aria-label="Accès rapides">
                    {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className="flex items-center gap-3 rounded-xl bg-white p-4 font-semibold text-primary-dark shadow-sm ring-1 ring-slate-100 transition-colors hover:bg-gray-50"
                        >
                            <Icon className="h-5 w-5 text-secondary" aria-hidden /> {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
