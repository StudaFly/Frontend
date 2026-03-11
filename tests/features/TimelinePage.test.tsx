import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import TimelinePage from '@/features/timeline/pages/TimelinePage';

function renderTimelinePage() {
    return render(
        <MemoryRouter>
            <TimelinePage />
        </MemoryRouter>
    );
}

describe('TimelinePage', () => {
    describe('rendu initial', () => {
        it('affiche le titre "Timeline"', () => {
            renderTimelinePage();
            expect(screen.getByText('Timeline')).toBeInTheDocument();
        });

        it('affiche le total de 15 étapes dans le hero', () => {
            renderTimelinePage();
            expect(
                screen.getByText(/15 étapes pour préparer sereinement votre mobilité/i),
            ).toBeInTheDocument();
        });

        it('affiche les 4 sections de période', () => {
            renderTimelinePage();
            expect(screen.getByText('6 mois avant le départ')).toBeInTheDocument();
            expect(screen.getByText('3 mois avant le départ')).toBeInTheDocument();
            expect(screen.getByText('1 mois avant le départ')).toBeInTheDocument();
            expect(screen.getByText("Après l'arrivée")).toBeInTheDocument();
        });

        it('affiche les contrôles expand : 1 / 4 périodes ouvertes', () => {
            renderTimelinePage();
            expect(screen.getByText('1 / 4 périodes ouvertes')).toBeInTheDocument();
        });

        it('affiche le bouton "Tout développer"', () => {
            renderTimelinePage();
            expect(
                screen.getByRole('button', { name: /tout développer/i }),
            ).toBeInTheDocument();
        });

        it('affiche les événements de la première période (ouverte par défaut)', () => {
            renderTimelinePage();
            expect(screen.getByText('Dépôt du dossier Erasmus / bourse')).toBeInTheDocument();
            expect(screen.getByText('Recherche de logement')).toBeInTheDocument();
            expect(screen.getByText('Planification du budget global')).toBeInTheDocument();
        });

        it("n'affiche pas les événements des périodes fermées", () => {
            renderTimelinePage();
            expect(screen.queryByText('Demande de visa')).not.toBeInTheDocument();
            expect(screen.queryByText("Achat du billet d'avion")).not.toBeInTheDocument();
            expect(screen.queryByText("Inscription à l'université d'accueil")).not.toBeInTheDocument();
        });

        it('affiche la légende', () => {
            renderTimelinePage();
            expect(screen.getByText('Légende')).toBeInTheDocument();
            expect(screen.getByText('Étape facultative')).toBeInTheDocument();
        });
    });

    describe('expand / collapse', () => {
        it('clique sur "Tout développer" ouvre toutes les périodes', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(screen.getByRole('button', { name: /tout développer/i }));

            expect(screen.getByText('4 / 4 périodes ouvertes')).toBeInTheDocument();
            expect(screen.getByText('Demande de visa')).toBeInTheDocument();
            expect(screen.getByText("Achat du billet d'avion")).toBeInTheDocument();
            expect(screen.getByText("Inscription à l'université d'accueil")).toBeInTheDocument();
        });

        it('le bouton devient "Tout réduire" après expand all', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(screen.getByRole('button', { name: /tout développer/i }));

            expect(screen.getByRole('button', { name: /tout réduire/i })).toBeInTheDocument();
        });

        it('"Tout réduire" ferme toutes les périodes', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(screen.getByRole('button', { name: /tout développer/i }));
            await user.click(screen.getByRole('button', { name: /tout réduire/i }));

            expect(screen.getByText('0 / 4 périodes ouvertes')).toBeInTheDocument();
            expect(screen.queryByText('Dépôt du dossier Erasmus / bourse')).not.toBeInTheDocument();
        });

        it('le bouton redevient "Tout développer" après collapse all', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(screen.getByRole('button', { name: /tout développer/i }));
            await user.click(screen.getByRole('button', { name: /tout réduire/i }));

            expect(screen.getByRole('button', { name: /tout développer/i })).toBeInTheDocument();
        });
    });

    describe('toggle période individuelle', () => {
        it('cliquer sur le header de la première période la ferme', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(screen.getByRole('button', { name: /6 mois avant le départ/i }));

            expect(screen.getByText('0 / 4 périodes ouvertes')).toBeInTheDocument();
        });

        it("cliquer sur le header d'une période fermée l'ouvre", async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(screen.getByRole('button', { name: /3 mois avant le départ/i }));

            expect(screen.getByText('2 / 4 périodes ouvertes')).toBeInTheDocument();
            expect(screen.getByText('Demande de visa')).toBeInTheDocument();
        });
    });

    describe('badges catégorie et optionnel', () => {
        it('affiche les badges de catégorie sur les événements visibles', () => {
            renderTimelinePage();
            expect(screen.getAllByText('Finance').length).toBeGreaterThanOrEqual(1);
            expect(screen.getAllByText('Logement').length).toBeGreaterThanOrEqual(1);
        });

        it('affiche les badges Optionnel sur les événements optionnels (après expand all)', async () => {
            const user = userEvent.setup({ delay: null });
            renderTimelinePage();

            await user.click(screen.getByRole('button', { name: /tout développer/i }));

            // e10 et e15 sont optionnels, plus le badge dans la légende = au moins 2
            const optionalBadges = screen.getAllByText('Optionnel');
            expect(optionalBadges.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('compteurs de périodes', () => {
        it("affiche le nombre d'étapes par période", () => {
            renderTimelinePage();
            // La première période est ouverte → son badge "3 étapes" est visible
            expect(screen.getByText('3 étapes')).toBeInTheDocument();
        });
    });
});
