import { Mail, Phone } from "lucide-react";
import { InfoItem } from "./InfoItem";

interface PersonalInfoCardProps {
    email: string;
    phone: string;
    isEditing?: boolean;
    onUpdate?: (field: "phone", value: string) => void;
}

export function PersonalInfoCard({ email, phone, isEditing, onUpdate }: PersonalInfoCardProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-6 font-heading text-xl font-bold text-primary-dark">Informations personnelles</h2>

            <div className="space-y-6">
                <InfoItem icon={<Mail className="h-5 w-5" />} label="Email" value={email} />

                <InfoItem
                    icon={<Phone className="h-5 w-5" />}
                    label="Téléphone"
                    value={phone}
                    placeholder="+33 6 12 34 56 78"
                    isEditing={isEditing}
                    onUpdate={(val) => onUpdate?.("phone", val as string)}
                />
            </div>
        </div>
    );
}
