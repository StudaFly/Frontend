export type TaskCategory = 'admin' | 'finance' | 'housing' | 'health' | 'practical';
export type TaskPriority = 1 | 2 | 3; // 1=haute, 2=moyenne, 3=basse

export interface Task {
    id: string;
    title: string;
    description?: string;
    category: TaskCategory;
    deadline?: string;
    isCompleted: boolean;
    priority: TaskPriority;
    isCustom?: boolean;
}

export interface CategoryMeta {
    id: TaskCategory | 'all';
    label: string;
    icon: string;
}

export interface NewTaskFormData {
    title: string;
    description: string;
    category: TaskCategory;
    deadline: string;
    priority: TaskPriority;
}
