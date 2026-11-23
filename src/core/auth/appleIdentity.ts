/// <reference types="vite/client" />
// Sign in with Apple JS, popup mode: the backend verifies the identity token (audience =
// Services ID) and exchanges the code to be able to revoke it when the account is deleted.
// https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js

const APPLE_SCRIPT_URL = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/fr_FR/appleid.auth.js";
const APPLE_SCOPES = "name email";
const NONCE_BYTES = 32;
// Errors Apple JS rejects with when the user closes the popup or declines.
const CANCEL_ERRORS = new Set(["popup_closed_by_user", "user_cancelled_authorize"]);

/** Services ID ("Identifiers > Services IDs"), the audience of web identity tokens. */
export const APPLE_SERVICES_ID: string = import.meta.env.VITE_APPLE_SERVICES_ID ?? "";
/** Return URL registered on the Services ID (unused by the popup, but checked by Apple). */
export const APPLE_REDIRECT_URI: string = import.meta.env.VITE_APPLE_REDIRECT_URI ?? "";

interface AppleSignInResponse {
    authorization: { code: string; id_token: string; state?: string };
    /** Shared on the very first authorization only. */
    user?: { email?: string; name?: { firstName?: string; lastName?: string } };
}

interface AppleIdAuth {
    auth: {
        init: (config: {
            clientId: string;
            scope: string;
            redirectURI: string;
            state: string;
            nonce: string;
            usePopup: true;
        }) => void;
        signIn: () => Promise<AppleSignInResponse>;
    };
}

declare global {
    interface Window {
        AppleID?: AppleIdAuth;
    }
}

/** What POST /auth/oauth/apple expects. */
export interface AppleCredential {
    idToken: string;
    authorizationCode: string;
    /** Raw nonce: Apple only received its SHA-256, now inside the identity token. */
    nonce: string;
    firstName?: string;
    lastName?: string;
}

/** The user closed the popup: not an error worth showing. */
export class AppleSignInCancelledError extends Error {
    constructor() {
        super("Connexion Apple annulée");
        this.name = "AppleSignInCancelledError";
    }
}

let scriptPromise: Promise<AppleIdAuth> | null = null;

/** Load the Apple JS script once. Called early (on mount) so the popup opens right on click. */
export function loadAppleIdentity(): Promise<AppleIdAuth> {
    if (window.AppleID?.auth) return Promise.resolve(window.AppleID);
    scriptPromise ??= new Promise<AppleIdAuth>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = APPLE_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () =>
            window.AppleID?.auth ? resolve(window.AppleID) : reject(new Error("Apple indisponible"));
        script.onerror = () => {
            scriptPromise = null;
            script.remove();
            reject(new Error("Impossible de charger Apple. Vérifie ta connexion."));
        };
        document.head.appendChild(script);
    });
    return scriptPromise;
}

function randomHex(bytes: number): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(value: string): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function isCancellation(err: unknown): boolean {
    return typeof err === "object" && err !== null && CANCEL_ERRORS.has((err as { error?: string }).error ?? "");
}

/** Open the Apple popup and resolve with what the backend verifies. */
export async function requestAppleCredential(): Promise<AppleCredential> {
    if (!APPLE_SERVICES_ID || !APPLE_REDIRECT_URI) throw new Error("La connexion Apple n'est pas configurée.");
    const appleId = await loadAppleIdentity();

    const nonce = randomHex(NONCE_BYTES);
    const state = randomHex(16);
    appleId.auth.init({
        clientId: APPLE_SERVICES_ID,
        scope: APPLE_SCOPES,
        redirectURI: APPLE_REDIRECT_URI,
        state,
        nonce: await sha256Hex(nonce),
        usePopup: true,
    });

    let response: AppleSignInResponse;
    try {
        response = await appleId.auth.signIn();
    } catch (err) {
        if (isCancellation(err)) throw new AppleSignInCancelledError();
        throw new Error("La connexion Apple a échoué. Autorise les popups pour ce site et réessaie.");
    }

    const { code, id_token: idToken, state: returnedState } = response.authorization;
    if (!code || !idToken || returnedState !== state) throw new Error("La connexion Apple a échoué.");

    return {
        idToken,
        authorizationCode: code,
        nonce,
        firstName: response.user?.name?.firstName || undefined,
        lastName: response.user?.name?.lastName || undefined,
    };
}
