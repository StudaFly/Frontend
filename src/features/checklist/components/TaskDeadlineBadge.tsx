interface TaskDeadlineBadgeProps {
    deadline: string;
}

export function TaskDeadlineBadge({ deadline }: TaskDeadlineBadgeProps) {
    const formatted = new Date(deadline).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
    });

    return (
        <span className="hidden rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-primary-dark sm:inline">
            {formatted}
        </span>
    );
}
