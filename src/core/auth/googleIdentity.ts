/**
 * Google sign-in on the web with Google Identity Services (GIS), popup + authorization code.
 *
 * The code is sent to POST /auth/oauth/google: the backend exchanges it (redirect_uri
 * "postmessage", client secret kept server-side) and verifies the resulting ID token.
 */

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GOOGLE_SCOPES = "openid email profile";

export const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

interface CodeResponse {
    code?: string;
    error?: string;
    error_description?: string;
}

interface CodeClientError {
    type: "popup_closed" | "popup_failed_to_open" | "unknown";
}

interface CodeClientConfig {
    client_id: string;
    scope: string;
    ux_mode: "popup";
    callback: (response: CodeResponse) => void;
    error_callback?: (error: CodeClientError) => void;
}

interface GoogleIdentityServices {
    accounts: {
        oauth2: {
            initCodeClient: (config: CodeClientConfig) => { requestCode: () => void };
        };
    };
}

declare global {
    interface Window {
        google?: GoogleIdentityServices;
    }
}

let scriptPromise: Promise<GoogleIdentityServices> | null = null;

function loadGoogleIdentityServices(): Promise<GoogleIdentityServices> {
    if (window.google?.accounts?.oauth2) return Promise.resolve(window.google);
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise<GoogleIdentityServices>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = GIS_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.google?.accounts?.oauth2) resolve(window.google);
            else reject(new Error("Google Identity Services indisponible."));
        };
        script.onerror = () => reject(new Error("Impossible de charger la connexion Google. Vérifie ta connexion."));
        document.head.appendChild(script);
    }).catch((err: unknown) => {
        scriptPromise = null; // allow a retry
        throw err;
    });
    return scriptPromise;
}

/**
 * Opens the Google popup and resolves with an authorization code,
 * or null when the user closes the popup / refuses consent.
 */
export async function requestGoogleAuthCode(): Promise<string | null> {
    if (!GOOGLE_CLIENT_ID) {
        throw new Error("La connexion Google n'est pas configurée (VITE_GOOGLE_CLIENT_ID manquant).");
    }
    const google = await loadGoogleIdentityServices();

    return new Promise<string | null>((resolve, reject) => {
        const client = google.accounts.oauth2.initCodeClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: GOOGLE_SCOPES,
            ux_mode: "popup",
            callback: (response) => {
                if (response.code) resolve(response.code);
                else if (response.error === "access_denied") resolve(null);
                else reject(new Error("La connexion avec Google a échoué. Réessaie."));
            },
            error_callback: (error) => {
                if (error.type === "popup_closed") resolve(null);
                else if (error.type === "popup_failed_to_open")
                    reject(new Error("La fenêtre Google a été bloquée. Autorise les popups pour ce site."));
                else reject(new Error("La connexion avec Google a échoué. Réessaie."));
            },
        });
        client.requestCode();
    });
}
