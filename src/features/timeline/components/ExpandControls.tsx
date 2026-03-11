import { useTranslation } from 'react-i18next';

interface ExpandControlsProps {
    openCount: number;
    totalCount: number;
    allExpanded: boolean;
    onExpandAll: () => void;
    onCollapseAll: () => void;
}

export function ExpandControls({
    openCount,
    totalCount,
    allExpanded,
    onExpandAll,
    onCollapseAll,
}: ExpandControlsProps) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
                {t('timeline.controls.periods_open', { open: openCount, total: totalCount })}
            </p>
            <button
                onClick={allExpanded ? onCollapseAll : onExpandAll}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-dark ring-1 ring-slate-200 transition-colors hover:bg-gray-50"
            >
                {allExpanded
                    ? t('timeline.controls.collapse_all')
                    : t('timeline.controls.expand_all')}
            </button>
        </div>
    );
}
