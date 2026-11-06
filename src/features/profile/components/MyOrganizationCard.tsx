import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Building2, Crown } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, ConfirmDialog, Field, Input } from "@/components/ui";
import { ConsentPanel } from "@/components/shared/ConsentPanel";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/core/api/errors";
import { joinOrganization, previewByCode } from "@/core/api/organizations";
import { leaveOrganization } from "@/core/api/users";
import { formatDate, PREMIUM_SOURCE_LABELS } from "@/core/labels";

export function MyOrganizationCard() {
    const { user, refreshUser } = useAuth();
    const [code, setCode] = useState("");
    const [confirmLeave, setConfirmLeave] = useState(false);

    const preview = useMutation({
        mutationFn: (value: string) => previewByCode(value).then((r) => r.data.data),
        onError: (err) => toast.error(getApiErrorMessage(err, "Aucune école ne correspond à ce code")),
    });
    const join = useMutation({
        mutationFn: () => joinOrganization(code),
        onSuccess: async ({ data }) => {
            await refreshUser();
            preview.reset();
            setCode("");
            toast.success(`Tu as rejoint ${data.data.name}`);
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Impossible de rejoindre cette école")),
    });
    const leave = useMutation({
        mutationFn: leaveOrganization,
        onSuccess: async () => {
            await refreshUser();
            setConfirmLeave(false);
            toast.success("Tu as quitté ton établissement");
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Impossible de quitter l'établissement")),
    });

    if (!user) return null;
    const organization = user.organization;
    const premium = user.premium;

    return (
        <Card title="Mon établissement">
            {premium && (
                <p className="mb-4 flex items-center gap-2 text-sm text-gray-700">
                    <Crown className="h-4 w-4 text-secondary" aria-hidden />
                    {premium.active ? (
                        <>
                            Premium actif — {PREMIUM_SOURCE_LABELS[premium.source ?? ""] ?? ""}
                            {premium.until && ` (jusqu'au ${formatDate(premium.until)})`}
                        </>
                    ) : (
                        "Offre gratuite « Essentiel »"
                    )}
                </p>
            )}

            {organization ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span
                            className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                            style={{ backgroundColor: organization.branding?.primary_color ?? "#33518A" }}
                            aria-hidden
                        >
                            {organization.logoUrl ? <img src={organization.logoUrl} alt="" className="h-10 w-10 object-contain" /> : <Building2 className="h-6 w-6" />}
                        </span>
                        <div>
                            <p className="font-heading font-bold text-primary-dark">{organization.name}</p>
                            <Badge tone="green">Rattaché·e</Badge>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setConfirmLeave(true)}>Quitter l'établissement</Button>
                </div>
            ) : preview.data ? (
                <div className="space-y-4">
                    <ConsentPanel
                        schoolName={preview.data.organization.name}
                        shared={preview.data.sharedWithSchool}
                        neverShared={preview.data.neverShared}
                    />
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => preview.reset()}>Annuler</Button>
                        <Button onClick={() => join.mutate()} disabled={join.isPending}>
                            J'accepte et je rejoins {preview.data.organization.name}
                        </Button>
                    </div>
                </div>
            ) : (
                <form
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        preview.mutate(code);
                    }}
                >
                    <p className="text-sm text-gray-600">Ton école utilise StudaFly ? Saisis le code qu'elle t'a communiqué.</p>
                    <Field label="Code d'école">
                        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ABCDE-12345" required minLength={4} />
                    </Field>
                    <Button type="submit" disabled={preview.isPending}>Continuer</Button>
                </form>
            )}

            {confirmLeave && organization && (
                <ConfirmDialog
                    title="Quitter l'établissement ?"
                    description={
                        <>
                            <p>{organization.name} ne verra plus ton suivi.</p>
                            {premium?.source === "organization" && (
                                <p className="mt-2 font-semibold text-red-700">
                                    Le Premium offert par ton école s'arrête immédiatement : il n'est pas conservé après un départ volontaire.
                                </p>
                            )}
                        </>
                    }
                    confirmLabel="Quitter"
                    pending={leave.isPending}
                    onConfirm={() => leave.mutate()}
                    onClose={() => setConfirmLeave(false)}
                />
            )}
        </Card>
    );
}
