import { Badge } from "@/components/ui";
import type { FollowUp } from "@/core/api/org";
import { FOLLOW_UP } from "@/core/labels";

export function FollowUpBadge({ value }: { value: FollowUp | null }) {
    if (!value) return <Badge>Sans mobilité</Badge>;
    return <Badge tone={FOLLOW_UP[value].tone}>{FOLLOW_UP[value].label}</Badge>;
}

export function ProgressBar({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-2" aria-label={`Progression ${value} %`}>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-secondary" style={{ width: `${value}%` }} />
            </div>
            <span className="text-xs font-semibold text-gray-700">{value}%</span>
        </div>
    );
}
