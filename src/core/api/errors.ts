import axios from "axios";

/** Backend error envelope: {"error": {"code", "message", "details"?}} */
export interface ApiErrorBody {
    error?: {
        code?: string;
        message?: string;
    };
}

export function getApiErrorCode(err: unknown): string | undefined {
    if (!axios.isAxiosError<ApiErrorBody>(err)) return undefined;
    return err.response?.data?.error?.code;
}

export function getApiErrorMessage(err: unknown, fallback = "Une erreur est survenue"): string {
    if (!axios.isAxiosError<ApiErrorBody>(err)) return fallback;
    if (!err.response) return "Impossible de joindre le serveur. Vérifie ta connexion.";
    return err.response.data?.error?.message ?? fallback;
}
