import { useTranslation } from 'react-i18next';
import { LegendItem } from './LegendItem';
import type { TimelineEventCategory } from '../types/event';

const LEGEND_CATEGORIES: { id: TimelineEventCategory; color: string }[] = [
    { id: 'admin',     color: 'bg-blue-500'   },
    { id: 'finance',   color: 'bg-yellow-500' },
    { id: 'housing',   color: 'bg-green-500'  },
    { id: 'health',    color: 'bg-red-500'    },
    { id: 'practical', color: 'bg-gray-500'   },
];

export function TimelineLegend() {
    const { t } = useTranslation();

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                {t('timeline.legend.title')}
            </p>
            <div className="flex flex-wrap gap-4">
                {LEGEND_CATEGORIES.map((cat) => (
                    <LegendItem
                        key={cat.id}
                        color={cat.color}
                        label={t(`timeline.categories.${cat.id}`)}
                    />
                ))}
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                        {t('timeline.event.optional')}
                    </span>
                    <span className="text-sm text-gray-600">
                        {t('timeline.legend.optional_label')}
                    </span>
                </div>
            </div>
        </div>
    );
}
