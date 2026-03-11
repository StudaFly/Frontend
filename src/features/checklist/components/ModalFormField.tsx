import type { ReactNode } from 'react';

interface ModalFormFieldProps {
    label: string;
    optionalLabel?: string;
    required?: boolean;
    children: ReactNode;
}

export function ModalFormField({ label, optionalLabel, required, children }: ModalFormFieldProps) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                {label}
                {required && <span className="ml-0.5 text-red-500"> *</span>}
                {optionalLabel && (
                    <span className="ml-1 font-normal text-gray-400">{optionalLabel}</span>
                )}
            </label>
            {children}
        </div>
    );
}
