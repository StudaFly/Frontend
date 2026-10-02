import { describe, expect, it } from "vitest";
import { visibleNavItems } from "@/components/shared/NavConstants";

describe("visibleNavItems", () => {
    it("shows marketing pages to visitors", () => {
        expect(visibleNavItems(false)).toEqual(["home", "destinations", "about"]);
    });

    it("shows the student space once logged in", () => {
        expect(visibleNavItems(true)).toEqual(["destinations", "dashboard", "timeline", "checklist", "budget", "guide"]);
    });
});
