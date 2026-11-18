import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, Building2, CreditCard, FileSignature, LayoutDashboard, LogOut, ShieldAlert, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ITEMS = [
    { to: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Utilisateurs", icon: Users, end: false },
    { to: "/admin/organizations", label: "Organisations", icon: Building2, end: false },
    { to: "/admin/contracts", label: "Contrats", icon: FileSignature, end: false },
    { to: "/admin/purchases", label: "Achats Premium", icon: CreditCard, end: false },
    { to: "/admin/audit", label: "Journal d'audit", icon: BookOpen, end: false },
];

export function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background-light">
            <div className="flex items-center justify-center gap-2 bg-red-700 px-4 py-2 text-sm font-bold text-white" role="status">
                <ShieldAlert className="h-4 w-4" aria-hidden />
                Mode admin plateforme — chaque action est journalisée
            </div>
            <div className="flex flex-col lg:flex-row">
                <aside className="bg-gray-900 text-white lg:min-h-[calc(100vh-36px)] lg:w-64 lg:shrink-0">
                    <div className="p-5">
                        <p className="font-heading text-lg font-bold">StudaFly Admin</p>
                        <p className="text-xs text-white/60">{user?.email}</p>
                    </div>
                    <nav aria-label="Administration" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">
                        {ITEMS.map(({ to, label, icon: Icon, end }) => (
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
                <main className="mx-auto w-full max-w-6xl flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
