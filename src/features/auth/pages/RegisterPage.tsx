import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AuthSidePanel } from "../components/AuthSidePanel";
import { AuthPageHeader } from "../components/AuthPageHeader";
import { RegisterStepProgress } from "../components/RegisterStepProgress";
import { RegisterStep1 } from "../components/RegisterStep1";
import { RegisterStep2 } from "../components/RegisterStep2";
import { RegisterStep3 } from "../components/RegisterStep3";

const SIDE_PANEL_IMAGE =
    "https://images.unsplash.com/photo-1761295231159-4eb997ccca2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const EMOJIS = ["👋", "😎", "🚀", "🌍", "✈️", "💡", "🎯", "🎓", "🎉", "🔥", "✨", "🌟", "🤓", "📚", "🎒"];

type Step = 1 | 2 | 3;

export default function RegisterPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(1);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
        firstName: "",
        lastName: "",
    });

    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarType, setAvatarType] = useState<"image" | "emoji">("emoji");
    const [selectedEmoji, setSelectedEmoji] = useState<string>("👋");

    const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        setError("");
        setStep(2);
    };

    const handleStep2 = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handleStep3 = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalAvatar = avatarType === "emoji" ? selectedEmoji : avatar;

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: "Création de votre compte...",
                success: () => {
                    login({
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        avatar: finalAvatar,
                        avatarType: avatarType,
                    });
                    navigate("/");
                    return `Bienvenue ${formData.firstName} ! Votre compte a été créé.`;
                },
                error: "Erreur lors de la création du compte",
            }
        );
        console.log("Registering user:", { ...formData, avatar: finalAvatar, avatarType });
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(URL.createObjectURL(file));
            setAvatarType("image");
        }
    };

    const handleSelectEmoji = (emoji: string) => {
        setSelectedEmoji(emoji);
        setAvatarType("emoji");
    };

    return (
        <div className="flex min-h-screen bg-background-light">
            <AuthSidePanel
                title="Rejoignez 400 000+ étudiants européens"
                subtitle="Transformez votre préparation de mobilité en un parcours structuré"
                imageUrl={SIDE_PANEL_IMAGE}
                imageAlt="Étudiants voyageant"
            />

            <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
                <div className="w-full max-w-md">
                    <AuthPageHeader
                        title="Créer un compte"
                        subtitle="Commencez votre préparation en quelques minutes"
                    />

                    <RegisterStepProgress currentStep={step} />

                    {error && (
                        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
                    )}

                    {step === 1 && (
                        <RegisterStep1 formData={formData} updateForm={updateForm} onSubmit={handleStep1} />
                    )}

                    {step === 2 && (
                        <RegisterStep2
                            formData={formData}
                            updateForm={updateForm}
                            onBack={() => setStep(1)}
                            onSubmit={handleStep2}
                        />
                    )}

                    {step === 3 && (
                        <RegisterStep3
                            avatar={avatar}
                            avatarType={avatarType}
                            selectedEmoji={selectedEmoji}
                            emojis={EMOJIS}
                            onAvatarUpload={handleAvatarUpload}
                            onSelectEmoji={handleSelectEmoji}
                            onBack={() => setStep(2)}
                            onSubmit={handleStep3}
                        />
                    )}

                    <p className="mt-8 text-center text-gray-600">
                        Vous avez déjà un compte ?{" "}
                        <Link to="/login" className="font-semibold text-secondary transition-colors hover:text-secondary/80">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
