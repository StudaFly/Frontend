import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";

// The Google flow itself is covered by GoogleSignIn.test.tsx.
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));
const signInWithGoogle = vi.hoisted(() => vi.fn());
vi.mock("@/features/auth/hooks/useGoogleSignIn", () => ({
    useGoogleSignIn: () => ({ signInWithGoogle, isLoading: false }),
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

    it("announces Apple and Microsoft as coming soon", async () => {
        render(<SocialAuthButtons />);
        const user = userEvent.setup({ delay: null });

        await user.click(screen.getByRole("button", { name: /apple/i }));
        await user.click(screen.getByRole("button", { name: /microsoft/i }));

        expect(toast.info).toHaveBeenCalledTimes(2);
        expect(signInWithGoogle).not.toHaveBeenCalled();
    });
});
