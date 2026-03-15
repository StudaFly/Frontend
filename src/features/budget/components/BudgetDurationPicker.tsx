interface BudgetDurationPickerProps {
    months: number;
    onChange: (months: number) => void;
}

export function BudgetDurationPicker({ months, onChange }: BudgetDurationPickerProps) {
    return (
        <div className="flex items-center gap-3">
            <label className="whitespace-nowrap text-sm font-medium text-gray-700">
                Durée du séjour :
            </label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    min="1"
                    max="24"
                    value={months}
                    onChange={(e) => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v) && v >= 1) onChange(v);
                    }}
                    className="w-16 rounded-xl border-2 border-transparent bg-white px-3 py-1.5 text-center text-sm font-semibold text-primary-dark shadow-sm ring-1 ring-slate-200 outline-none focus:border-primary-dark"
                />
                <span className="text-sm text-gray-500">mois</span>
            </div>
        </div>
    );
}
