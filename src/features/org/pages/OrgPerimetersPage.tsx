import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button, Card, Field, PageHeader, Select } from "@/components/ui";
import { getApiErrorCode, getApiErrorMessage } from "@/core/api/errors";
import { orgApi } from "@/core/api/org";
import { ZONE_LABELS } from "@/core/labels";
import { countryName, useAllStudents, useMembers, useZones } from "../hooks";

export default function OrgPerimetersPage() {
    const queryClient = useQueryClient();
    const members = useMembers();
    const zones = useZones();
    const students = useAllStudents();
    const active = (members.data ?? []).filter((m) => m.isActive);
    const [memberId, setMemberId] = useState("");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [openZone, setOpenZone] = useState<string | null>(null);
    const current = memberId || active[0]?.id || "";
    const perimeter = useQuery({
        queryKey: ["org", "perimeter", current],
        queryFn: () => orgApi.perimeter(current).then((r) => r.data.data),
        enabled: !!current,
    });

    useEffect(() => {
        if (perimeter.data) setSelected(new Set(perimeter.data.countries));
    }, [perimeter.data]);

    const save = useMutation({
        mutationFn: (reassign: boolean) => orgApi.setPerimeter(current, [...selected], reassign),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["org"] });
            toast.success("Périmètre enregistré : les affectations sont mises à jour immédiatement");
        },
        onError: (err) => {
            if (getApiErrorCode(err) === "COUNTRY_ALREADY_ASSIGNED" && window.confirm(`${getApiErrorMessage(err)}.\nLes retirer à leur conseiller actuel ?`)) {
                save.mutate(true);
                return;
            }
            toast.error(getApiErrorMessage(err));
        },
    });

    const toggle = (codes: string[], on: boolean) =>
        setSelected((prev) => {
            const next = new Set(prev);
            codes.forEach((c) => (on ? next.add(c) : next.delete(c)));
            return next;
        });

    const impacted = useMemo(
        () => (students.data ?? []).filter((s) => s.mobility?.countryCode && selected.has(s.mobility.countryCode)).length,
        [students.data, selected],
    );

    return (
        <>
            <PageHeader title="Périmètres" subtitle="Cochez des zones entières puis ajustez pays par pays. Un pays n'a qu'un conseiller principal." />
            <Card>
                <div className="mb-4 flex flex-wrap items-end gap-4">
                    <div className="w-72">
                        <Field label="Membre">
                            <Select value={current} onChange={(e) => setMemberId(e.target.value)}>
                                {active.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </Select>
                        </Field>
                    </div>
                    <p className="text-sm text-gray-600">{selected.size} pays · {impacted} étudiant(s) actuellement concerné(s)</p>
                    <Button onClick={() => save.mutate(false)} disabled={!current || save.isPending}>Enregistrer</Button>
                </div>
                <div className="space-y-3">
                    {(zones.data ?? []).map((zone) => {
                        const count = zone.countries.filter((c) => selected.has(c)).length;
                        const all = count === zone.countries.length;
                        return (
                            <div key={zone.key} className="rounded-xl border border-gray-200 p-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <label className="flex items-center gap-2 font-semibold">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5"
                                            checked={all}
                                            ref={(el) => {
                                                if (el) el.indeterminate = count > 0 && !all;
                                            }}
                                            onChange={(e) => toggle(zone.countries, e.target.checked)}
                                        />
                                        {ZONE_LABELS[zone.key] ?? zone.key}
                                        <span className="text-sm font-normal text-gray-500">({count}/{zone.countries.length})</span>
                                    </label>
                                    <Button variant="ghost" onClick={() => setOpenZone(openZone === zone.key ? null : zone.key)}>
                                        {openZone === zone.key ? "Masquer les pays" : "Ajuster pays par pays"}
                                    </Button>
                                </div>
                                {openZone === zone.key && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {zone.countries.map((code) => (
                                            <button
                                                key={code}
                                                type="button"
                                                aria-pressed={selected.has(code)}
                                                onClick={() => toggle([code], !selected.has(code))}
                                                className={`min-h-[36px] rounded-full border px-3 text-xs font-semibold ${selected.has(code) ? "border-primary-light bg-primary-light text-white" : "border-gray-300 bg-white text-gray-700"}`}
                                            >
                                                {countryName(code)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>
        </>
    );
}
