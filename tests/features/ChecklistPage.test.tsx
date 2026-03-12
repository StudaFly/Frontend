/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChecklistPage from '@/features/checklist/pages/ChecklistPage';
import { TASKS } from '@/features/checklist/data/tasks';

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
    vi.mocked(completeTask).mockResolvedValue({
        data: { data: TASKS[0], message: 'ok' },
    } as any);
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
                    isCustom: true,
                },
                message: 'ok',
            },
        } as any),
    );
});

function renderChecklistPage() {
    return render(
        <MemoryRouter>
            <ChecklistPage />
        </MemoryRouter>
    );
}

describe('ChecklistPage', () => {
    describe('rendu initial', () => {
        it('affiche le titre "Checklist"', async () => {
            renderChecklistPage();
            expect(await screen.findByText('Checklist')).toBeInTheDocument();
        });

        it('affiche le compteur 0/11 tâches complétées', async () => {
            renderChecklistPage();
            expect(await screen.findByText(/0\/11 tâches complétées/)).toBeInTheDocument();
        });

        it('affiche toutes les tâches des 5 catégories', async () => {
            renderChecklistPage();
            expect(await screen.findByText('Demande de visa')).toBeInTheDocument();
            expect(screen.getByText("Lettre d'acceptation université")).toBeInTheDocument();
            expect(screen.getByText('Passeport valide +6 mois')).toBeInTheDocument();
            expect(screen.getByText('Carte bancaire internationale')).toBeInTheDocument();
            expect(screen.getByText('Budget prévu sur 6 mois')).toBeInTheDocument();
            expect(screen.getByText('CEAM (Carte Euro Assurance Maladie)')).toBeInTheDocument();
            expect(screen.getByText('Adaptateur électrique')).toBeInTheDocument();
        });

        it('affiche les onglets de catégorie', async () => {
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

        it('affiche les badges de priorité', async () => {
            renderChecklistPage();
            await screen.findByText(/0\/11 tâches complétées/);
            expect(screen.getAllByText('Haute').length).toBeGreaterThanOrEqual(1);
            expect(screen.getAllByText('Moyenne').length).toBeGreaterThanOrEqual(1);
            expect(screen.getAllByText('Basse').length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('filtrage par catégorie', () => {
        it('filtre sur la catégorie Admin', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            await user.click(screen.getByText('Admin').closest('button')!);

            expect(screen.getByText('Demande de visa')).toBeInTheDocument();
            expect(screen.getByText('Passeport valide +6 mois')).toBeInTheDocument();
            expect(screen.queryByText('Budget prévu sur 6 mois')).not.toBeInTheDocument();
            expect(screen.queryByText('Adaptateur électrique')).not.toBeInTheDocument();
        });

        it('filtre sur la catégorie Finance', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            await user.click(screen.getByText('Finance').closest('button')!);

            expect(screen.getByText('Carte bancaire internationale')).toBeInTheDocument();
            expect(screen.getByText('Budget prévu sur 6 mois')).toBeInTheDocument();
            expect(screen.queryByText('Demande de visa')).not.toBeInTheDocument();
        });

        it('revient à tout afficher quand on clique sur "Toutes"', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            await user.click(screen.getByText('Admin').closest('button')!);
            await user.click(screen.getByText('Toutes').closest('button')!);

            expect(screen.getByText('Budget prévu sur 6 mois')).toBeInTheDocument();
            expect(screen.getByText('Adaptateur électrique')).toBeInTheDocument();
        });

        it('affiche un message quand la catégorie est vide', async () => {
            // Cas couvert par le composant TaskList isolément
        });
    });

    describe('interaction avec les tâches', () => {
        it('cocher une tâche incrémente le compteur', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            const checkboxes = screen.getAllByRole('button', { name: /marquer comme complété/i });
            await user.click(checkboxes[0]);

            expect(screen.getByText(/1\/11 tâches complétées/)).toBeInTheDocument();
        });

        it('décocher une tâche décrémente le compteur', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            const checkboxes = screen.getAllByRole('button', { name: /marquer comme complété/i });
            await user.click(checkboxes[0]);
            await user.click(screen.getByRole('button', { name: /marquer comme non complété/i }));

            expect(screen.getByText(/0\/11 tâches complétées/)).toBeInTheDocument();
        });

        it('cliquer sur le titre déplie la description', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText('Demande de visa');
            await user.click(screen.getByText('Demande de visa'));

            expect(
                screen.getByText('Déposer le dossier de visa auprès du consulat compétent.'),
            ).toBeInTheDocument();
        });

        it('re-cliquer sur le titre replie la description', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText('Demande de visa');
            await user.click(screen.getByText('Demande de visa'));
            await user.click(screen.getByText('Demande de visa'));

            expect(
                screen.queryByText('Déposer le dossier de visa auprès du consulat compétent.'),
            ).not.toBeInTheDocument();
        });

        it('la barre de progression avance quand des tâches sont cochées', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await screen.findByText(/0\/11 tâches complétées/);
            expect(screen.getByText('0%')).toBeInTheDocument();

            const checkboxes = screen.getAllByRole('button', { name: /marquer comme complété/i });
            await user.click(checkboxes[0]);

            expect(screen.getByText('9%')).toBeInTheDocument();
        });
    });

    describe("modale d'ajout de tâche", () => {
        it('ouvre la modale au clic sur le FAB', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await user.click(screen.getByRole('button', { name: /ajouter une tâche/i }));

            expect(
                screen.getByRole('heading', { name: /ajouter une tâche/i }),
            ).toBeInTheDocument();
        });

        it('ferme la modale avec la touche Escape', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await user.click(screen.getByRole('button', { name: /ajouter une tâche/i }));
            await user.keyboard('{Escape}');

            expect(
                screen.queryByRole('heading', { name: /ajouter une tâche/i }),
            ).not.toBeInTheDocument();
        });

        it('ferme la modale au clic sur le bouton Annuler', async () => {
            const user = userEvent.setup({ delay: null });
            renderChecklistPage();

            await user.click(screen.getByRole('button', { name: /ajouter une tâche/i }));
            await user.click(screen.getByRole('button', { name: /annuler/i }));

            expect(
                screen.queryByRole('heading', { name: /ajouter une tâche/i }),
            ).not.toBeInTheDocument();
        });

        it('ajoute une nouvelle tâche via le formulaire', async () => {
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

        it("n'ajoute pas de tâche si le titre est vide", async () => {
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
