import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Field, Input, PageHeader, Pagination } from "@/components/ui";
import { AuditTable } from "@/components/shared/AuditTable";
import { adminApi } from "@/core/api/admin";

export default function AdminAuditPage() {
    const [params, setParams] = useState({ page: 1, action: "", targetType: "", actorId: "", since: "", until: "" });
    const logs = useQuery({
        queryKey: ["admin", "audit", params],
        queryFn: () =>
            adminApi.auditLogs({
                ...params,
                since: params.since ? `${params.since}T00:00:00Z` : undefined,
                until: params.until ? `${params.until}T23:59:59Z` : undefined,
                perPage: 50,
            }).then((r) => r.data),
    });
    const set = (patch: Partial<typeof params>) => setParams((p) => ({ ...p, ...patch, page: patch.page ?? 1 }));
    return (
        <>
            <PageHeader title="Journal d'audit" subtitle="Lecture seule, conservé 1 an, sans donnée personnelle ni secret." />
            <Card>
                <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    <Field label="Action"><Input placeholder="user.suspend" value={params.action} onChange={(e) => set({ action: e.target.value })} /></Field>
                    <Field label="Type de cible"><Input placeholder="user, organization…" value={params.targetType} onChange={(e) => set({ targetType: e.target.value })} /></Field>
                    <Field label="Acteur (UUID)"><Input value={params.actorId} onChange={(e) => set({ actorId: e.target.value })} /></Field>
                    <Field label="Du"><Input type="date" value={params.since} onChange={(e) => set({ since: e.target.value })} /></Field>
                    <Field label="Au"><Input type="date" value={params.until} onChange={(e) => set({ until: e.target.value })} /></Field>
                </div>
                <AuditTable entries={logs.data?.data ?? []} />
                {logs.data && <Pagination page={params.page} total={logs.data.total} perPage={logs.data.perPage} onPage={(page) => set({ page })} />}
            </Card>
        </>
    );
}
