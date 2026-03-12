import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { register as apiRegister } from "@/core/api/auth";

type Step = 1 | 2 | 3;

export function useRegisterForm() {
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
            apiRegister({
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                password: formData.password,
            }).then(({ data }) => {
                localStorage.setItem("accessToken", data.data.accessToken);
                localStorage.setItem("refreshToken", data.data.refreshToken);
                login({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    avatar: finalAvatar,
                    avatarType: avatarType,
                });
                navigate("/");
            }),
            {
                loading: "Création de votre compte...",
                success: `Bienvenue ${formData.firstName} ! Votre compte a été créé.`,
                error: (err: unknown) =>
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                    "Erreur lors de la création du compte",
            },
        );
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

    return {
        step, setStep, error,
        formData, updateForm,
        avatar, avatarType, selectedEmoji,
        handleStep1, handleStep2, handleStep3,
        handleAvatarUpload, handleSelectEmoji,
    };
}
