import { Cloud, Globe, DollarSign, Users } from 'lucide-react';
import type { Destination } from '@/core/api/destinations';

interface DestinationStatsBarProps {
    destination: Destination;
}

export function DestinationStatsBar({ destination }: DestinationStatsBarProps) {
    const g = destination.guideContent;
    if (!g?.climate && !g?.language && !g?.currency && !g?.international_students) return null;

    const stats = [
        g?.international_students && { icon: Users, label: 'Étudiants intl.', value: g.international_students },
        g?.climate && { icon: Cloud, label: 'Climat', value: g.climate },
        g?.language && { icon: Globe, label: 'Langue', value: g.language },
        g?.currency && { icon: DollarSign, label: 'Monnaie', value: g.currency },
    ].filter(Boolean) as { icon: typeof Cloud; label: string; value: string }[];

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-white shadow-lg">
                <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 rounded-2xl md:grid-cols-4 md:divide-y-0">
                    {stats.map(({ icon: Icon, label, value }, i) => (
                        <div key={label} className={`flex items-center gap-3 p-5 ${i === 0 ? 'rounded-tl-2xl rounded-bl-2xl' : ''} ${i === stats.length - 1 ? 'rounded-tr-2xl rounded-br-2xl' : ''}`}>
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10">
                                <Icon size={18} className="text-secondary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">{label}</p>
                                <p className="font-semibold text-primary-dark">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
