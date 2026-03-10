import { Mail, Calendar, MapPin } from "lucide-react";
import { InfoItem } from "./InfoItem";

interface PersonalInfoCardProps {
    email: string;
    age: string;
    city: string;
    isEditing?: boolean;
    onUpdate?: (field: string, value: string) => void;
}

export function PersonalInfoCard({ email, age, city, isEditing, onUpdate }: PersonalInfoCardProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-6 font-heading text-xl font-bold text-primary-dark">Informations personnelles</h2>

            <div className="space-y-6">
                <InfoItem icon={<Mail className="h-5 w-5" />} label="Email" value={email} />

                <InfoItem
                    icon={<Calendar className="h-5 w-5" />}
                    label="Âge"
                    value={age}
                    isEditing={isEditing}
                    onUpdate={(val) => onUpdate?.("age", val as string)}
                />

                <InfoItem
                    icon={<MapPin className="h-5 w-5" />}
                    label="Ville actuelle"
                    value={city}
                    isEditing={isEditing}
                    onUpdate={(val) => onUpdate?.("city", val as string)}
                />
            </div>
        </div>
    );
}
