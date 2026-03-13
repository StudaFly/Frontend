import { useState, useEffect } from "react";
import { useProfileEdit } from "../hooks/useProfileEdit";
import { ProfileCover } from "../components/ProfileCover";
import { ProfileHeader } from "../components/ProfileHeader";
import { PersonalInfoCard } from "../components/PersonalInfoCard";
import { MobilityProjectCard } from "../components/MobilityProjectCard";
import { useMobility } from "@/core/hooks/useMobility";
import { getDestination, type Destination } from "@/core/api/destinations";
import { updateMobility, type Mobility } from "@/core/api/mobilities";

export default function ProfilePage() {
    const { user, draftUser, isEditing, handleUpdate, toggleEdit } = useProfileEdit();
    const { mobility } = useMobility();
    const [destination, setDestination] = useState<Destination | undefined>();
    const [draftMobility, setDraftMobility] = useState<Partial<Mobility>>({});

    useEffect(() => {
        if (mobility?.destinationId) {
            getDestination(mobility.destinationId)
                .then(({ data }) => setDestination(data.data))
                .catch(() => {});
        }
    }, [mobility?.destinationId]);

    useEffect(() => {
        if (mobility) setDraftMobility(mobility);
    }, [mobility]);

    const handleMobilityUpdate = (field: keyof Mobility, value: string) => {
        setDraftMobility((prev) => ({ ...prev, [field]: value }));
    };

    const handleToggleEdit = () => {
        if (isEditing && mobility?.id) {
            updateMobility(mobility.id, draftMobility).catch(() => {});
        }
        toggleEdit();
    };

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
                    onToggleEdit={handleToggleEdit}
                    onAvatarUpload={(url, type) => {
                        handleUpdate("avatar", url);
                        handleUpdate("avatarType", type);
                    }}
                    school={mobility?.school}
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
                        mobility={mobility}
                        destination={destination}
                        draftMobility={draftMobility}
                        onMobilityUpdate={handleMobilityUpdate}
                    />
                </div>
            </div>
        </div>
    );
}
