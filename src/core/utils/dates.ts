export function formatLongDate(isoDate: string): string {
    const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Today as an ISO date (YYYY-MM-DD) in local time. */
export function todayIso(now: Date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function formatEuros(min: number, max: number, currency = 'EUR'): string {
    const fmt = (value: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
    return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
}
