import { Check, EyeOff } from "lucide-react";
import { SHARED_DATA_LABELS } from "@/core/labels";

export function ConsentPanel({ schoolName, shared, neverShared }: { schoolName: string; shared: string[]; neverShared: string[] }) {
    return (
        <div className="space-y-4 rounded-xl bg-background-light p-4 text-sm">
            <div>
                <p className="font-semibold text-primary-dark">{schoolName} pourra voir :</p>
                <ul className="mt-2 space-y-1">
                    {shared.map((key) => (
                        <li key={key} className="flex items-start gap-2 text-gray-700">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden />
                            {SHARED_DATA_LABELS[key] ?? key}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <p className="font-semibold text-primary-dark">{schoolName} ne verra jamais :</p>
                <ul className="mt-2 space-y-1">
                    {neverShared.map((key) => (
                        <li key={key} className="flex items-start gap-2 text-gray-700">
                            <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
                            {SHARED_DATA_LABELS[key] ?? key}
                        </li>
                    ))}
                </ul>
            </div>
            <p className="text-xs text-gray-500">Tu peux quitter ton établissement à tout moment depuis ton profil.</p>
        </div>
    );
}
