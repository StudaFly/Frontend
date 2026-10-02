export const NAV_ITEMS = ["home", "destinations", "about", "dashboard", "timeline", "checklist", "budget", "guide"] as const;
export type NavItem = (typeof NAV_ITEMS)[number];

/** Pages of the student space, only shown to logged-in users. */
export const PRIVATE_NAV_ITEMS: readonly NavItem[] = ["dashboard", "timeline", "checklist", "budget", "guide"];
/** Marketing pages, hidden once logged in to keep the navbar short. */
const PUBLIC_ONLY_NAV_ITEMS: readonly NavItem[] = ["home", "about"];

export function getNavPath(item: NavItem): string {
    return item === "home" ? "/" : `/${item}`;
}

export function visibleNavItems(isAuthenticated: boolean): NavItem[] {
    return NAV_ITEMS.filter((item) =>
        isAuthenticated ? !PUBLIC_ONLY_NAV_ITEMS.includes(item) : !PRIVATE_NAV_ITEMS.includes(item),
    );
}
