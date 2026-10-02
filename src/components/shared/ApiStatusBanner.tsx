import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ServerCrash } from "lucide-react";
import { getHealth } from "@/core/api/reference";
import { API_BASE_URL } from "@/core/api/client";

const SERVICE_NAMES: Record<string, string> = {
    database: "la base de données (PostgreSQL)",
    cache: "Redis",
};

/** Services reported as unreachable by GET /health (503), or null if the API itself is unreachable. */
function unreachableServices(error: unknown): string[] | null {
    if (!axios.isAxiosError(error) || error.response?.status !== 503) return null;
    const details = (error.response.data as { error?: { details?: Record<string, string> } })?.error?.details ?? {};
    return Object.entries(details)
        .filter(([, state]) => state !== "ok")
        .map(([name]) => SERVICE_NAMES[name] ?? name);
}

/** Shown when the backend or one of its services is down, so a failure is never silent. */
export function ApiStatusBanner() {
    const health = useQuery({
        queryKey: ["api-health"],
        queryFn: getHealth,
        retry: false,
        staleTime: 30_000,
        refetchInterval: (query) => (query.state.status === "error" ? 10_000 : false),
    });

    if (!health.isError) return null;

    const services = unreachableServices(health.error);
    const message = services
        ? `L'API répond, mais ${services.join(" et ")} ${services.length > 1 ? "sont injoignables" : "est injoignable"}. Lance `
        : `Impossible de joindre l'API (${API_BASE_URL}). Vérifie que le backend est lancé : `;

    return (
        <div role="alert" className="flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-sm font-medium text-white">
            <ServerCrash className="h-4 w-4 shrink-0" aria-hidden />
            <span>
                {message}
                <code>{services ? "make services" : "make dev"}</code> dans <code>backend/</code>.
            </span>
        </div>
    );
}
