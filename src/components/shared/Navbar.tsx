import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = ["home", "destinations", "checklist", "timeline", "about"] as const;

type NavItem = (typeof NAV_ITEMS)[number];

function getNavPath(item: NavItem): string {
    return item === "home" ? "/" : `/${item}`;
}

export function Navbar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate("/");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
            <div className="mx-auto flex h-[100px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        src={logoImage}
                        alt="StudaFly"
                        className="h-[100px] w-auto object-contain py-2"
                    />
                </Link>

                {/* Navigation links — desktop */}
                <div className="hidden items-center gap-8 md:flex">
                    {NAV_ITEMS.filter((item) => {
                        if (!isAuthenticated && (item === "checklist" || item === "timeline")) return false;
                        return true;
                    }).map((item) => (
                        <Link
                            key={item}
                            to={getNavPath(item)}
                            className="font-heading text-sm font-semibold text-primary-dark transition-colors hover:underline hover:decoration-secondary hover:decoration-2 hover:underline-offset-4"
                        >
                            {/* Fallback en anglais si la trad n'existe pas encore */}
                            {t(`navbar.${item}`, { defaultValue: item.charAt(0).toUpperCase() + item.slice(1) })}
                        </Link>
                    ))}
                </div>

                {/* Actions — desktop */}
                <div className="hidden items-center gap-6 md:flex">
                    {isAuthenticated && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm transition-colors hover:bg-slate-50 hover:border-secondary"
                            >
                                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                                    {user.avatarType === "image" && user.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                                    ) : user.avatarType === "emoji" && user.avatar ? (
                                        <span className="text-base leading-none">{user.avatar}</span>
                                    ) : (
                                        <User className="h-4 w-4 text-gray-500" />
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Options</span>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="border-b border-gray-100 px-4 py-3 text-sm">
                                        <p className="font-heading font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                                        <p className="text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        Mon profil
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="font-sans text-sm font-medium text-primary-dark hover:underline hover:underline-offset-4"
                            >
                                {t("navbar.login", { defaultValue: "Se connecter" })}
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-md bg-secondary px-5 py-2.5 font-sans text-sm font-bold text-primary-dark shadow-sm transition-colors hover:bg-secondary/80"
                            >
                                {t("navbar.signup", { defaultValue: "S'inscrire" })}
                            </Link>
                        </>
                    )}
                </div>

                {/* Hamburger — mobile only */}
                <button
                    className="flex items-center text-primary-dark hover:text-primary-light focus:outline-none md:hidden"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    aria-expanded={isMobileMenuOpen}
                    aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" aria-hidden="true" />
                    ) : (
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* Mobile menu panel */}
            {isMobileMenuOpen && (
                <div className="border-t border-slate-100 bg-white md:hidden">
                    <div className="space-y-1 px-4 pb-4 pt-2">
                        {NAV_ITEMS.filter((item) => {
                            if (!isAuthenticated && (item === "checklist" || item === "timeline")) return false;
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
                                        <p className="font-heading font-bold text-gray-900">{user.firstName} {user.lastName}</p>
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
            )}
        </nav>
    );
}
