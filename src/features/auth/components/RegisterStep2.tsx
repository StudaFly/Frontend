import { User } from "lucide-react";
import { AuthFormField } from "./AuthFormField";

interface RegisterStep2Props {
    formData: any;
    updateForm: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function RegisterStep2({ formData, updateForm, onBack, onSubmit }: RegisterStep2Props) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <p className="mb-2 text-sm text-gray-500">Comment doit-on vous appeler ?</p>

            <AuthFormField
                id="firstName"
                label="Prénom"
                value={formData.firstName}
                onChange={updateForm("firstName")}
                placeholder="Jean"
                icon={User}
                required
            />

            <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-primary-dark">
                    Nom
                </label>
                <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={updateForm("lastName")}
                    placeholder="Dupont"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                    ← Retour
                </button>
                <button
                    type="submit"
                    className="flex-1 rounded-lg bg-secondary py-3 font-bold text-primary-dark transition-colors hover:bg-secondary/80"
                >
                    Continuer →
                </button>
            </div>
        </form>
    );
}
