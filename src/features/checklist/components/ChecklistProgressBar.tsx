interface ChecklistProgressBarProps {
    percentage: number;
}

export function ChecklistProgressBar({ percentage }: ChecklistProgressBarProps) {
    return (
        <div className="mx-auto mt-5 h-3 w-full max-w-md overflow-hidden rounded-full bg-white/20">
            <div
                className="h-full rounded-full bg-secondary transition-all duration-500"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
