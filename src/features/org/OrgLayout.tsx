import { NavLink, Outlet, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BarChart3, Bell, BookOpen, FileSignature, Globe2, LayoutDashboard, LogOut, Mail, Settings, Users, UserX, UsersRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { orgApi } from "@/core/api/org";
import { ORG_ROLE_LABELS, ZONE_LABELS } from "@/core/labels";
import { countryName, useOrg } from "./hooks";

interface NavItem {
    to: string;
    label: string;
    icon: LucideIcon;
    end?: boolean;
}

const COMMON: NavItem[] = [
    { to: "/org", label: "Tableau de bord", icon: LayoutDashboard, end: true },
    { to: "/org/students", label: "Étudiants", icon: UsersRound },
    { to: "/org/alerts", label: "Alertes", icon: Bell },
    { to: "/org/stats", label: "Statistiques", icon: BarChart3 },
    { to: "/org/invitations", label: "Invitations", icon: Mail },
];

const MANAGER: NavItem[] = [
    { to: "/org/team", label: "Équipe", icon: Users },
    { to: "/org/perimeters", label: "Périmètres", icon: Globe2 },
    { to: "/org/unassigned", label: "Non affectés", icon: UserX },
    { to: "/org/settings", label: "Réglages", icon: Settings },
    { to: "/org/contract", label: "Contrat", icon: FileSignature },
    { to: "/org/journal", label: "Journal", icon: BookOpen },
];

export function OrgLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const org = useOrg();
    const isManager = user?.orgRole === "manager";
    const contract = useQuery({
        queryKey: ["org", "contract"],
        queryFn: () => orgApi.contract().then((r) => r.data.data),
        enabled: isManager,
    });
    const items = isManager ? [...COMMON, ...MANAGER] : COMMON;
    const perimeter = org.data
        ? org.data.myZones.length
            ? org.data.myZones.map((z) => ZONE_LABELS[z] ?? z).join(", ")
            : org.data.myCountries.map(countryName).join(", ")
        : "";

    return (
        <div className="flex min-h-screen flex-col bg-background-light lg:flex-row">
            <aside className="border-b border-gray-200 bg-primary-dark text-white lg:w-64 lg:shrink-0 lg:border-b-0">
                <div className="p-5">
                    <p className="text-xs uppercase tracking-wide text-white/60">Espace établissement</p>
                    <p className="mt-1 font-heading text-lg font-bold">
                        {org.data?.name ?? user?.organization?.name ?? "…"}
                    </p>
                    <p className="mt-1 text-xs text-white/70">{user?.orgRole ? ORG_ROLE_LABELS[user.orgRole] : ""}</p>
                </div>
                <nav aria-label="Espace établissement" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
                    {items.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex min-h-[44px] shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? "bg-white/15 text-secondary" : "text-white/85 hover:bg-white/10"}`
                            }
                        >
                            <Icon className="h-4 w-4" aria-hidden />
                            {label}
                        </NavLink>
                    ))}
                    <button
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        className="flex min-h-[44px] shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
                    >
                        <LogOut className="h-4 w-4" aria-hidden />
                        Déconnexion
                    </button>
                </nav>
            </aside>
            <div className="flex-1">
                <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-6 py-3 text-sm">
                    <span className="text-gray-600">{user?.firstName} {user?.lastName} · {user?.email}</span>
                    {perimeter && <span className="rounded-full bg-secondary/30 px-3 py-1 font-semibold text-primary-dark">Mon périmètre : {perimeter}</span>}
                </header>
                {contract.data && contract.data.state !== "current" && contract.data.state !== "none" && (
                    <div className="flex items-center gap-2 bg-amber-100 px-6 py-3 text-sm font-semibold text-amber-900" role="status">
                        <AlertTriangle className="h-4 w-4" aria-hidden />
                        {contract.data.state === "read_only"
                            ? "Le contrat de votre établissement a expiré : l'espace est en lecture seule."
                            : "Le contrat de votre établissement est suspendu."}
                    </div>
                )}
                <main className="mx-auto max-w-6xl p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
