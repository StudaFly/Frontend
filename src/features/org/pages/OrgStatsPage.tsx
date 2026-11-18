import { Card, PageHeader, Stat } from "@/components/ui";
import { FOLLOW_UP, ZONE_LABELS } from "@/core/labels";
import { countryName, useAllStudents, useZones } from "../hooks";

function Bars({ rows }: { rows: [string, number][] }) {
    const max = Math.max(1, ...rows.map(([, n]) => n));
    return (
        <ul className="space-y-2">
            {rows.map(([label, n]) => (
                <li key={label} className="grid grid-cols-[10rem_1fr_2rem] items-center gap-2 text-sm">
                    <span className="truncate">{label}</span>
                    <span className="h-3 rounded-full bg-primary-light" style={{ width: `${(n / max) * 100}%` }} />
                    <span className="text-right font-semibold">{n}</span>
                </li>
            ))}
        </ul>
    );
}

export default function OrgStatsPage() {
    const students = useAllStudents();
    const zones = useZones();
    const list = students.data ?? [];
    const zoneOf = (code: string | null | undefined) => zones.data?.find((z) => code && z.countries.includes(code))?.key;
    const count = (keys: (string | undefined)[]) => {
        const map = new Map<string, number>();
        keys.forEach((k) => k && map.set(k, (map.get(k) ?? 0) + 1));
        return [...map.entries()].sort((a, b) => b[1] - a[1]);
    };
    const average = list.length ? Math.round(list.reduce((sum, s) => sum + (s.mobility?.progress ?? 0), 0) / list.length) : 0;

    return (
        <>
            <PageHeader title="Statistiques" subtitle="Sur les étudiants de votre périmètre" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Stat label="Étudiants" value={list.length} />
                <Stat label="Progression moyenne" value={`${average}%`} />
                <Stat label="Avec mobilité" value={list.filter((s) => s.mobility).length} />
                <Stat label="Non affectés" value={list.filter((s) => s.mobility && !s.mobility.advisor).length} />
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Card title="Top destinations">
                    <Bars rows={count(list.map((s) => s.mobility?.countryCode ?? undefined)).slice(0, 8).map(([c, n]) => [countryName(c), n])} />
                </Card>
                <Card title="Par zone">
                    <Bars rows={count(list.map((s) => zoneOf(s.mobility?.countryCode))).map(([z, n]) => [ZONE_LABELS[z] ?? z, n])} />
                </Card>
                <Card title="Par statut de suivi">
                    <Bars rows={count(list.map((s) => s.followUp ?? undefined)).map(([f, n]) => [FOLLOW_UP[f]?.label ?? f, n])} />
                </Card>
            </div>
        </>
    );
}
