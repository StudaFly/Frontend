import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoImage from "@/assets/logo.png";

const NAV_ITEMS = ["home", "destinations", "about"] as const;

type NavItem = (typeof NAV_ITEMS)[number];

function getNavPath(item: NavItem): string {
    return item === "home" ? "/" : `/${item}`;
}

export function Navbar() {
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item}
                            to={getNavPath(item)}
                            className="font-heading text-sm font-semibold text-primary-dark transition-colors hover:underline hover:decoration-secondary hover:decoration-2 hover:underline-offset-4"
                        >
                            {t(`navbar.${item}`)}
                        </Link>
                    ))}
                </div>

                {/* Auth actions — desktop */}
                <div className="hidden items-center gap-6 md:flex">
                    <Link
                        to="/login"
                        className="font-sans text-sm font-medium text-primary-dark hover:underline hover:underline-offset-4"
                    >
                        {t("navbar.login")}
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-md bg-secondary px-5 py-2.5 font-sans text-sm font-bold text-primary-dark shadow-sm transition-colors hover:bg-secondary/80"
                    >
                        {t("navbar.signup")}
                    </Link>
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
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item}
                                to={getNavPath(item)}
                                onClick={closeMobileMenu}
                                className="block rounded-md px-3 py-2 font-heading text-base font-semibold text-primary-dark hover:bg-slate-50"
                            >
                                {t(`navbar.${item}`)}
                            </Link>
                        ))}
                        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 px-3 pt-4">
                            <Link
                                to="/login"
                                onClick={closeMobileMenu}
                                className="block w-full rounded-md border border-slate-200 px-3 py-2 text-center font-sans text-base font-medium text-primary-dark hover:bg-slate-50"
                            >
                                {t("navbar.login")}
                            </Link>
                            <Link
                                to="/register"
                                onClick={closeMobileMenu}
                                className="block w-full rounded-md bg-secondary px-3 py-2 text-center font-sans text-base font-bold text-primary-dark hover:bg-secondary/80"
                            >
                                {t("navbar.signup")}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
