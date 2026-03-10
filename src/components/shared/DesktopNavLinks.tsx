import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

export const NAV_ITEMS = ["home", "destinations", "checklist", "timeline", "about"] as const;
export type NavItem = (typeof NAV_ITEMS)[number];

export function getNavPath(item: NavItem): string {
    return item === "home" ? "/" : `/${item}`;
}

export function DesktopNavLinks() {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    return (
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
                    {t(`navbar.${item}`, { defaultValue: item.charAt(0).toUpperCase() + item.slice(1) })}
                </Link>
            ))}
        </div>
    );
}
