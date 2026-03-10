import { Camera } from "lucide-react";

interface ProfileCoverProps {
    coverImage?: string | null;
    isEditing?: boolean;
    onUpload?: (url: string) => void;
}

export function ProfileCover({ coverImage, isEditing, onUpload }: ProfileCoverProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUpload) {
            onUpload(URL.createObjectURL(file));
        }
    };

    return (
        <div className="relative h-48 w-full bg-secondary sm:h-64">
            {coverImage ? (
                <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary-dark opacity-90" />
            )}

            {isEditing && (
                <label className="absolute bottom-4 right-4 flex cursor-pointer items-center gap-2 rounded-lg bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/60">
                    <Camera className="h-4 w-4" />
                    <span className="hidden sm:inline">Changer la couverture</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            )}
        </div>
    );
}
