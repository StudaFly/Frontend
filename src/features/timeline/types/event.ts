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
    icon: string; // key in ICON_MAP
    isOptional?: boolean;
    isCompleted?: boolean;
}

export interface TimelinePeriod {
    id: TimelinePeriodId;
    label: string;
    shortLabel: string;
    description: string;
    color: string;   // Tailwind class for the border
    bgColor: string; // Tailwind class for the background
    dotColor: string; // Tailwind class for the connector dot
}
