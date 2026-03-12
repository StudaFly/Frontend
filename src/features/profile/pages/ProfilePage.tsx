import { useProfileEdit } from "../hooks/useProfileEdit";
import { ProfileCover } from "../components/ProfileCover";
import { ProfileHeader } from "../components/ProfileHeader";
import { PersonalInfoCard } from "../components/PersonalInfoCard";
import { MobilityProjectCard } from "../components/MobilityProjectCard";

export default function ProfilePage() {
    const { user, draftUser, isEditing, handleUpdate, toggleEdit } = useProfileEdit();

    if (!user || !draftUser) return null;

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50 pb-12">
            <ProfileCover
                coverImage={draftUser.cover}
                isEditing={isEditing}
                onUpload={(url) => handleUpdate("cover", url)}
            />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <ProfileHeader
                    user={draftUser}
                    isEditing={isEditing}
                    onToggleEdit={toggleEdit}
                    onAvatarUpload={(url, type) => {
                        handleUpdate("avatar", url);
                        handleUpdate("avatarType", type);
                    }}
                />

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
