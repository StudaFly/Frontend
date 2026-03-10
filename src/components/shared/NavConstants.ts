export const NAV_ITEMS = ["home", "destinations", "checklist", "timeline", "about"] as const;
export type NavItem = (typeof NAV_ITEMS)[number];

export function getNavPath(item: NavItem): string {
    return item === "home" ? "/" : `/${item}`;
}
