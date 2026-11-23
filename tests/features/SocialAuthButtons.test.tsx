import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";

// The Google and Apple flows themselves are covered by their own tests.
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));
const signInWithGoogle = vi.hoisted(() => vi.fn());
vi.mock("@/features/auth/hooks/useGoogleSignIn", () => ({
    useGoogleSignIn: () => ({ signInWithGoogle, isLoading: false }),
}));
const signInWithApple = vi.hoisted(() => vi.fn());
vi.mock("@/features/auth/hooks/useAppleSignIn", () => ({
    useAppleSignIn: () => ({ signInWithApple, isLoading: false }),
}));

describe("SocialAuthButtons", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("starts the Google sign-in", async () => {
        render(<SocialAuthButtons />);

        await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: /google/i }));

        expect(signInWithGoogle).toHaveBeenCalledTimes(1);
    });

    it("starts the Apple sign-in", async () => {
        render(<SocialAuthButtons />);

        await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: /apple/i }));

        expect(signInWithApple).toHaveBeenCalledTimes(1);
        expect(signInWithGoogle).not.toHaveBeenCalled();
    });

    it("announces Microsoft as coming soon", async () => {
        render(<SocialAuthButtons />);

        await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: /microsoft/i }));

        expect(toast.info).toHaveBeenCalledTimes(1);
        expect(signInWithGoogle).not.toHaveBeenCalled();
        expect(signInWithApple).not.toHaveBeenCalled();
    });
});
