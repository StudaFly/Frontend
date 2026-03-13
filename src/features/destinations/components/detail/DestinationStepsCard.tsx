import { Clock } from 'lucide-react';
import type { Destination } from '@/core/api/destinations';

interface DestinationStepsCardProps {
    destination: Destination;
}

export function DestinationStepsCard({ destination }: DestinationStepsCardProps) {
    const steps = destination.guideContent?.steps;
    if (!steps?.length) return null;

    return (
        <div className="rounded-2xl bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-bold text-primary-dark">Étapes à suivre</h2>
            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div key={step.title} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary/20">
                                <div className="h-3 w-3 rounded-full bg-secondary" />
                            </div>
                            {index < steps.length - 1 && (
                                <div className="mt-2 w-0.5 flex-1 bg-gray-200" />
                            )}
                        </div>
                        <div className="pb-6">
                            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-bold text-primary-dark">
                                <Clock size={11} />
                                {step.timing}
                            </span>
                            <h3 className="mt-1 font-bold text-primary-dark">{step.title}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
