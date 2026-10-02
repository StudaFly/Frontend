/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimelinePage from '@/features/timeline/pages/TimelinePage';
import type { TimelineTask } from '@/core/api/timeline';

vi.mock('@/core/api/mobilities', () => ({
    getMobilities: vi.fn(),
    getMobility: vi.fn(),
    updateMobility: vi.fn(),
    deleteMobility: vi.fn(),
}));

vi.mock('@/core/api/timeline', () => ({
    getTimeline: vi.fn(),
}));

import { getMobilities } from '@/core/api/mobilities';
import { getTimeline } from '@/core/api/timeline';
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

// Departure: 2025-09-01
// six-months-before  : dep - deadline > 180 days  → deadline before ~2025-03-05
// three-months-before: 90 < dep - deadline ≤ 180  → deadline ~2025-03-05..2025-06-03
// one-month-before   : 0  < dep - deadline ≤ 90   → deadline ~2025-06-04..2025-08-31
// after-arrival      : no deadline
// API-shaped fixtures (missing deadline → null, daysUntilDeadline computed by the backend)
const RAW_TIMELINE_TASKS: (Omit<TimelineTask, 'deadline' | 'daysUntilDeadline'> & { deadline?: string })[] = [
    // six-months-before (3 events)
    { id: 'e1', mobilityId: 'test-mobility-id', title: 'Dépôt du dossier Erasmus / bourse', description: 'Soumettre votre candidature.', category: 'admin', deadline: '2025-01-15', isCompleted: false, priority: 1 },
    { id: 'e2', mobilityId: 'test-mobility-id', title: 'Recherche de logement', description: 'Commencer les recherches.', category: 'housing', deadline: '2025-01-20', isCompleted: false, priority: 1 },
    { id: 'e3', mobilityId: 'test-mobility-id', title: 'Planification du budget global', description: 'Estimer les coûts.', category: 'finance', deadline: '2025-02-01', isCompleted: false, priority: 2 },
    // three-months-before (4 events)
    { id: 'e4', mobilityId: 'test-mobility-id', title: 'Demande de visa', description: 'Déposer le dossier.', category: 'admin', deadline: '2025-04-01', isCompleted: false, priority: 1 },
    { id: 'e5', mobilityId: 'test-mobility-id', title: 'Signature du contrat de logement', description: 'Finaliser le bail.', category: 'housing', deadline: '2025-04-15', isCompleted: false, priority: 1 },
    { id: 'e6', mobilityId: 'test-mobility-id', title: 'Demande CEAM', description: "Demander la Carte Européenne d'Assurance Maladie.", category: 'health', deadline: '2025-05-01', isCompleted: false, priority: 1 },
    { id: 'e7', mobilityId: 'test-mobility-id', title: 'Ouverture compte bancaire international', description: 'Souscrire à une carte.', category: 'finance', deadline: '2025-05-15', isCompleted: false, priority: 2 },
    // one-month-before (4 events)
    { id: 'e8', mobilityId: 'test-mobility-id', title: "Achat du billet d'avion", description: 'Comparer et réserver.', category: 'practical', deadline: '2025-07-01', isCompleted: false, priority: 2 },
    { id: 'e9', mobilityId: 'test-mobility-id', title: 'Stock de médicaments essentiels', description: 'Préparer une pharmacie.', category: 'health', deadline: '2025-07-15', isCompleted: false, priority: 2 },
    { id: 'e10', mobilityId: 'test-mobility-id', title: 'Souscription assurance voyage', description: 'Vérifier la couverture.', category: 'health', deadline: '2025-08-01', isCompleted: false, priority: 3 },
    { id: 'e11', mobilityId: 'test-mobility-id', title: 'Préparation des valises', description: 'Faire une liste.', category: 'practical', deadline: '2025-08-15', isCompleted: false, priority: 2 },
    // after-arrival (4 events, no deadline)
    { id: 'e12', mobilityId: 'test-mobility-id', title: "Inscription à l'université d'accueil", description: "Finaliser l'inscription.", category: 'admin', isCompleted: false, priority: 1 },
    { id: 'e13', mobilityId: 'test-mobility-id', title: 'Achat SIM locale', description: 'Souscrire à un forfait.', category: 'practical', isCompleted: false, priority: 2 },
    { id: 'e14', mobilityId: 'test-mobility-id', title: 'Inventaire du logement', description: "Réaliser l'état des lieux.", category: 'housing', isCompleted: false, priority: 3 },
    { id: 'e15', mobilityId: 'test-mobility-id', title: 'Découverte du quartier et du campus', description: 'Repérer les commerces.', category: 'practical', isCompleted: false, priority: 3 },
];
const MOCK_TIMELINE_TASKS: TimelineTask[] = RAW_TIMELINE_TASKS.map((task) => ({
    ...task,
    deadline: task.deadline ?? null,
    daysUntilDeadline: null,
}));

beforeEach(() => {
    vi.mocked(getMobilities).mockResolvedValue({
        data: { data: [MOCK_MOBILITY], message: 'ok' },
    } as any);
    vi.mocked(getTimeline).mockResolvedValue({
        data: { data: [...MOCK_TIMELINE_TASKS], message: 'ok' },
    } as any);
});

function renderTimelinePage() {
    return renderWithProviders(
        <MemoryRouter>
            <TimelinePage />
        </MemoryRouter>
    );
}

describe('TimelinePage', () => {
    describe('initial render', () => {
        it('shows the "Timeline" title', async () => {
            renderTimelinePage();
            expect(await screen.findByText('Timeline')).toBeInTheDocument();
        });

        it('shows the total of 15 steps in the hero', async () => {
            renderTimelinePage();
            expect(
                await screen.findByText(/15 étapes pour préparer sereinement votre mobilité/i),
            ).toBeInTheDocument();
        });

        it('shows the 4 period sections', async () => {
            renderTimelinePage();
            expect(await screen.findByText('6 mois avant le départ')).toBeInTheDocument();
            expect(screen.getByText('3 mois avant le départ')).toBeInTheDocument();
            expect(screen.getByText('1 mois avant le départ')).toBeInTheDocument();
            expect(screen.getByText("Après l'arrivée")).toBeInTheDocument();
        });

        it('shows the expand controls: 1 / 4 periods open', async () => {
            renderTimelinePage();
            expect(await screen.findByText('1 / 4 périodes ouvertes')).toBeInTheDocument();
        });

        it('shows the "Tout développer" button', async () => {
            renderTimelinePage();
            expect(
                await screen.findByRole('button', { name: /tout développer/i }),
            ).toBeInTheDocument();
        });

        it('shows the events of the first period (open by default)', async () => {
            renderTimelinePage();
            expect(await screen.findByText('Dépôt du dossier Erasmus / bourse')).toBeInTheDocument();
            expect(screen.getByText('Recherche de logement')).toBeInTheDocument();
            expect(screen.getByText('Planification du budget global')).toBeInTheDocument();
        });

        it('does not show the events of closed periods', async () => {
            renderTimelinePage();
            await screen.findByText('1 / 4 périodes ouvertes');
            expect(screen.queryByText('Demande de visa')).not.toBeInTheDocument();
            expect(screen.queryByText("Achat du billet d'avion")).not.toBeInTheDocument();
            expect(screen.queryByText("Inscription à l'université d'accueil")).not.toBeInTheDocument();
        });

        it('shows the legend', async () => {
            renderTimelinePage();
            expect(await screen.findByText('Légende')).toBeInTheDocument();
            expect(screen.getByText('Étape facultative')).toBeInTheDocument();
        });
    });

    describe('expand / collapse', () => {
        it('clicking "Tout développer" opens every period', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));

            expect(screen.getByText('4 / 4 périodes ouvertes')).toBeInTheDocument();
            expect(screen.getByText('Demande de visa')).toBeInTheDocument();
            expect(screen.getByText("Achat du billet d'avion")).toBeInTheDocument();
            expect(screen.getByText("Inscription à l'université d'accueil")).toBeInTheDocument();
        });

        it('the button becomes "Tout réduire" after expand all', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));

            expect(screen.getByRole('button', { name: /tout réduire/i })).toBeInTheDocument();
        });

        it('"Tout réduire" closes every period', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));
            await user.click(screen.getByRole('button', { name: /tout réduire/i }));

            expect(screen.getByText('0 / 4 périodes ouvertes')).toBeInTheDocument();
            expect(screen.queryByText('Dépôt du dossier Erasmus / bourse')).not.toBeInTheDocument();
        });

        it('the button goes back to "Tout développer" after collapse all', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));
            await user.click(screen.getByRole('button', { name: /tout réduire/i }));

            expect(screen.getByRole('button', { name: /tout développer/i })).toBeInTheDocument();
        });
    });

    describe('single period toggle', () => {
        it('clicking the first period header closes it', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /6 mois avant le départ/i }));

            expect(screen.getByText('0 / 4 périodes ouvertes')).toBeInTheDocument();
        });

        it('clicking a closed period header opens it', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await screen.findByText('1 / 4 périodes ouvertes');
            await user.click(screen.getByRole('button', { name: /3 mois avant le départ/i }));

            expect(screen.getByText('2 / 4 périodes ouvertes')).toBeInTheDocument();
            expect(screen.getByText('Demande de visa')).toBeInTheDocument();
        });
    });

    describe('category and optional badges', () => {
        it('shows category badges on visible events', async () => {
            renderTimelinePage();
            await screen.findByText('1 / 4 périodes ouvertes');
            // Labels come from GET /reference (async)
            expect((await screen.findAllByText('Finance')).length).toBeGreaterThanOrEqual(1);
            expect(screen.getAllByText('Logement').length).toBeGreaterThanOrEqual(1);
        });

        it('shows Optionnel badges on optional events (after expand all)', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));

            // e10 and e15 are optional (priority 3), plus the legend badge = at least 2
            const optionalBadges = screen.getAllByText('Optionnel');
            expect(optionalBadges.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('period counters', () => {
        it('shows the number of steps per period', async () => {
            renderTimelinePage();
            // The first period is open → its "3 étapes" badge is visible
            expect(await screen.findByText('3 étapes')).toBeInTheDocument();
        });
    });
});
