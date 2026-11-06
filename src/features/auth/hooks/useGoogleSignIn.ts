import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { oauthGoogle } from "@/core/api/auth";
import { getApiErrorMessage } from "@/core/api/errors";
import {
    GOOGLE_CLIENT_ID,
    GoogleSignInCancelledError,
    loadGoogleIdentity,
    requestGoogleAuthCode,
} from "@/core/auth/googleIdentity";

interface UseGoogleSignInReturn {
    signInWithGoogle: () => Promise<void>;
    isLoading: boolean;
}

export function useGoogleSignIn(): UseGoogleSignInReturn {
    const navigate = useNavigate();
    const { startSession } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Preload the Google script so the popup opens directly on click (not blocked).
    useEffect(() => {
        if (GOOGLE_CLIENT_ID) loadGoogleIdentity().catch(() => undefined);
    }, []);

    const signInWithGoogle = useCallback(async () => {
        setIsLoading(true);
        try {
            const code = await requestGoogleAuthCode();
            const { data } = await oauthGoogle({ code });
            startSession(data.data);
            if (data.data.isNewUser) {
                toast.success("Bienvenue sur StudaFly ! Décris ta mobilité pour commencer.");
                navigate("/mobility/new");
            } else {
                toast.success("Connexion réussie ! Bienvenue.");
                navigate("/dashboard");
            }
        } catch (err: unknown) {
            if (err instanceof GoogleSignInCancelledError) return;
            const fallback = err instanceof Error ? err.message : "La connexion Google a échoué.";
            toast.error(getApiErrorMessage(err, fallback));
        } finally {
            setIsLoading(false);
        }
    }, [navigate, startSession]);

    return { signInWithGoogle, isLoading };
}
