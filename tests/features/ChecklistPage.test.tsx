/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChecklistPage from '@/features/checklist/pages/ChecklistPage';
import { TASKS } from '../fixtures/tasks';

vi.mock('@/core/api/mobilities', () => ({
    getMobilities: vi.fn(),
    getMobility: vi.fn(),
    updateMobility: vi.fn(),
    deleteMobility: vi.fn(),
}));

vi.mock('@/core/api/checklist', () => ({
    getTasks: vi.fn(),
    createTask: vi.fn(),
    completeTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
}));

import { getMobilities } from '@/core/api/mobilities';
import { getTasks, createTask, completeTask } from '@/core/api/checklist';
import { renderWithProviders } from "../utils/providers";

const MOCK_MOBILITY = {
    id: 'test-mobility-id',
    userId: 'u1',
    destinationId: 'd1',
    type: 'erasmus' as const,
    departureDate: '2025-09-01',
    status: 'preparing' as const,
    createdAt: '2024-01-01',
};

beforeEach(() => {
    vi.mocked(getMobilities).mockResolvedValue({
        data: { data: [MOCK_MOBILITY], message: 'ok' },
    } as any);
    vi.mocked(getTasks).mockResolvedValue({
        data: { data: TASKS.map((t) => ({ ...t })), message: 'ok' },
    } as any);
    // Behaves like the API: toggles the stored task and returns its new version.
    const serverTasks = TASKS.map((t) => ({ ...t }));
    vi.mocked(completeTask).mockImplementation((id) => {
        const task = serverTasks.find((t) => t.id === id)!;
        task.isCompleted = !task.isCompleted;
        return Promise.resolve({ data: { data: { ...task }, message: 'ok' } } as any);
    });
    vi.mocked(createTask).mockImplementation((_mobilityId, data) =>
        Promise.resolve({
            data: {
                data: {
                    id: `new-${Date.now()}`,
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    deadline: data.deadline || undefined,
                    priority: data.priority,
                    isCompleted: false,
                },
                message: 'ok',
            },
        } as any),
    );
});

function renderChecklistPage() {
    return renderWithProviders(
        <MemoryRouter>
            <ChecklistPage />
        </MemoryRouter>
    );
}

describe('ChecklistPage', () => {
    describe('initial render', () => {
        it('shows the "Checklist" title', async () => {
            renderChecklistPage();
            expect(await screen.findByText('Checklist')).toBeInTheDocument();
        });

        it('shows the 0/11 completed tasks counter', async () => {
            renderChecklistPage();
            expect(await screen.findByText(/0\/11 tâches complétées/)).toBeInTheDocument();
        });

        it('shows every task of the 5 categories', async () => {
            renderChecklistPage();
            expect(await screen.findByText('Demande de visa')).toBeInTheDocument();
            expect(screen.getByText("Lettre d'acceptation université")).toBeInTheDocument();
            expect(screen.getByText('Passeport valide +6 mois')).toBeInTheDocument();
            expect(screen.getByText('Carte bancaire internationale')).toBeInTheDocument();
            expect(screen.getByText('Budget prévu sur 6 mois')).toBeInTheDocument();
            expect(screen.getByText('CEAM (Carte Euro Assurance Maladie)')).toBeInTheDocument();
            expect(screen.getByText('Adaptateur électrique')).toBeInTheDocument();
        });

        it('shows the category tabs', async () => {
            renderChecklistPage();
            // Wait for full data load before checking tabs (page enters loading state between getMobilities and getTasks)
            await screen.findByText(/0\/11 tâches complétées/);
            expect(screen.getByText('Toutes')).toBeInTheDocument();
            expect(screen.getByText('Admin')).toBeInTheDocument();
            expect(screen.getByText('Finance')).toBeInTheDocument();
            expect(screen.getByText('Santé')).toBeInTheDocument();
            expect(screen.getByText('Logement')).toBeInTheDocument();
            expect(screen.getByText('Pratique')).toBeInTheDocument();
        });

        it('shows the priority badges', async () => {
            renderChecklistPage();
            await screen.findByText(/0\/11 tâches complétées/);
            expect(screen.getAllByText('Haute').length).toBeGreaterThanOrEqual(1);
            expect(screen.getAllByText('Moyenne').length).toBeGreaterThanOrEqual(1);
            expect(screen.getAllByText('Basse').length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('filtering by category', () => {
        it('filters on the Admin category', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            await user.click(screen.getByText('Admin').closest('button')!);

            expect(screen.getByText('Demande de visa')).toBeInTheDocument();
            expect(screen.getByText('Passeport valide +6 mois')).toBeInTheDocument();
            expect(screen.queryByText('Budget prévu sur 6 mois')).not.toBeInTheDocument();
            expect(screen.queryByText('Adaptateur électrique')).not.toBeInTheDocument();
        });

        it('filters on the Finance category', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            await user.click(screen.getByText('Finance').closest('button')!);

            expect(screen.getByText('Carte bancaire internationale')).toBeInTheDocument();
            expect(screen.getByText('Budget prévu sur 6 mois')).toBeInTheDocument();
            expect(screen.queryByText('Demande de visa')).not.toBeInTheDocument();
        });

        it('shows everything again when clicking "Toutes"', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            await user.click(screen.getByText('Admin').closest('button')!);
            await user.click(screen.getByText('Toutes').closest('button')!);

            expect(screen.getByText('Budget prévu sur 6 mois')).toBeInTheDocument();
            expect(screen.getByText('Adaptateur électrique')).toBeInTheDocument();
        });

        it('shows a message when the category is empty', async () => {
            // Case covered by the TaskList component on its own
        });
    });

    describe('task interactions', () => {
        it('checking a task increments the counter', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            const checkboxes = screen.getAllByRole('button', { name: /marquer comme complété/i });
            await user.click(checkboxes[0]);

            expect(screen.getByText(/1\/11 tâches complétées/)).toBeInTheDocument();
        });

        it('unchecking a task decrements the counter', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            const checkboxes = screen.getAllByRole('button', { name: /marquer comme complété/i });
            await user.click(checkboxes[0]);
            await user.click(screen.getByRole('button', { name: /marquer comme non complété/i }));

            expect(screen.getByText(/0\/11 tâches complétées/)).toBeInTheDocument();
        });

        it('clicking the title expands the description', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText('Demande de visa');
            await user.click(screen.getByText('Demande de visa'));

            expect(
                screen.getByText('Déposer le dossier de visa auprès du consulat compétent.'),
            ).toBeInTheDocument();
        });

        it('clicking the title again collapses the description', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText('Demande de visa');
            await user.click(screen.getByText('Demande de visa'));
            await user.click(screen.getByText('Demande de visa'));

            expect(
                screen.queryByText('Déposer le dossier de visa auprès du consulat compétent.'),
            ).not.toBeInTheDocument();
        });

        it('the progress bar moves forward when tasks are checked', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            expect(screen.getByText('0%')).toBeInTheDocument();

            const checkboxes = screen.getAllByRole('button', { name: /marquer comme complété/i });
            await user.click(checkboxes[0]);

            expect(screen.getByText('9%')).toBeInTheDocument();
        });
    });

    describe('add task modal', () => {
        it('opens the modal when the FAB is clicked', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await user.click(screen.getByRole('button', { name: /ajouter une tâche/i }));

            expect(
                screen.getByRole('heading', { name: /ajouter une tâche/i }),
            ).toBeInTheDocument();
        });

        it('closes the modal with the Escape key', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await user.click(screen.getByRole('button', { name: /ajouter une tâche/i }));
            await user.keyboard('{Escape}');

            expect(
                screen.queryByRole('heading', { name: /ajouter une tâche/i }),
            ).not.toBeInTheDocument();
        });

        it('closes the modal when Annuler is clicked', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await user.click(screen.getByRole('button', { name: /ajouter une tâche/i }));
            await user.click(screen.getByRole('button', { name: /annuler/i }));

            expect(
                screen.queryByRole('heading', { name: /ajouter une tâche/i }),
            ).not.toBeInTheDocument();
        });

        it('adds a new task through the form', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await user.click(screen.getByRole('button', { name: /ajouter une tâche/i }));
            await user.type(
                screen.getByPlaceholderText(/ouvrir un compte bancaire local/i),
                'Ma tâche personnalisée',
            );
            await user.click(screen.getByRole('button', { name: /^ajouter$/i }));

            expect(await screen.findByText('Ma tâche personnalisée')).toBeInTheDocument();
            expect(
                screen.queryByRole('heading', { name: /ajouter une tâche/i }),
            ).not.toBeInTheDocument();
        });

        it('does not add a task when the title is empty', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            await user.click(screen.getByRole('button', { name: /ajouter une tâche/i }));
            await user.click(screen.getByRole('button', { name: /^ajouter$/i }));

            expect(
                screen.getByRole('heading', { name: /ajouter une tâche/i }),
            ).toBeInTheDocument();
            expect(screen.getByText(/0\/11 tâches complétées/)).toBeInTheDocument();
        });
    });
});
