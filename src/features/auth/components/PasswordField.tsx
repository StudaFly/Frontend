import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { AuthFormField } from "./AuthFormField";

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

export function PasswordField({
    id,
    label,
    value,
    onChange,
    placeholder = "••••••••",
    required = false,
}: PasswordFieldProps) {
    const [show, setShow] = useState(false);

    const toggle = (
        <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="text-gray-400 hover:text-gray-600"
        >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
    );

    return (
        <AuthFormField
            id={id}
            label={label}
            type={show ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            icon={Lock}
            required={required}
            rightSlot={toggle}
        />
    );
}
