import { Camera } from "lucide-react";

interface ProfileAvatarProps {
    avatar: string | null;
    avatarType: "image" | "emoji";
    isEditing?: boolean;
    onUpload?: (url: string, type: "image" | "emoji") => void;
}

export function ProfileAvatar({ avatar, avatarType, isEditing, onUpload }: ProfileAvatarProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUpload) {
            onUpload(URL.createObjectURL(file), "image");
        }
    };

    return (
        <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-40 sm:w-40">
                {avatarType === "image" && avatar ? (
                    <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                    <span className="text-6xl sm:text-7xl">{avatar || "👋"}</span>
                )}
            </div>
            {isEditing && (
                <label className="absolute bottom-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-dark text-white shadow-md transition-transform hover:scale-105">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            )}
        </div>
    );
}
