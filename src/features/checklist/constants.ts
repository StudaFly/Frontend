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

export interface PriorityConfig {
    labelKey: string;
    bg: string;
    text: string;
}

export const PRIORITY_CONFIG: Record<TaskPriority, PriorityConfig> = {
    1: { labelKey: 'checklist.priority.high',   bg: 'bg-red-100',   text: 'text-red-600'   },
    2: { labelKey: 'checklist.priority.medium', bg: 'bg-amber-100', text: 'text-amber-600' },
    3: { labelKey: 'checklist.priority.low',    bg: 'bg-gray-100',  text: 'text-gray-500'  },
};
