import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { getApiErrorMessage } from "@/core/api/errors";
import { orgApi } from "@/core/api/org";
import { useOrg } from "../hooks";

export default function OrgSettingsPage() {
    const queryClient = useQueryClient();
    const org = useOrg();
    const joinCode = useQuery({ queryKey: ["org", "join-code"], queryFn: () => orgApi.joinCode().then((r) => r.data.data.joinCode) });
    const [color, setColor] = useState("#33518A");
    const [logoUrl, setLogoUrl] = useState("");
    const [progressBelow, setProgressBelow] = useState(50);
    const [daysBefore, setDaysBefore] = useState(30);

    useEffect(() => {
        if (!org.data) return;
        setColor(org.data.branding?.primary_color ?? "#33518A");
        setLogoUrl(org.data.logoUrl ?? "");
        const threshold = (org.data.settings?.alert_threshold ?? {}) as { progress_below?: number; days_before_departure?: number };
        setProgressBelow(threshold.progress_below ?? 50);
        setDaysBefore(threshold.days_before_departure ?? 30);
    }, [org.data]);

    const save = useMutation({
        mutationFn: () =>
            orgApi.update({
                logoUrl: logoUrl || null,
                branding: { ...org.data?.branding, primary_color: color },
                settings: { ...org.data?.settings, alert_threshold: { progress_below: progressBelow, days_before_departure: daysBefore } },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["org"] });
            toast.success("Réglages enregistrés");
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
    });
    const rotate = useMutation({
        mutationFn: orgApi.rotateJoinCode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["org", "join-code"] });
            toast.success("Nouveau code généré : l'ancien ne fonctionne plus");
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
    });

    return (
        <>
            <PageHeader title="Réglages" subtitle="Branding, seuil d'alerte et code d'école" />
            <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Branding">
                    <form
                        className="space-y-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            save.mutate();
                        }}
                    >
                        <Field label="Couleur principale">
                            <div className="flex items-center gap-3">
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Couleur principale" className="h-11 w-16 rounded" />
                                <Input value={color} onChange={(e) => setColor(e.target.value)} className="w-32" />
                            </div>
                        </Field>
                        <Field label="URL du logo"><Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://…" /></Field>
                        <div className="rounded-xl p-4 text-white" style={{ backgroundColor: color }}>
                            Aperçu : {org.data?.name}
                        </div>
                        <h3 className="pt-2 text-sm font-semibold text-primary-dark">Seuil d'alerte « critique »</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Progression sous (%)"><Input type="number" min={0} max={100} value={progressBelow} onChange={(e) => setProgressBelow(Number(e.target.value))} /></Field>
                            <Field label="À J- (jours)"><Input type="number" min={1} max={365} value={daysBefore} onChange={(e) => setDaysBefore(Number(e.target.value))} /></Field>
                        </div>
                        <Button type="submit" disabled={save.isPending}>Enregistrer</Button>
                    </form>
                </Card>
                <Card title="Code d'école">
                    <p className="font-mono text-2xl font-bold tracking-widest text-primary-dark">{joinCode.data ?? "…"}</p>
                    <p className="mt-2 text-sm text-gray-600">Régénérer le code invalide immédiatement l'ancien. Les étudiants déjà rattachés ne sont pas concernés.</p>
                    <Button className="mt-4" variant="outline" onClick={() => window.confirm("Générer un nouveau code ?") && rotate.mutate()}>
                        Régénérer le code
                    </Button>
                </Card>
            </div>
        </>
    );
}
