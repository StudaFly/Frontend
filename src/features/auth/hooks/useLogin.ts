import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { login as apiLogin } from "@/core/api/auth";

export function useLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await apiLogin({ email, password });
            localStorage.setItem("accessToken", data.data.accessToken);
            if (remember) localStorage.setItem("refreshToken", data.data.refreshToken);
            const { name, email: userEmail } = data.data.user;
            const [firstName, ...rest] = name.split(" ");
            login({ firstName, lastName: rest.join(" "), email: userEmail, avatar: null, avatarType: "emoji" });
            toast.success("Connexion réussie ! Bienvenue.");
            navigate("/");
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Une erreur est survenue";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return { email, setEmail, password, setPassword, remember, setRemember, isLoading, handleSubmit };
}
