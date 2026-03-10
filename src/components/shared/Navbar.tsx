import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { DesktopNavLinks } from "./DesktopNavLinks";
import { UserDropdown } from "./UserDropdown";
import { MobileMenu } from "./MobileMenu";

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
                    <img src={logoImage} alt="StudaFly" className="h-[100px] w-auto object-contain py-2" />
                </Link>

                {/* Navigation links — desktop */}
                <DesktopNavLinks />

                {/* Actions — desktop */}
                <div className="hidden items-center gap-6 md:flex">
                    {isAuthenticated && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <UserDropdown
                                isDropdownOpen={isDropdownOpen}
                                setIsDropdownOpen={setIsDropdownOpen}
                                onLogout={handleLogout}
                            />
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="font-sans text-sm font-medium text-primary-dark hover:underline hover:underline-offset-4">
                                {t("navbar.login", { defaultValue: "Se connecter" })}
                            </Link>
                            <Link to="/register" className="rounded-md bg-secondary px-5 py-2.5 font-sans text-sm font-bold text-primary-dark shadow-sm transition-colors hover:bg-secondary/80">
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
                    {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
                </button>
            </div>

            {/* Mobile menu panel */}
            {isMobileMenuOpen && <MobileMenu closeMobileMenu={closeMobileMenu} handleLogout={handleLogout} />}
        </nav>
    );
}
