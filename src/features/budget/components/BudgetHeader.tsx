import { Calculator } from 'lucide-react';
import type { Destination } from '@/core/api/destinations';

interface BudgetHeaderProps {
    destination: Destination | null;
}

export function BudgetHeader({ destination }: BudgetHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-primary-dark to-primary-light px-6 py-16 text-white">
            <div className="mx-auto max-w-3xl text-center">
                <div className="mb-4 flex items-center justify-center">
                    <Calculator size={40} className="text-secondary" />
                </div>
                <h1 className="font-heading text-4xl font-bold md:text-5xl">
                    Simulateur de{' '}
                    <span className="text-secondary">Budget</span>
                </h1>
                <p className="mt-3 text-lg text-white/80">
                    {destination ? (
                        <>
                            Pré-rempli pour{' '}
                            <span className="font-semibold text-secondary">
                                {destination.city}, {destination.country}
                            </span>
                            {' '}— modifiable selon votre situation
                        </>
                    ) : (
                        'Estimez et ajustez votre budget mensuel à l\'étranger'
                    )}
                </p>
            </div>
        </div>
    );
}
