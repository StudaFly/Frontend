import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface TaskCheckboxProps {
    isCompleted: boolean;
    onToggle: () => void;
}

export function TaskCheckbox({ isCompleted, onToggle }: TaskCheckboxProps) {
    const { t } = useTranslation();

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            aria-label={
                isCompleted
                    ? t('checklist.task.mark_incomplete')
                    : t('checklist.task.mark_complete')
            }
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                isCompleted
                    ? 'bg-success text-white'
                    : 'ring-2 ring-gray-300 hover:ring-success'
            }`}
        >
            {isCompleted && <Check size={14} strokeWidth={3} />}
        </button>
    );
}
