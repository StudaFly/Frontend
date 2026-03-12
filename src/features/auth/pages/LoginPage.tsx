import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { AuthSidePanel } from "../components/AuthSidePanel";
import { AuthDivider } from "../components/AuthDivider";
import { SocialAuthButtons } from "../components/SocialAuthButtons";
import { AuthPageHeader } from "../components/AuthPageHeader";
import { AuthFormField } from "../components/AuthFormField";
import { PasswordField } from "../components/PasswordField";
import { RememberMeRow } from "../components/RememberMeRow";

const SIDE_PANEL_IMAGE =
    "https://images.unsplash.com/photo-1752650143236-b028e8778b0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export default function LoginPage() {
    const { email, setEmail, password, setPassword, remember, setRemember, isLoading, handleSubmit } = useLogin();

    return (
        <div className="flex min-h-screen bg-background-light">
            <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
                <div className="w-full max-w-md">
                    <AuthPageHeader
                        title="Bon retour !"
                        subtitle="Connectez-vous pour continuer votre préparation"
                    />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AuthFormField
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre.email@exemple.com"
                            icon={Mail}
                            required
                        />

                        <PasswordField
                            id="password"
                            label="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <RememberMeRow remember={remember} onRememberChange={setRemember} />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-secondary py-3 font-bold text-primary-dark transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? "Connexion..." : "Se connecter"}
                        </button>

                        <AuthDivider label="Ou continuer avec" />
                        <SocialAuthButtons />
                    </form>

                    <p className="mt-8 text-center text-gray-600">
                        Pas encore de compte ?{" "}
                        <Link to="/register" className="font-semibold text-secondary transition-colors hover:text-secondary/80">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>

            <AuthSidePanel
                title="Reprenez votre parcours là où vous l'aviez laissé"
                subtitle="Votre timeline personnalisée vous attend"
                imageUrl={SIDE_PANEL_IMAGE}
                imageAlt="Étudiant heureux"
            />
        </div>
    );
}
