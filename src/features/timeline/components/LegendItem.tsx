interface LegendItemProps {
    color: string;
    label: string;
}

export function LegendItem({ color, label }: LegendItemProps) {
    return (
        <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${color}`} />
            <span className="text-sm text-gray-600">{label}</span>
        </div>
    );
}
