/// <reference types="vite/client" />
// Google Identity Services (GIS), authorization-code flow in a popup:
// the backend exchanges the code for an ID token with the client secret.
// https://developers.google.com/identity/oauth2/web/guides/use-code-model

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GOOGLE_SCOPES = "openid email profile";

export const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

interface CodeResponse {
    code?: string;
    error?: string;
    error_description?: string;
}

interface CodeClientConfig {
    client_id: string;
    scope: string;
    ux_mode: "popup";
    callback: (response: CodeResponse) => void;
    error_callback?: (error: { type: string }) => void;
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

/** The user closed the popup: not an error worth showing. */
export class GoogleSignInCancelledError extends Error {
    constructor() {
        super("Connexion Google annulée");
        this.name = "GoogleSignInCancelledError";
    }
}

let scriptPromise: Promise<GoogleIdentityServices> | null = null;

/** Load the GIS script once. Called early (on mount) so the popup opens right on click. */
export function loadGoogleIdentity(): Promise<GoogleIdentityServices> {
    if (window.google?.accounts?.oauth2) return Promise.resolve(window.google);
    scriptPromise ??= new Promise<GoogleIdentityServices>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = GIS_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () =>
            window.google?.accounts?.oauth2 ? resolve(window.google) : reject(new Error("Google indisponible"));
        script.onerror = () => {
            scriptPromise = null;
            script.remove();
            reject(new Error("Impossible de charger Google. Vérifie ta connexion."));
        };
        document.head.appendChild(script);
    });
    return scriptPromise;
}

/** Open the Google popup and resolve with the authorization code. */
export async function requestGoogleAuthCode(): Promise<string> {
    if (!GOOGLE_CLIENT_ID) throw new Error("La connexion Google n'est pas configurée.");
    const google = await loadGoogleIdentity();

    return new Promise<string>((resolve, reject) => {
        google.accounts.oauth2
            .initCodeClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: GOOGLE_SCOPES,
                ux_mode: "popup",
                callback: (response) => {
                    if (response.code) resolve(response.code);
                    else if (response.error === "access_denied") reject(new GoogleSignInCancelledError());
                    else reject(new Error(response.error_description ?? "La connexion Google a échoué."));
                },
                error_callback: (error) => {
                    reject(
                        error.type === "popup_closed"
                            ? new GoogleSignInCancelledError()
                            : new Error("Impossible d'ouvrir la fenêtre Google. Autorise les popups pour ce site."),
                    );
                },
            })
            .requestCode();
    });
}
