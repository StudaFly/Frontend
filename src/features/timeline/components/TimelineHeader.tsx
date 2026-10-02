import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';

interface TimelineHeaderProps {
    totalEvents: number;
}

export function TimelineHeader({ totalEvents }: TimelineHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-to-r from-primary-dark to-primary-light px-6 py-16 text-white">
            <div className="mx-auto max-w-3xl text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                    <CalendarDays size={40} className="text-secondary" />
                </div>
                <h1 className="font-heading text-4xl font-bold md:text-5xl">
                    {t('timeline.header.title_before')}{' '}
                    <span className="text-secondary">
                        {t('timeline.header.title_highlight')}
                    </span>
                </h1>
                <p className="mt-3 text-lg text-white/80">
                    <span className="font-semibold text-secondary">
                        {t('timeline.header.subtitle', { count: totalEvents })}
                    </span>
                </p>
            </div>
        </div>
    );
}
