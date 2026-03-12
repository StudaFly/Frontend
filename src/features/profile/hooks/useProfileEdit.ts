import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useProfileEdit() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [draftUser, setDraftUser] = useState(user);

    useEffect(() => {
        setDraftUser(user);
    }, [user]);

    const handleUpdate = (field: string, value: string | string[]) => {
        setDraftUser((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const toggleEdit = () => {
        if (isEditing && draftUser) {
            updateUser(draftUser);
        }
        setIsEditing((prev) => !prev);
    };

    return { user, draftUser, isEditing, handleUpdate, toggleEdit };
}
