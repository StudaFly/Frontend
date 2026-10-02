import {
    LayoutGrid,
    FileCheck,
    PiggyBank,
    HeartPulse,
    Home,
    Smartphone,
    type LucideIcon,
} from 'lucide-react';
import type { TaskCategory, TaskPriority } from './types/task';

export const CATEGORY_ICON_MAP: Record<TaskCategory | 'all', LucideIcon> = {
    all:       LayoutGrid,
    admin:     FileCheck,
    finance:   PiggyBank,
    health:    HeartPulse,
    housing:   Home,
    practical: Smartphone,
};

/** Visual style only — labels come from GET /reference. */
export interface PriorityConfig {
    bg: string;
    text: string;
}

export const PRIORITY_CONFIG: Record<TaskPriority, PriorityConfig> = {
    1: { bg: 'bg-red-100',   text: 'text-red-600'   },
    2: { bg: 'bg-amber-100', text: 'text-amber-600' },
    3: { bg: 'bg-gray-100',  text: 'text-gray-500'  },
};
