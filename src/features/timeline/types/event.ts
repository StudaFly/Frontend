export type TimelineEventCategory = 'admin' | 'finance' | 'housing' | 'health' | 'practical';

export type TimelinePeriodId =
    | 'six-months-before'
    | 'three-months-before'
    | 'one-month-before'
    | 'after-arrival';

export interface TimelineEvent {
    id: string;
    periodId: TimelinePeriodId;
    title: string;
    description: string;
    category: TimelineEventCategory;
    icon: string; // clé dans ICON_MAP
    isOptional?: boolean;
    isCompleted?: boolean;
}

export interface TimelinePeriod {
    id: TimelinePeriodId;
    label: string;
    shortLabel: string;
    description: string;
    color: string;   // classe Tailwind pour la bordure
    bgColor: string; // classe Tailwind pour le fond
    dotColor: string; // classe Tailwind pour le point du connector
}
