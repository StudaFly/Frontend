interface ComingSoonCardProps {
    title: string;
    variant?: 'default' | 'compact';
}

export function ComingSoonCard({ title, variant = 'default' }: ComingSoonCardProps) {
    const padding = variant === 'compact' ? 'p-6' : 'p-8';
    return (
        <div className={`rounded-2xl border-2 border-dashed border-gray-200 bg-white ${padding} text-center`}>
            <p className="font-semibold text-gray-400">{title}</p>
            <p className="mt-1 text-sm text-gray-300">Bientôt disponible</p>
        </div>
    );
}
