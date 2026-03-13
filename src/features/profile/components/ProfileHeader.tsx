import { Edit2 } from "lucide-react";
import { ProfileAvatar } from "./ProfileAvatar";
import type { User } from "@/contexts/AuthContext";

interface ProfileHeaderProps {
    user: User;
    isEditing: boolean;
    onToggleEdit: () => void;
    onAvatarUpload: (url: string, type: "image" | "emoji") => void;
    school?: string;
}

export function ProfileHeader({ user, isEditing, onToggleEdit, onAvatarUpload, school }: ProfileHeaderProps) {
    return (
        <div className="relative mb-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">
                    <div className="-mt-16 sm:-mt-20">
                        <ProfileAvatar
                            avatar={user.avatar}
                            avatarType={user.avatarType}
                            isEditing={isEditing}
                            onUpload={onAvatarUpload}
                        />
                    </div>
                    <div className="mt-4 text-center sm:mt-0 sm:pb-4 sm:text-left">
                        <h1 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="mt-1 font-medium text-gray-500">
                            {school ? school : "Étudiant(e) en préparation"}
                        </p>
                    </div>
                </div>

                <div className="mt-6 sm:mt-0 sm:pb-4">
                    <button
                        onClick={onToggleEdit}
                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 font-semibold text-primary-dark shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50"
                    >
                        <Edit2 className="h-4 w-4" />
                        {isEditing ? "Enregistrer" : "Modifier le profil"}
                    </button>
                </div>
            </div>
        </div>
    );
}
