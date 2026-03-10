import { Mail } from "lucide-react";
import { AuthFormField } from "./AuthFormField";
import { PasswordField } from "./PasswordField";
import { AuthDivider } from "./AuthDivider";
import { SocialAuthButtons } from "./SocialAuthButtons";

interface RegisterStep1Props {
    formData: any;
    updateForm: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function RegisterStep1({ formData, updateForm, onSubmit }: RegisterStep1Props) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <AuthFormField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={updateForm("email")}
                placeholder="votre.email@exemple.com"
                icon={Mail}
                required
            />

            <PasswordField
                id="password"
                label="Mot de passe"
                value={formData.password}
                onChange={updateForm("password")}
                required
            />

            <PasswordField
                id="confirmPassword"
                label="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChange={updateForm("confirmPassword")}
                required
            />

            {/* Terms */}
            <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    id="terms"
                    checked={formData.acceptTerms}
                    onChange={updateForm("acceptTerms")}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-secondary focus:ring-secondary"
                    required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                    J'accepte les{" "}
                    <a href="#" className="text-secondary transition-colors hover:text-secondary/80">
                        conditions d'utilisation
                    </a>{" "}
                    et la{" "}
                    <a href="#" className="text-secondary transition-colors hover:text-secondary/80">
                        politique de confidentialité
                    </a>
                </label>
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-secondary py-3 font-bold text-primary-dark transition-colors hover:bg-secondary/80"
            >
                Continuer →
            </button>

            <AuthDivider label="Ou s'inscrire avec" />
            <SocialAuthButtons />
        </form>
    );
}
