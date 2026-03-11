import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { TimelineEventCard } from './TimelineEventCard';
import type { TimelinePeriod, TimelineEvent } from '../types/event';

interface TimelinePeriodSectionProps {
    period: TimelinePeriod;
    events: TimelineEvent[];
    isOpen: boolean;
    onToggle: () => void;
}

export function TimelinePeriodSection({
    period,
    events,
    isOpen,
    onToggle,
}: TimelinePeriodSectionProps) {
    const { t } = useTranslation();

    const label = t(`timeline.periods.${period.id}.label`, { defaultValue: period.label });
    const shortLabel = t(`timeline.periods.${period.id}.shortLabel`, {
        defaultValue: period.shortLabel,
    });
    const description = t(`timeline.periods.${period.id}.description`, {
        defaultValue: period.description,
    });

    return (
        <div
            className={`overflow-hidden rounded-2xl border-l-4 bg-white shadow-sm ring-1 ring-slate-100 ${period.color}`}
        >
            {/* Section header */}
            <button
                onClick={onToggle}
                className={`flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50 ${isOpen ? period.bgColor : ''}`}
                aria-expanded={isOpen}
            >
                <span
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white ${period.dotColor}`}
                >
                    {shortLabel}
                </span>

                <div className="min-w-0 flex-1">
                    <p className="font-heading font-bold text-primary-dark">{label}</p>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-3">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        {t('timeline.period.step_count', { count: events.length })}
                    </span>
                    <ChevronDown
                        size={20}
                        className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Collapsible content */}
            {isOpen && (
                <div className="px-6 py-4">
                    {events.map((event, index) => (
                        <TimelineEventCard
                            key={event.id}
                            event={event}
                            isLast={index === events.length - 1}
                            dotColor={period.dotColor}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
