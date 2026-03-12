import { Link } from "react-router-dom";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { EMOJIS } from "../constants";
import { AuthSidePanel } from "../components/AuthSidePanel";
import { AuthPageHeader } from "../components/AuthPageHeader";
import { RegisterStepProgress } from "../components/RegisterStepProgress";
import { RegisterStep1 } from "../components/RegisterStep1";
import { RegisterStep2 } from "../components/RegisterStep2";
import { RegisterStep3 } from "../components/RegisterStep3";

const SIDE_PANEL_IMAGE =
    "https://images.unsplash.com/photo-1761295231159-4eb997ccca2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export default function RegisterPage() {
    const {
        step, setStep, error,
        formData, updateForm,
        avatar, avatarType, selectedEmoji,
        handleStep1, handleStep2, handleStep3,
        handleAvatarUpload, handleSelectEmoji,
    } = useRegisterForm();

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
