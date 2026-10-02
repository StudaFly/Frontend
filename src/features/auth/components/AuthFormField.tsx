import type { LucideIcon } from "lucide-react";

interface AuthFormFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    icon: LucideIcon;
    required?: boolean;
    /** Optional element rendered inside the input (e.g. show/hide toggle) */
    rightSlot?: React.ReactNode;
}

export function AuthFormField({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    icon: Icon,
    required = false,
    rightSlot,
}: AuthFormFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-primary-dark">
                {label}
            </label>
            <div className="relative">
                <Icon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-11 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
                />
                {rightSlot && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
                )}
            </div>
        </div>
    );
}
