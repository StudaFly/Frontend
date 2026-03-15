import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { getNavPath, NAV_ITEMS } from "./NavConstants";

interface MobileMenuProps {
    closeMobileMenu: () => void;
    handleLogout: () => void;
}

export function MobileMenu({ closeMobileMenu, handleLogout }: MobileMenuProps) {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="border-t border-slate-100 bg-white md:hidden">
            <div className="space-y-1 px-4 pb-4 pt-2">
                {NAV_ITEMS.filter((item) => {
                    if (!isAuthenticated && (item === "checklist" || item === "timeline" || item === "budget")) return false;
                    return true;
                }).map((item) => (
                    <Link
                        key={item}
                        to={getNavPath(item)}
                        onClick={closeMobileMenu}
                        className="block rounded-md px-3 py-2 font-heading text-base font-semibold text-primary-dark hover:bg-slate-50"
                    >
                        {t(`navbar.${item}`, { defaultValue: item.charAt(0).toUpperCase() + item.slice(1) })}
                    </Link>
                ))}

                <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 px-3 pt-4">
                    {isAuthenticated && user ? (
                        <>
                            <div className="mb-2 px-3 py-2">
                                <p className="font-heading font-bold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <Link
                                to="/profile"
                                onClick={closeMobileMenu}
                                className="block w-full rounded-md border border-slate-200 px-3 py-2 text-center font-sans text-base font-medium text-primary-dark hover:bg-slate-50"
                            >
                                Mon profil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full rounded-md px-3 py-2 text-center font-sans text-base font-medium text-red-600 hover:bg-red-50"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeMobileMenu}
                                className="block w-full rounded-md border border-slate-200 px-3 py-2 text-center font-sans text-base font-medium text-primary-dark hover:bg-slate-50"
                            >
                                {t("navbar.login", { defaultValue: "Se connecter" })}
                            </Link>
                            <Link
                                to="/register"
                                onClick={closeMobileMenu}
                                className="block w-full rounded-md bg-secondary px-3 py-2 text-center font-sans text-base font-bold text-primary-dark hover:bg-secondary/80"
                            >
                                {t("navbar.signup", { defaultValue: "S'inscrire" })}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
