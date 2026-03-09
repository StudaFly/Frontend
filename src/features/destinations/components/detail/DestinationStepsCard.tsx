import { Clock } from "lucide-react";

interface Step {
    title: string;
    description: string;
    timeline: string;
}

interface DestinationStepsCardProps {
    steps: Step[];
}

export function DestinationStepsCard({ steps }: DestinationStepsCardProps) {
    return (
        <div className="rounded-2xl bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-bold text-primary-dark">Étapes clés</h2>
            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div key={step.title} className="flex gap-4">
                        {/* Step indicator + connector */}
                        <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-dark to-primary-light text-sm font-bold text-white">
                                {index + 1}
                            </div>
                            {index < steps.length - 1 && (
                                <div className="mt-2 w-0.5 flex-1 bg-gray-200" />
                            )}
                        </div>

                        {/* Step content */}
                        <div className="pb-6">
                            <div className="mb-1 flex items-center gap-3">
                                <h3 className="font-bold text-primary-dark">{step.title}</h3>
                                <span className="flex items-center gap-1 rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-primary-dark">
                                    <Clock size={11} />
                                    {step.timeline}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
