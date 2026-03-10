interface RegisterStepProgressProps {
    currentStep: 1 | 2 | 3;
}

export function RegisterStepProgress({ currentStep }: RegisterStepProgressProps) {
    return (
        <div className="mb-8 flex items-center justify-center gap-2">
            {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2">
                    {/* Step Circle */}
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${currentStep >= n
                                ? "bg-secondary text-primary-dark shadow-md"
                                : "bg-gray-200 text-gray-500"
                            }`}
                    >
                        {n}
                    </div>

                    {/* Connecting Line (except after last step) */}
                    {n < 3 && (
                        <div
                            className={`h-1 w-12 rounded transition-all duration-300 sm:w-16 ${currentStep > n ? "bg-secondary" : "bg-gray-200"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
