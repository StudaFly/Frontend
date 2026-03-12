interface RememberMeRowProps {
    remember: boolean;
    onRememberChange: (checked: boolean) => void;
}

export function RememberMeRow({ remember, onRememberChange }: RememberMeRowProps) {
    return (
        <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
                <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => onRememberChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            <a href="#" className="text-sm text-secondary transition-colors hover:text-secondary/80">
                Mot de passe oublié ?
            </a>
        </div>
    );
}
