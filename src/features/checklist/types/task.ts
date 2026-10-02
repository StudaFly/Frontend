export type TaskCategory = 'admin' | 'finance' | 'housing' | 'health' | 'practical';
export type TaskPriority = 1 | 2 | 3; // 1=haute, 2=moyenne, 3=basse

/** Task as returned by the backend (TaskRead). */
export interface Task {
    id: string;
    mobilityId: string;
    title: string;
    description: string | null;
    category: TaskCategory;
    deadline: string | null;
    /** Computed by the backend: days to the deadline, negative when overdue. */
    daysUntilDeadline: number | null;
    isCompleted: boolean;
    priority: TaskPriority;
}

/** A checklist tab: "all" or one of the categories served by GET /reference. */
export interface CategoryMeta {
    id: TaskCategory | 'all';
    label: string;
}

export interface NewTaskFormData {
    title: string;
    description: string;
    category: TaskCategory;
    deadline: string;
    priority: TaskPriority;
}
