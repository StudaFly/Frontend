import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth, type User } from "@/contexts/AuthContext";
import { toSessionUser } from "@/contexts/sessionUser";
import { getApiErrorMessage } from "@/core/api/errors";
import { deleteMe, updateMe } from "@/core/api/users";
import { useActiveMobility } from "@/core/hooks/useActiveMobility";
import { useReference } from "@/core/hooks/useReference";
import { ProfileCover } from "../components/ProfileCover";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { PersonalInfoCard } from "../components/PersonalInfoCard";
import { MobilityProjectCard } from "../components/MobilityProjectCard";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();
    const { mobility, destination, isLoading: isMobilityLoading } = useActiveMobility();
    const { avatarEmojis } = useReference();
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState<User | null>(user);

    const save = useMutation({
        mutationFn: (next: User) =>
            updateMe({
                firstName: next.firstName.trim(),
                lastName: next.lastName.trim(),
                phone: (next.phone ?? "").trim(),
                // The emoji is shared with the mobile app; uploaded pictures stay local for now.
                ...(next.avatarType === "emoji" && next.avatar ? { avatarEmoji: next.avatar } : {}),
            }),
        onSuccess: ({ data }, next) => {
            updateUser({ ...toSessionUser(data.data, next), cover: next.cover });
            setIsEditing(false);
            toast.success("Profil mis à jour");
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Impossible d'enregistrer le profil")),
    });

    const removeAccount = useMutation({
        mutationFn: deleteMe,
        onSuccess: () => {
            logout();
            toast.success("Ton compte a été supprimé.");
            navigate("/");
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Impossible de supprimer le compte")),
    });

    if (!user || !draft) return null;

    const update = <K extends keyof User>(field: K, value: User[K]) =>
        setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));

    const startEditing = () => {
        setDraft(user);
        setIsEditing(true);
    };

    const confirmDelete = () => {
        if (
            window.confirm(
                "Supprimer définitivement ton compte ? Ta mobilité et toutes tes tâches seront effacées. Cette action est irréversible.",
            )
        ) {
            removeAccount.mutate();
        }
    };

    const shown = isEditing ? draft : user;

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50 pb-12">
            <ProfileCover coverImage={shown.cover} isEditing={isEditing} onUpload={(url) => update("cover", url)} />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="relative mb-6">
                    <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">
                            <div className="-mt-16 sm:-mt-20">
                                <ProfileAvatar
                                    avatar={shown.avatar}
                                    avatarType={shown.avatarType}
                                    isEditing={isEditing}
                                    onUpload={(url, type) => {
                                        update("avatar", url);
                                        update("avatarType", type);
                                    }}
                                />
                            </div>

                            <div className="mt-4 text-center sm:mt-0 sm:pb-4 sm:text-left">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <input
                                            aria-label="Prénom"
                                            value={draft.firstName}
                                            onChange={(e) => update("firstName", e.target.value)}
                                            className="w-36 rounded-md border border-gray-300 px-3 py-1.5 font-heading text-xl font-bold focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                                        />
                                        <input
                                            aria-label="Nom"
                                            value={draft.lastName}
                                            onChange={(e) => update("lastName", e.target.value)}
                                            className="w-36 rounded-md border border-gray-300 px-3 py-1.5 font-heading text-xl font-bold focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                                        />
                                    </div>
                                ) : (
                                    <h1 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                )}
                                <p className="mt-1 font-medium text-gray-500">Étudiant(e) en préparation</p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2 sm:mt-0 sm:pb-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="rounded-lg px-4 py-2.5 font-semibold text-gray-600 hover:bg-gray-100"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={() => save.mutate(draft)}
                                        disabled={save.isPending || !draft.firstName.trim()}
                                        className="rounded-lg bg-secondary px-6 py-2.5 font-bold text-primary-dark hover:bg-secondary/80 disabled:opacity-50"
                                    >
                                        {save.isPending ? "Enregistrement…" : "Enregistrer"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={startEditing}
                                    className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 font-semibold text-primary-dark shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50"
                                >
                                    <Edit2 className="h-4 w-4" aria-hidden />
                                    Modifier le profil
                                </button>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start" role="radiogroup" aria-label="Avatar">
                            {avatarEmojis.map((emoji) => {
                                const selected = draft.avatarType === "emoji" && draft.avatar === emoji;
                                return (
                                    <button
                                        key={emoji}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        aria-label={`Avatar ${emoji}`}
                                        onClick={() => {
                                            update("avatar", emoji);
                                            update("avatarType", "emoji");
                                        }}
                                        className={`h-11 w-11 rounded-lg border-2 text-2xl ${selected ? "border-secondary bg-secondary/10" : "border-transparent bg-white"}`}
                                    >
                                        {emoji}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <PersonalInfoCard
                        email={shown.email}
                        phone={shown.phone ?? ""}
                        isEditing={isEditing}
                        onUpdate={(field, value) => update(field, value)}
                    />
                    <MobilityProjectCard mobility={mobility} destination={destination} isLoading={isMobilityLoading} />
                </div>

                <section className="mt-10 rounded-2xl border border-red-200 bg-white p-6">
                    <h2 className="font-heading text-lg font-bold text-red-700">Zone de danger</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        La suppression du compte efface toutes tes données (RGPD). Elle est définitive.
                    </p>
                    <button
                        onClick={confirmDelete}
                        disabled={removeAccount.isPending}
                        className="mt-4 flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Supprimer mon compte
                    </button>
                </section>
            </div>
        </div>
    );
}
