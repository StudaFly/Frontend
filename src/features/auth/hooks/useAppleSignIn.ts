import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { oauthApple } from "@/core/api/auth";
import { getApiErrorMessage } from "@/core/api/errors";
import {
    APPLE_SERVICES_ID,
    AppleSignInCancelledError,
    loadAppleIdentity,
    requestAppleCredential,
} from "@/core/auth/appleIdentity";

interface UseAppleSignInReturn {
    signInWithApple: () => Promise<void>;
    isLoading: boolean;
}

export function useAppleSignIn(): UseAppleSignInReturn {
    const navigate = useNavigate();
    const { startSession } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Preload the Apple script so the popup opens directly on click (not blocked).
    useEffect(() => {
        if (APPLE_SERVICES_ID) loadAppleIdentity().catch(() => undefined);
    }, []);

    const signInWithApple = useCallback(async () => {
        setIsLoading(true);
        try {
            const credential = await requestAppleCredential();
            const { data } = await oauthApple(credential);
            startSession(data.data);
            if (data.data.isNewUser) {
                toast.success("Bienvenue sur StudaFly ! Décris ta mobilité pour commencer.");
                navigate("/mobility/new");
            } else {
                toast.success("Connexion réussie ! Bienvenue.");
                navigate("/dashboard");
            }
        } catch (err: unknown) {
            if (err instanceof AppleSignInCancelledError) return;
            const fallback = err instanceof Error ? err.message : "La connexion Apple a échoué.";
            toast.error(getApiErrorMessage(err, fallback));
        } finally {
            setIsLoading(false);
        }
    }, [navigate, startSession]);

    return { signInWithApple, isLoading };
}
