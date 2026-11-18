import type { Tone } from "@/components/ui";

export const ZONE_LABELS: Record<string, string> = {
    europe: "Europe",
    africa: "Afrique",
    north_america: "Amérique du Nord",
    latin_america: "Amérique latine",
    asia: "Asie",
    middle_east: "Moyen-Orient",
    oceania: "Océanie",
};

export const FOLLOW_UP: Record<string, { label: string; tone: Tone }> = {
    ok: { label: "En bonne voie", tone: "green" },
    warning: { label: "En retard", tone: "amber" },
    danger: { label: "Critique", tone: "red" },
};

export const ORG_ROLE_LABELS: Record<string, string> = { manager: "Manager", advisor: "Conseiller·ère" };

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
    student: "Étudiant",
    org_staff: "Personnel RI",
    platform_admin: "Admin plateforme",
};

export const USER_STATUS: Record<string, { label: string; tone: Tone }> = {
    active: { label: "Actif", tone: "green" },
    suspended: { label: "Suspendu", tone: "red" },
    pending_deletion: { label: "Suppression programmée", tone: "amber" },
};

export const ORG_STATUS: Record<string, { label: string; tone: Tone }> = {
    active: { label: "Active", tone: "green" },
    suspended: { label: "Suspendue", tone: "red" },
    archived: { label: "Archivée", tone: "gray" },
};

export const CONTRACT_STATUS: Record<string, { label: string; tone: Tone }> = {
    pilot: { label: "Pilote", tone: "blue" },
    active: { label: "Actif", tone: "green" },
    expired: { label: "Expiré", tone: "gray" },
    suspended: { label: "Suspendu", tone: "red" },
    cancelled: { label: "Résilié", tone: "red" },
};

export const INVITATION_STATUS: Record<string, { label: string; tone: Tone }> = {
    pending: { label: "En attente", tone: "amber" },
    accepted: { label: "Acceptée", tone: "green" },
    revoked: { label: "Révoquée", tone: "gray" },
    expired: { label: "Expirée", tone: "gray" },
};

export const PREMIUM_SOURCE_LABELS: Record<string, string> = {
    purchase: "achat",
    admin_grant: "offert par StudaFly",
    organization: "offert par ton école",
    grandfathered: "conservé jusqu'à la fin de ta mobilité",
};

export const SHARED_DATA_LABELS: Record<string, string> = {
    profile: "Ton profil (nom, email, téléphone)",
    mobilities: "Tes mobilités (destination, dates, type)",
    tasks: "Tes tâches et leur échéance",
    progress: "Ta progression",
    document_status: "Le statut de tes documents (déposé ou manquant, catégorie, date)",
    staff_notes: "Des notes internes que l'équipe RI peut prendre sur ton suivi",
    document_content: "Le contenu de tes documents (passeport, visa…)",
};

export const formatDate = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const formatPrice = (cents: number | null | undefined, currency = "EUR") =>
    cents === null || cents === undefined ? "—" : (cents / 100).toLocaleString("fr-FR", { style: "currency", currency });
