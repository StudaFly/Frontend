/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
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
const MOCK_TIMELINE_TASKS: TimelineTask[] = [
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

beforeEach(() => {
    vi.mocked(getMobilities).mockResolvedValue({
        data: { data: [MOCK_MOBILITY], message: 'ok' },
    } as any);
    vi.mocked(getTimeline).mockResolvedValue({
        data: { data: [...MOCK_TIMELINE_TASKS], message: 'ok' },
    } as any);
});

function renderTimelinePage() {
    return render(
        <MemoryRouter>
            <TimelinePage />
        </MemoryRouter>
    );
}

describe('TimelinePage', () => {
    describe('rendu initial', () => {
        it('affiche le titre "Timeline"', async () => {
            renderTimelinePage();
            expect(await screen.findByText('Timeline')).toBeInTheDocument();
        });

        it('affiche le total de 15 étapes dans le hero', async () => {
            renderTimelinePage();
            expect(
                await screen.findByText(/15 étapes pour préparer sereinement votre mobilité/i),
            ).toBeInTheDocument();
        });

        it('affiche les 4 sections de période', async () => {
            renderTimelinePage();
            expect(await screen.findByText('6 mois avant le départ')).toBeInTheDocument();
            expect(screen.getByText('3 mois avant le départ')).toBeInTheDocument();
            expect(screen.getByText('1 mois avant le départ')).toBeInTheDocument();
            expect(screen.getByText("Après l'arrivée")).toBeInTheDocument();
        });

        it('affiche les contrôles expand : 1 / 4 périodes ouvertes', async () => {
            renderTimelinePage();
            expect(await screen.findByText('1 / 4 périodes ouvertes')).toBeInTheDocument();
        });

        it('affiche le bouton "Tout développer"', async () => {
            renderTimelinePage();
            expect(
                await screen.findByRole('button', { name: /tout développer/i }),
            ).toBeInTheDocument();
        });

        it('affiche les événements de la première période (ouverte par défaut)', async () => {
            renderTimelinePage();
            expect(await screen.findByText('Dépôt du dossier Erasmus / bourse')).toBeInTheDocument();
            expect(screen.getByText('Recherche de logement')).toBeInTheDocument();
            expect(screen.getByText('Planification du budget global')).toBeInTheDocument();
        });

        it("n'affiche pas les événements des périodes fermées", async () => {
            renderTimelinePage();
            await screen.findByText('1 / 4 périodes ouvertes');
            expect(screen.queryByText('Demande de visa')).not.toBeInTheDocument();
            expect(screen.queryByText("Achat du billet d'avion")).not.toBeInTheDocument();
            expect(screen.queryByText("Inscription à l'université d'accueil")).not.toBeInTheDocument();
        });

        it('affiche la légende', async () => {
            renderTimelinePage();
            expect(await screen.findByText('Légende')).toBeInTheDocument();
            expect(screen.getByText('Étape facultative')).toBeInTheDocument();
        });
    });

    describe('expand / collapse', () => {
        it('clique sur "Tout développer" ouvre toutes les périodes', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));

            expect(screen.getByText('4 / 4 périodes ouvertes')).toBeInTheDocument();
            expect(screen.getByText('Demande de visa')).toBeInTheDocument();
            expect(screen.getByText("Achat du billet d'avion")).toBeInTheDocument();
            expect(screen.getByText("Inscription à l'université d'accueil")).toBeInTheDocument();
        });

        it('le bouton devient "Tout réduire" après expand all', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));

            expect(screen.getByRole('button', { name: /tout réduire/i })).toBeInTheDocument();
        });

        it('"Tout réduire" ferme toutes les périodes', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));
            await user.click(screen.getByRole('button', { name: /tout réduire/i }));

            expect(screen.getByText('0 / 4 périodes ouvertes')).toBeInTheDocument();
            expect(screen.queryByText('Dépôt du dossier Erasmus / bourse')).not.toBeInTheDocument();
        });

        it('le bouton redevient "Tout développer" après collapse all', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));
            await user.click(screen.getByRole('button', { name: /tout réduire/i }));

            expect(screen.getByRole('button', { name: /tout développer/i })).toBeInTheDocument();
        });
    });

    describe('toggle période individuelle', () => {
        it('cliquer sur le header de la première période la ferme', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /6 mois avant le départ/i }));

            expect(screen.getByText('0 / 4 périodes ouvertes')).toBeInTheDocument();
        });

        it("cliquer sur le header d'une période fermée l'ouvre", async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await screen.findByText('1 / 4 périodes ouvertes');
            await user.click(screen.getByRole('button', { name: /3 mois avant le départ/i }));

            expect(screen.getByText('2 / 4 périodes ouvertes')).toBeInTheDocument();
            expect(screen.getByText('Demande de visa')).toBeInTheDocument();
        });
    });

    describe('badges catégorie et optionnel', () => {
        it('affiche les badges de catégorie sur les événements visibles', async () => {
            renderTimelinePage();
            await screen.findByText('1 / 4 périodes ouvertes');
            expect(screen.getAllByText('Finance').length).toBeGreaterThanOrEqual(1);
            expect(screen.getAllByText('Logement').length).toBeGreaterThanOrEqual(1);
        });

        it('affiche les badges Optionnel sur les événements optionnels (après expand all)', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(await screen.findByRole('button', { name: /tout développer/i }));

            // e10 et e15 sont optionnels (priority 3), plus le badge dans la légende = au moins 2
            const optionalBadges = screen.getAllByText('Optionnel');
            expect(optionalBadges.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('compteurs de périodes', () => {
        it("affiche le nombre d'étapes par période", async () => {
            renderTimelinePage();
            // La première période est ouverte → son badge "3 étapes" est visible
            expect(await screen.findByText('3 étapes')).toBeInTheDocument();
        });
    });
});
