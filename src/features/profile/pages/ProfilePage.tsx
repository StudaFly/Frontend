import { useState, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileCover } from "../components/ProfileCover";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { PersonalInfoCard } from "../components/PersonalInfoCard";
import { MobilityProjectCard } from "../components/MobilityProjectCard";

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // We maintain a draft of the user object while editing
    const [draftUser, setDraftUser] = useState(user);

    useEffect(() => {
        setDraftUser(user);
    }, [user]);

    if (!user || !draftUser) return null;

    const handleUpdate = (field: string, value: string | string[]) => {
        setDraftUser((prev) => prev ? { ...prev, [field]: value } : prev);
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Save changes
            if (draftUser) {
                updateUser(draftUser);
            }
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50 pb-12">
            <ProfileCover
                coverImage={draftUser.cover}
                isEditing={isEditing}
                onUpload={(url) => handleUpdate("cover", url)}
            />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="relative mb-6">
                    {/* Header Info Area */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">
                            <div className="-mt-16 sm:-mt-20">
                                <ProfileAvatar
                                    avatar={draftUser.avatar}
                                    avatarType={draftUser.avatarType}
                                    isEditing={isEditing}
                                    onUpload={(url, type) => {
                                        handleUpdate("avatar", url);
                                        handleUpdate("avatarType", type);
                                    }}
                                />
                            </div>

                            <div className="mt-4 text-center sm:mt-0 sm:pb-4 sm:text-left">
                                <h1 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
                                    {draftUser.firstName} {draftUser.lastName}
                                </h1>
                                <p className="mt-1 font-medium text-gray-500">Étudiant(e) en préparation</p>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-0 sm:pb-4">
                            <button
                                onClick={toggleEdit}
                                className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 font-semibold text-primary-dark shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50"
                            >
                                <Edit2 className="h-4 w-4" />
                                {isEditing ? "Enregistrer" : "Modifier le profil"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grids */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <PersonalInfoCard
                        email={draftUser.email}
                        age={draftUser.age || ""}
                        city={draftUser.city || ""}
                        isEditing={isEditing}
                        onUpdate={handleUpdate}
                    />

                    <MobilityProjectCard
                        destinations={draftUser.destinations || []}
                        period={draftUser.period || ""}
                        budget={draftUser.budget || ""}
                        isEditing={isEditing}
                        onUpdate={handleUpdate}
                    />
                </div>
            </div>
        </div>
    );
}
