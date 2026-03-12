import { useTranslation } from 'react-i18next';
import { ClipboardCheck } from 'lucide-react';
import { ChecklistProgressBar } from './ChecklistProgressBar';

interface ChecklistHeaderProps {
    total: number;
    completed: number;
}

export function ChecklistHeader({ total, completed }: ChecklistHeaderProps) {
    const { t } = useTranslation();
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="bg-gradient-to-r from-primary-dark to-primary-light px-6 py-12 text-white">
            <div className="mx-auto max-w-3xl text-center">
                <div className="mb-4 flex justify-center">
                    <ClipboardCheck size={40} className="text-secondary" />
                </div>

                <h1 className="font-heading text-4xl font-bold md:text-5xl">
                    {t('checklist.header.title_before')}{' '}
                    <span className="text-secondary">
                        {t('checklist.header.title_highlight')}
                    </span>
                </h1>

                <p className="mt-3 text-lg text-white/80">
                    {t('checklist.header.subtitle', { completed, total })}
                    <span className="ml-3 font-bold text-secondary">{percentage}%</span>
                </p>

                <ChecklistProgressBar percentage={percentage} />
            </div>
        </div>
    );
}
