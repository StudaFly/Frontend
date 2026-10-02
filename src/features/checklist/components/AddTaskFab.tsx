import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

interface AddTaskFabProps {
    onClick: () => void;
}

export function AddTaskFab({ onClick }: AddTaskFabProps) {
    const { t } = useTranslation();

    return (
        <button
            onClick={onClick}
            aria-label={t('checklist.fab.aria_label')}
            className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-secondary shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
            <Plus size={26} className="text-primary-dark" strokeWidth={2.5} />
        </button>
    );
}
