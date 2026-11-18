import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { getNavPath, isStudent, visibleNavItems } from "./NavConstants";

export function DesktopNavLinks() {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="hidden items-center gap-8 md:flex">
            {visibleNavItems(isAuthenticated && isStudent(user)).map((item) => (
                <Link
                    key={item}
                    to={getNavPath(item)}
                    className="font-heading text-sm font-semibold text-primary-dark transition-colors hover:underline hover:decoration-secondary hover:decoration-2 hover:underline-offset-4"
                >
                    {t(`navbar.${item}`, { defaultValue: item.charAt(0).toUpperCase() + item.slice(1) })}
                </Link>
            ))}
        </div>
    );
}
