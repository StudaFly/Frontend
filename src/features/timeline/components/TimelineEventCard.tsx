import { useTranslation } from 'react-i18next';
import {
    FileCheck,
    Home,
    PiggyBank,
    Stamp,
    FileText,
    HeartPulse,
    CreditCard,
    Plane,
    Pill,
    ShieldCheck,
    Luggage,
    GraduationCap,
    Smartphone,
    ClipboardList,
    Map,
    CircleDot,
    Check,
    type LucideIcon,
} from 'lucide-react';
import { EventCategoryBadge } from './EventCategoryBadge';
import type { TimelineEvent } from '../types/event';

const ICON_MAP: Record<string, LucideIcon> = {
    FileCheck,
    Home,
    PiggyBank,
    Stamp,
    FileText,
    HeartPulse,
    CreditCard,
    Plane,
    Pill,
    ShieldCheck,
    Luggage,
    GraduationCap,
    Smartphone,
    ClipboardList,
    Map,
    CircleDot,
};

interface TimelineEventCardProps {
    event: TimelineEvent;
    isLast: boolean;
    dotColor: string;
}

export function TimelineEventCard({ event, isLast, dotColor }: TimelineEventCardProps) {
    const { t } = useTranslation();
    const Icon = ICON_MAP[event.icon] ?? CircleDot;

    const title = t(`timeline.events.${event.id}.title`, { defaultValue: event.title });
    const description = t(`timeline.events.${event.id}.description`, {
        defaultValue: event.description,
    });

    return (
        <div className="flex gap-4">
            {/* Connector column */}
            <div className="flex flex-col items-center">
                <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${event.isCompleted ? 'bg-green-500' : dotColor} text-white shadow-sm`}
                >
                    {event.isCompleted ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                </div>
                {!isLast && <div className="mt-2 w-0.5 flex-1 bg-gray-200" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
                <div className={`rounded-2xl p-4 shadow-sm ring-1 ring-slate-100 transition-all ${event.isCompleted ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-primary-dark">{title}</h3>
                        <EventCategoryBadge category={event.category} />
                        {event.isOptional && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                                {t('timeline.event.optional')}
                            </span>
                        )}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
}
