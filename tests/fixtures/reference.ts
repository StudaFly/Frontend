import type { PublicStats, ReferenceData } from '@/core/api/reference';

/** Same payload as the backend's GET /reference. */
export const REFERENCE: ReferenceData = {
    mobilityTypes: [
        { key: 'erasmus', label: 'Erasmus', description: 'Échange universitaire européen' },
        { key: 'stage', label: 'Stage', description: "Stage en entreprise à l'étranger" },
        { key: 'semestre', label: 'Semestre', description: 'Semestre dans une université partenaire' },
        { key: 'double_diplome', label: 'Double diplôme', description: 'Programme de double diplôme' },
    ],
    taskCategories: [
        { key: 'admin', label: 'Admin' },
        { key: 'finance', label: 'Finance' },
        { key: 'health', label: 'Santé' },
        { key: 'housing', label: 'Logement' },
        { key: 'practical', label: 'Pratique' },
    ],
    taskPriorities: [
        { value: 1, label: 'Haute' },
        { value: 2, label: 'Moyenne' },
        { value: 3, label: 'Basse' },
    ],
    avatarEmojis: ['🎓', '✈️', '🌍', '📚', '🏃', '🎨', '🎸', '🍕', '🌊', '🦁'],
};

export const STATS: PublicStats = { countries: 24, destinations: 38, students: 12, preparationSteps: 30 };
