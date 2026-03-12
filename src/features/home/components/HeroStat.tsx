import type { LucideIcon } from "lucide-react";

interface HeroStatProps {
    icon: LucideIcon;
    value: string;
    label: string;
}

export function HeroStat({ icon: Icon, value, label }: HeroStatProps) {
    return (
        <div className="flex items-center gap-3">
            <Icon className="text-secondary" size={24} />
            <div>
                <p className="font-bold">{value}</p>
                <p className="text-sm text-gray-300">{label}</p>
            </div>
        </div>
    );
}
