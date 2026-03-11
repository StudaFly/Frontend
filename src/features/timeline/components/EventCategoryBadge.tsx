import { useTranslation } from 'react-i18next';
import type { TimelineEventCategory } from '../types/event';

const CATEGORY_STYLE: Record<TimelineEventCategory, { bg: string; text: string }> = {
    admin:     { bg: 'bg-blue-100',   text: 'text-blue-700'   },
    finance:   { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    housing:   { bg: 'bg-green-100',  text: 'text-green-700'  },
    health:    { bg: 'bg-red-100',    text: 'text-red-700'    },
    practical: { bg: 'bg-gray-100',   text: 'text-gray-700'   },
};

interface EventCategoryBadgeProps {
    category: TimelineEventCategory;
}

export function EventCategoryBadge({ category }: EventCategoryBadgeProps) {
    const { t } = useTranslation();
    const style = CATEGORY_STYLE[category];

    return (
        <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}
        >
            {t(`timeline.categories.${category}`)}
        </span>
    );
}
