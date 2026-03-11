import { useTranslation } from 'react-i18next';
import { PRIORITY_CONFIG } from '../constants';
import type { TaskPriority } from '../types/task';

interface PrioritySelectorProps {
    value: TaskPriority;
    onChange: (priority: TaskPriority) => void;
}

const PRIORITY_VALUES: TaskPriority[] = [1, 2, 3];

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
    const { t } = useTranslation();

    return (
        <div className="flex gap-2">
            {PRIORITY_VALUES.map((p) => {
                const config = PRIORITY_CONFIG[p];
                const isSelected = value === p;

                return (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onChange(p)}
                        className={`flex-1 rounded-xl border-2 py-2 text-sm font-semibold transition-colors ${
                            isSelected
                                ? `${config.text} border-current`
                                : 'border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}
                    >
                        {t(config.labelKey)}
                    </button>
                );
            })}
        </div>
    );
}
