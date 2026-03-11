import { CategoryTab } from './CategoryTab';
import type { CategoryMeta, TaskCategory } from '../types/task';

interface CategoryTabsProps {
    categories: CategoryMeta[];
    activeCategory: TaskCategory | 'all';
    taskCountByCategory: Record<TaskCategory | 'all', number>;
    onSelect: (cat: TaskCategory | 'all') => void;
}

export function CategoryTabs({
    categories,
    activeCategory,
    taskCountByCategory,
    onSelect,
}: CategoryTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
                <CategoryTab
                    key={cat.id}
                    cat={cat}
                    isActive={activeCategory === cat.id}
                    count={taskCountByCategory[cat.id] ?? 0}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}
