import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { CATEGORY_META } from '../data/tasks';
import { ModalFormField } from './ModalFormField';
import { PrioritySelector } from './PrioritySelector';
import type { NewTaskFormData } from '../types/task';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: NewTaskFormData) => void;
}

const EMPTY_FORM: NewTaskFormData = {
    title: '',
    description: '',
    category: 'admin',
    deadline: '',
    priority: 2,
};

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
    const { t } = useTranslation();
    const [form, setForm] = useState<NewTaskFormData>(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        onAdd(form);
        setForm(EMPTY_FORM);
        onClose();
    };

    const optional = t('checklist.modal.optional');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-heading text-xl font-bold text-primary-dark">
                        {t('checklist.modal.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        aria-label={t('checklist.modal.close_aria')}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Title */}
                    <ModalFormField label={t('checklist.modal.title_label')} required>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            placeholder={t('checklist.modal.title_placeholder')}
                            className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-dark"
                        />
                    </ModalFormField>

                    {/* Category */}
                    <ModalFormField label={t('checklist.modal.category_label')}>
                        <select
                            value={form.category}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    category: e.target.value as NewTaskFormData['category'],
                                }))
                            }
                            className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-dark"
                        >
                            {CATEGORY_META.filter((c) => c.id !== 'all').map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {t(`checklist.categories.${cat.id}`, { defaultValue: cat.label })}
                                </option>
                            ))}
                        </select>
                    </ModalFormField>

                    {/* Priority */}
                    <ModalFormField label={t('checklist.modal.priority_label')}>
                        <PrioritySelector
                            value={form.priority}
                            onChange={(p) => setForm((f) => ({ ...f, priority: p }))}
                        />
                    </ModalFormField>

                    {/* Deadline */}
                    <ModalFormField
                        label={t('checklist.modal.deadline_label')}
                        optionalLabel={optional}
                    >
                        <input
                            type="date"
                            value={form.deadline}
                            onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                            className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-dark"
                        />
                    </ModalFormField>

                    {/* Description */}
                    <ModalFormField
                        label={t('checklist.modal.description_label')}
                        optionalLabel={optional}
                    >
                        <textarea
                            rows={2}
                            value={form.description}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, description: e.target.value }))
                            }
                            placeholder={t('checklist.modal.description_placeholder')}
                            className="w-full resize-none rounded-xl border-2 border-transparent bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-dark"
                        />
                    </ModalFormField>

                    {/* Actions */}
                    <div className="mt-1 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-gray-600 ring-1 ring-slate-200 transition-colors hover:bg-gray-50"
                        >
                            {t('checklist.modal.cancel_btn')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-xl bg-primary-dark py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                        >
                            {t('checklist.modal.add_btn')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
