import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, Button, Card, Field, Input } from "@/components/ui";
import { ConsentPanel } from "@/components/shared/ConsentPanel";
import { PageLoader } from "@/components/shared/PageLoader";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/core/api/errors";
import { acceptInvitation, previewInvitation } from "@/core/api/organizations";
import { formatDate, INVITATION_STATUS, ORG_ROLE_LABELS } from "@/core/labels";

export default function InvitationPage() {
    const { token = "" } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, startSession, refreshUser } = useAuth();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const redirect = encodeURIComponent(`/invitations/${token}`);

    const invitation = useQuery({
        queryKey: ["invitation", token],
        queryFn: () => previewInvitation(token).then((r) => r.data.data),
        retry: false,
    });

    const accept = useMutation({
        mutationFn: (body?: { name: string; password: string }) => acceptInvitation(token, body),
        onSuccess: async ({ data }) => {
            const result = data.data;
            if (result.auth) {
                startSession(result.auth);
                navigate("/org");
            } else {
                await refreshUser();
                navigate("/profile");
            }
            toast.success(`Bienvenue chez ${result.organization.name} !`);
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Impossible d'accepter l'invitation")),
    });

    if (invitation.isLoading) return <PageLoader />;
    if (invitation.isError || !invitation.data) {
        return (
            <div className="mx-auto max-w-lg px-4 py-16">
                <Card title="Invitation introuvable">
                    <p className="text-sm text-gray-600">Ce lien n'est pas valide. Demande à ton école de t'en renvoyer un.</p>
                </Card>
            </div>
        );
    }

    const data = invitation.data;
    const status = INVITATION_STATUS[data.status];
    const isStaff = data.kind === "staff";
    const emailMatches = user?.email.toLowerCase() === data.email.toLowerCase();

    return (
        <div className="mx-auto max-w-xl px-4 py-12">
            <Card
                title={isStaff ? `Rejoindre l'équipe de ${data.organization.name}` : `${data.organization.name} t'invite sur StudaFly`}
                actions={<Badge tone={status.tone}>{status.label}</Badge>}
            >
                <p className="mb-4 text-sm text-gray-600">
                    Invitation envoyée à <strong>{data.email}</strong>
                    {isStaff && data.orgRole && <> en tant que {ORG_ROLE_LABELS[data.orgRole].toLowerCase()}</>}
                    {" "}— valable jusqu'au {formatDate(data.expiresAt)}.
                </p>

                {data.status !== "pending" ? (
                    <p className="text-sm text-gray-700">Cette invitation n'est plus utilisable.</p>
                ) : isStaff ? (
                    isAuthenticated ? (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-700">Tu es connecté·e avec {user?.email}.</p>
                            <Button onClick={() => accept.mutate(undefined)} disabled={accept.isPending || !emailMatches}>
                                Rejoindre l'équipe
                            </Button>
                            {!emailMatches && <p className="text-sm text-red-700">Connecte-toi avec l'adresse invitée.</p>}
                        </div>
                    ) : (
                        <form
                            className="space-y-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                accept.mutate({ name, password });
                            }}
                        >
                            <Field label="Nom complet">
                                <Input value={name} onChange={(e) => setName(e.target.value)} required />
                            </Field>
                            <Field label="Mot de passe" hint="8 caractères minimum">
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                            </Field>
                            <Button type="submit" disabled={accept.isPending}>Créer mon compte et rejoindre l'équipe</Button>
                        </form>
                    )
                ) : !isAuthenticated ? (
                    <div className="space-y-3 text-sm text-gray-700">
                        <p>Connecte-toi ou crée ton compte étudiant avec l'adresse {data.email} pour accepter.</p>
                        <div className="flex flex-wrap gap-2">
                            <Link to={`/login?redirect=${redirect}`} className="rounded-lg bg-primary-light px-4 py-3 font-semibold text-white">Se connecter</Link>
                            <Link to={`/register?redirect=${redirect}`} className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-primary-dark">Créer mon compte</Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <ConsentPanel schoolName={data.organization.name} shared={data.sharedWithSchool} neverShared={data.neverShared} />
                        {!emailMatches && (
                            <p className="text-sm text-red-700">Tu es connecté·e avec {user?.email} : cette invitation est réservée à {data.email}.</p>
                        )}
                        <Button onClick={() => accept.mutate(undefined)} disabled={accept.isPending || !emailMatches}>
                            J'accepte et je rejoins {data.organization.name}
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
