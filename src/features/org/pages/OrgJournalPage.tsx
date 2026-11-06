import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, PageHeader, Pagination } from "@/components/ui";
import { AuditTable } from "@/components/shared/AuditTable";
import { orgApi } from "@/core/api/org";

export default function OrgJournalPage() {
    const [page, setPage] = useState(1);
    const logs = useQuery({ queryKey: ["org", "audit", page], queryFn: () => orgApi.auditLogs(page).then((r) => r.data) });
    return (
        <>
            <PageHeader title="Journal" subtitle="Toutes les modifications faites sur l'établissement (conservées 1 an)." />
            <Card>
                <AuditTable entries={logs.data?.data ?? []} />
                {logs.data && <Pagination page={page} total={logs.data.total} perPage={logs.data.perPage} onPage={setPage} />}
            </Card>
        </>
    );
}
