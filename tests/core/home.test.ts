import { describe, expect, it } from "vitest";
import { homePath, safeRedirect } from "@/core/auth/home";
import type { User } from "@/contexts/AuthContext";

const user = (accountType: User["accountType"]): User => ({ accountType, firstName: "", lastName: "", email: "", avatar: null, avatarType: "emoji" });

describe("homePath", () => {
    it.each([
        ["student", false, "/dashboard"],
        ["org_staff", false, "/org"],
        ["platform_admin", false, "/admin/mfa"],
        ["platform_admin", true, "/admin"],
    ] as const)("sends a %s (mfa %s) to %s", (accountType, mfa, expected) => {
        expect(homePath(user(accountType), mfa)).toBe(expected);
    });

    it("treats a legacy cached user as a student", () => {
        expect(homePath(user(undefined), false)).toBe("/dashboard");
    });
});

describe("safeRedirect", () => {
    it.each([
        ["/invitations/abc", "/invitations/abc"],
        ["//evil.example.com", null],
        ["https://evil.example.com", null],
        [null, null],
    ])("%s → %s", (input, expected) => {
        expect(safeRedirect(input)).toBe(expected);
    });
});
