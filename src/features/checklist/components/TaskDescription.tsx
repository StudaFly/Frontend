interface TaskDescriptionProps {
    description: string;
}

export function TaskDescription({ description }: TaskDescriptionProps) {
    return (
        <div className="border-t border-slate-100 px-5 pb-4 pt-3">
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}
