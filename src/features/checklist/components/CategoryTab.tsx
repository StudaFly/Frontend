import { useTranslation } from 'react-i18next';
import { CircleDot } from 'lucide-react';
import { CATEGORY_ICON_MAP } from '../constants';
import type { CategoryMeta, TaskCategory } from '../types/task';

interface CategoryTabProps {
    cat: CategoryMeta;
    isActive: boolean;
    count: number;
    onSelect: (id: TaskCategory | 'all') => void;
}

export function CategoryTab({ cat, isActive, count, onSelect }: CategoryTabProps) {
    const { t } = useTranslation();
    const Icon = CATEGORY_ICON_MAP[cat.id] ?? CircleDot;
    const label = t(`checklist.categories.${cat.id}`, { defaultValue: cat.label });

    return (
        <button
            onClick={() => onSelect(cat.id)}
            className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                    ? 'bg-primary-dark text-white shadow-md'
                    : 'bg-white text-gray-700 ring-1 ring-slate-200 hover:bg-gray-50'
            }`}
        >
            <Icon size={15} />
            <span>{label}</span>
            <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
            >
                {count}
            </span>
        </button>
    );
}
