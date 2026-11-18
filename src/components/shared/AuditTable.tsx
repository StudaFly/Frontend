import { EmptyState, Table } from "@/components/ui";
import type { AuditEntry } from "@/core/api/org";

export function AuditTable({ entries }: { entries: AuditEntry[] }) {
    if (entries.length === 0) return <EmptyState>Aucune entrée.</EmptyState>;
    return (
        <Table headers={["Date", "Action", "Acteur", "Cible", "Détails"]}>
            {entries.map((e) => (
                <tr key={e.id}>
                    <td className="whitespace-nowrap px-3 py-2">{new Date(e.createdAt).toLocaleString("fr-FR")}</td>
                    <td className="px-3 py-2 font-mono text-xs">{e.action}</td>
                    <td className="px-3 py-2 text-xs">{e.actorAccountType}{e.actorId && <span className="block text-gray-400">{e.actorId.slice(0, 8)}</span>}</td>
                    <td className="px-3 py-2 text-xs">{e.targetType}{e.targetId && <span className="block text-gray-400">{e.targetId.slice(0, 8)}</span>}</td>
                    <td className="max-w-xs truncate px-3 py-2 font-mono text-xs" title={JSON.stringify(e.changes)}>{JSON.stringify(e.changes)}</td>
                </tr>
            ))}
        </Table>
    );
}
