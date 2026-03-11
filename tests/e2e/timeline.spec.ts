import { test, expect } from '@playwright/test';

const MOCK_USER = {
    firstName: 'Alice',
    lastName: 'Test',
    email: 'alice@test.com',
    avatar: null,
    avatarType: 'emoji',
    age: '22',
    city: 'Paris',
    destinations: ['Espagne'],
    period: 'S1 2025',
    budget: '800',
    cover: null,
};

test.beforeEach(async ({ page }) => {
    await page.addInitScript((user) => {
        localStorage.setItem('studafly_auth_user', JSON.stringify(user));
    }, MOCK_USER);
});

test.describe('Timeline — navigation et rendu', () => {
    test('charge la page et affiche le titre', async ({ page }) => {
        await page.goto('/timeline');
        await expect(page.getByText('Timeline')).toBeVisible();
    });

    test('affiche 15 étapes dans le hero', async ({ page }) => {
        await page.goto('/timeline');
        await expect(
            page.getByText(/15 étapes pour préparer sereinement votre mobilité/i),
        ).toBeVisible();
    });

    test('affiche les 4 sections de période', async ({ page }) => {
        await page.goto('/timeline');
        await expect(page.getByText('6 mois avant le départ')).toBeVisible();
        await expect(page.getByText('3 mois avant le départ')).toBeVisible();
        await expect(page.getByText('1 mois avant le départ')).toBeVisible();
        await expect(page.getByText("Après l'arrivée")).toBeVisible();
    });

    test('affiche les contrôles expand/collapse', async ({ page }) => {
        await page.goto('/timeline');
        await expect(page.getByText('1 / 4 périodes ouvertes')).toBeVisible();
        await expect(page.getByRole('button', { name: /tout développer/i })).toBeVisible();
    });

    test('affiche la légende en bas de page', async ({ page }) => {
        await page.goto('/timeline');
        await expect(page.getByText('Légende')).toBeVisible();
        await expect(page.getByText('Étape facultative')).toBeVisible();
    });
});

test.describe('Timeline — première période ouverte par défaut', () => {
    test('affiche les événements de J-6 mois', async ({ page }) => {
        await page.goto('/timeline');
        await expect(page.getByText('Dépôt du dossier Erasmus / bourse')).toBeVisible();
        await expect(page.getByText('Recherche de logement')).toBeVisible();
        await expect(page.getByText('Planification du budget global')).toBeVisible();
    });

    test("n'affiche pas les événements des autres périodes", async ({ page }) => {
        await page.goto('/timeline');
        await expect(page.getByText('Demande de visa')).not.toBeVisible();
        await expect(page.getByText("Achat du billet d'avion")).not.toBeVisible();
    });
});

test.describe('Timeline — expand / collapse', () => {
    test('"Tout développer" ouvre toutes les périodes', async ({ page }) => {
        await page.goto('/timeline');

        await page.getByRole('button', { name: /tout développer/i }).click();

        await expect(page.getByText('4 / 4 périodes ouvertes')).toBeVisible();
        await expect(page.getByText('Demande de visa')).toBeVisible();
        await expect(page.getByText("Achat du billet d'avion")).toBeVisible();
        await expect(page.getByText("Inscription à l'université d'accueil")).toBeVisible();
    });

    test('le bouton devient "Tout réduire" après expand all', async ({ page }) => {
        await page.goto('/timeline');

        await page.getByRole('button', { name: /tout développer/i }).click();

        await expect(page.getByRole('button', { name: /tout réduire/i })).toBeVisible();
    });

    test('"Tout réduire" ferme toutes les périodes', async ({ page }) => {
        await page.goto('/timeline');

        await page.getByRole('button', { name: /tout développer/i }).click();
        await page.getByRole('button', { name: /tout réduire/i }).click();

        await expect(page.getByText('0 / 4 périodes ouvertes')).toBeVisible();
        await expect(page.getByText('Dépôt du dossier Erasmus / bourse')).not.toBeVisible();
    });

    test('cliquer sur un header de période le ferme', async ({ page }) => {
        await page.goto('/timeline');

        await page.getByRole('button', { name: /6 mois avant le départ/i }).click();

        await expect(page.getByText('0 / 4 périodes ouvertes')).toBeVisible();
    });

    test("cliquer sur un header de période fermée l'ouvre", async ({ page }) => {
        await page.goto('/timeline');

        await page.getByRole('button', { name: /3 mois avant le départ/i }).click();

        await expect(page.getByText('Signature du contrat de logement')).toBeVisible();
        await expect(page.getByText('2 / 4 périodes ouvertes')).toBeVisible();
    });
});

test.describe('Timeline — badges', () => {
    test('affiche les badges de catégorie Admin sur les événements visibles', async ({ page }) => {
        await page.goto('/timeline');
        await expect(page.getByText('Admin').first()).toBeVisible();
    });

    test('affiche le badge Optionnel sur les événements optionnels', async ({ page }) => {
        await page.goto('/timeline');

        await page.getByRole('button', { name: /tout développer/i }).click();

        const optionalBadges = page.getByText('Optionnel');
        await expect(optionalBadges.first()).toBeVisible();
        expect(await optionalBadges.count()).toBeGreaterThanOrEqual(2);
    });
});
