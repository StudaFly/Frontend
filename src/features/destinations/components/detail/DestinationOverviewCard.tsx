import { Globe, Cloud, ShieldCheck, Lightbulb } from 'lucide-react';
import type { Destination } from '@/core/api/destinations';

interface DestinationOverviewCardProps {
    destination: Destination;
}

export function DestinationOverviewCard({ destination }: DestinationOverviewCardProps) {
    const g = destination.guideContent;
    if (!g) return null;

    const rows = [
        g.language  && { icon: Globe,    label: 'Langue',   value: g.language },
        g.climate   && { icon: Cloud,    label: 'Climat',   value: g.climate },
        g.currency  && { icon: Lightbulb, label: 'Monnaie', value: g.currency },
    ].filter(Boolean) as { icon: typeof Globe; label: string; value: string }[];

    return (
        <div className="rounded-2xl bg-primary-dark p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-white">Formalités</h2>
            <ul className="space-y-4">
                {rows.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex items-start gap-3">
                        <Icon size={18} className="mt-0.5 flex-shrink-0 text-secondary" />
                        <div>
                            <p className="text-xs text-white/50">{label}</p>
                            <p className="font-semibold text-white">{value}</p>
                        </div>
                    </li>
                ))}
                <li className="flex items-start gap-3">
                    <ShieldCheck size={18} className="mt-0.5 flex-shrink-0 text-secondary" />
                    <div>
                        <p className="text-xs text-white/50">Visa requis</p>
                        <p className="font-semibold text-white">
                            {g.visa_required ? 'Oui' : 'Non'}{g.visa_note ? ` (${g.visa_note})` : ''}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    );
}
