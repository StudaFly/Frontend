import { useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
    primary: "bg-primary-light text-white hover:bg-primary",
    outline: "border border-gray-300 bg-white text-primary-dark hover:bg-gray-50",
    ghost: "text-primary-dark hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
};

export function Button({
    variant = "primary",
    className = "",
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
    return (
        <button
            {...props}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
        />
    );
}

export function Card({ title, actions, children, className = "" }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <section className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
            {(title || actions) && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    {title && <h2 className="font-heading text-lg font-bold text-primary-dark">{title}</h2>}
                    {actions}
                </div>
            )}
            {children}
        </section>
    );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="font-heading text-2xl font-bold text-primary-dark sm:text-3xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
            </div>
            {actions}
        </div>
    );
}

const TONES = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
    gold: "bg-secondary/30 text-primary-dark",
} as const;

export type Tone = keyof typeof TONES;

export function Badge({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) {
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>{children}</span>;
}

export function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: Tone }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`mt-1 font-heading text-3xl font-bold ${tone === "red" ? "text-red-700" : tone === "amber" ? "text-amber-700" : "text-primary-dark"}`}>{value}</p>
        </div>
    );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
    return (
        <label className="block text-sm">
            <span className="mb-1 block font-semibold text-gray-700">{label}</span>
            {children}
            {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
        </label>
    );
}

const INPUT = "w-full min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={`${INPUT} ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={`${INPUT} ${props.className ?? ""}`} />;
}

export function EmptyState({ children }: { children: ReactNode }) {
    return <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">{children}</p>;
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                        {headers.map((h) => (
                            <th key={h} scope="col" className="px-3 py-2 font-semibold">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">{children}</tbody>
            </table>
        </div>
    );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <h2 className="font-heading text-lg font-bold text-primary-dark">{title}</h2>
                    <button onClick={onClose} aria-label="Fermer" className="min-h-[44px] min-w-[44px] rounded-lg text-gray-500 hover:bg-gray-100">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

export function ConfirmDialog({
    title,
    description,
    expected,
    askReason = false,
    confirmLabel = "Confirmer",
    onConfirm,
    onClose,
    pending = false,
}: {
    title: string;
    description: ReactNode;
    expected?: string;
    askReason?: boolean;
    confirmLabel?: string;
    onConfirm: (reason: string) => void;
    onClose: () => void;
    pending?: boolean;
}) {
    const [typed, setTyped] = useState("");
    const [reason, setReason] = useState("");
    const ready = (!expected || typed.trim() === expected) && (!askReason || reason.trim().length >= 3);
    return (
        <Modal title={title} onClose={onClose}>
            <div className="space-y-4 text-sm text-gray-700">
                <div>{description}</div>
                {expected && (
                    <Field label={`Tape « ${expected} » pour confirmer`}>
                        <Input value={typed} onChange={(e) => setTyped(e.target.value)} aria-label="Confirmation" />
                    </Field>
                )}
                {askReason && (
                    <Field label="Motif (obligatoire)">
                        <Input value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Motif" />
                    </Field>
                )}
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>Annuler</Button>
                    <Button variant="danger" disabled={!ready || pending} onClick={() => onConfirm(reason.trim())}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export function Pagination({ page, total, perPage, onPage }: { page: number; total: number; perPage: number; onPage: (page: number) => void }) {
    const pages = Math.max(1, Math.ceil(total / perPage));
    return (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>{total} résultat{total > 1 ? "s" : ""}</span>
            <div className="flex items-center gap-2">
                <Button variant="outline" disabled={page <= 1} onClick={() => onPage(page - 1)}>Précédent</Button>
                <span>{page} / {pages}</span>
                <Button variant="outline" disabled={page >= pages} onClick={() => onPage(page + 1)}>Suivant</Button>
            </div>
        </div>
    );
}
