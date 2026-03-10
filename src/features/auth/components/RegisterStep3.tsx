import { Camera } from "lucide-react";

interface RegisterStep3Props {
    avatar: string | null;
    avatarType: "image" | "emoji";
    selectedEmoji: string;
    emojis: string[];
    onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectEmoji: (emoji: string) => void;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function RegisterStep3({
    avatar,
    avatarType,
    selectedEmoji,
    emojis,
    onAvatarUpload,
    onSelectEmoji,
    onBack,
    onSubmit,
}: RegisterStep3Props) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="text-center">
                <p className="mb-6 text-sm text-gray-500">
                    Ajoutez une photo de profil ou choisissez un emoji pour personnaliser votre espace
                </p>

                <div className="relative mx-auto h-32 w-32">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                        {avatarType === "image" && avatar ? (
                            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <span className="select-none text-6xl">{selectedEmoji}</span>
                        )}
                    </div>

                    <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-md transition-colors hover:bg-secondary/80"
                    >
                        <Camera size={18} />
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onAvatarUpload}
                        />
                    </label>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
                {emojis.map((emoji) => (
                    <button
                        key={emoji}
                        type="button"
                        onClick={() => onSelectEmoji(emoji)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-2xl transition-all hover:scale-110 ${avatarType === "emoji" && selectedEmoji === emoji
                                ? "bg-secondary/20 ring-2 ring-secondary"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                    ← Retour
                </button>
                <button
                    type="submit"
                    className="flex-1 rounded-lg bg-secondary py-3 font-bold text-primary-dark transition-colors hover:bg-secondary/80"
                >
                    Terminer l'inscription
                </button>
            </div>

            <div className="text-center">
                <button type="submit" className="text-sm text-gray-400 transition-colors hover:text-gray-600">
                    Passer cette étape
                </button>
            </div>
        </form>
    );
}
