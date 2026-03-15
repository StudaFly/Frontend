interface BudgetSummaryProps {
    total: number;
    referenceRange: { min: number; max: number } | null;
    months: number;
}

export function BudgetSummary({ total, referenceRange, months }: BudgetSummaryProps) {
    const totalStay = total * months;
    const isOver = referenceRange ? total > referenceRange.max : false;
    const isUnder = referenceRange ? total <= referenceRange.max : false;

    return (
        <div className="rounded-2xl bg-primary-dark p-6 text-white shadow-lg">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm text-white/60">Total mensuel estimé</p>
                    <p className="mt-1 font-heading text-4xl font-bold text-secondary">
                        {total.toLocaleString('fr-FR')} €
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-white/60">Sur {months} mois</p>
                    <p className="mt-1 text-xl font-semibold">{totalStay.toLocaleString('fr-FR')} €</p>
                </div>
            </div>

            {referenceRange && (
                <div className="mt-4 rounded-xl bg-white/10 p-3">
                    <p className="text-xs text-white/60">
                        Référence destination :{' '}
                        <span className="font-medium text-white">
                            {referenceRange.min} – {referenceRange.max} €/mois
                        </span>
                    </p>
                    {isUnder && (
                        <p className="mt-1 text-xs font-medium text-green-300">
                            Dans la fourchette recommandée
                        </p>
                    )}
                    {isOver && (
                        <p className="mt-1 text-xs font-medium text-amber-300">
                            Au-dessus de la fourchette recommandée
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
