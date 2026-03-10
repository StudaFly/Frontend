import { ReactNode } from "react";

interface InfoItemProps {
    icon: ReactNode;
    label: string;
    value: string | string[];
    isEditing?: boolean;
    placeholder?: string;
    onUpdate?: (value: string | string[]) => void;
    isArrayValue?: boolean;
}

export function InfoItem({
    icon,
    label,
    value,
    isEditing,
    placeholder,
    onUpdate,
    isArrayValue,
}: InfoItemProps) {
    const handleArrayUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onUpdate) {
            onUpdate(
                e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
            );
        }
    };

    const handleStringUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onUpdate) {
            onUpdate(e.target.value);
        }
    };

    return (
        <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-secondary">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                {isEditing ? (
                    <input
                        type="text"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                        placeholder={placeholder}
                        value={isArrayValue ? (value as string[]).join(", ") : (value as string)}
                        onChange={isArrayValue ? handleArrayUpdate : handleStringUpdate}
                    />
                ) : isArrayValue ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                        {(value as string[]).length > 0 ? (
                            (value as string[]).map((val) => (
                                <span
                                    key={val}
                                    className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800"
                                >
                                    {val}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm font-medium text-gray-900">Non renseignées</span>
                        )}
                    </div>
                ) : (
                    <p className="font-medium text-gray-900">{(value as string) || "Non renseigné(e)"}</p>
                )}
            </div>
        </div>
    );
}
