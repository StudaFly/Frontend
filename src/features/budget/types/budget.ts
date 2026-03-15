export type BudgetCategory = 'logement' | 'alimentation' | 'transport' | 'loisirs' | 'autre';

export interface BudgetLine {
    id: string;
    label: string;
    amount: number;
    category: BudgetCategory;
    isCustom: boolean;
}

export const CATEGORIES: { id: BudgetCategory; label: string }[] = [
    { id: 'logement',     label: 'Logement' },
    { id: 'alimentation', label: 'Alimentation' },
    { id: 'transport',    label: 'Transport' },
    { id: 'loisirs',      label: 'Loisirs' },
    { id: 'autre',        label: 'Autre' },
];

export const CATEGORY_COLORS: Record<BudgetCategory, string> = {
    logement:     'bg-blue-100 text-blue-700',
    alimentation: 'bg-green-100 text-green-700',
    transport:    'bg-yellow-100 text-yellow-700',
    loisirs:      'bg-purple-100 text-purple-700',
    autre:        'bg-gray-100 text-gray-600',
};

export const CATEGORY_LABELS: Record<BudgetCategory, string> = {
    logement:     'Logement',
    alimentation: 'Alimentation',
    transport:    'Transport',
    loisirs:      'Loisirs',
    autre:        'Autre',
};
