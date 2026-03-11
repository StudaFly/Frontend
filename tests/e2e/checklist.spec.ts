import { test, expect } from '@playwright/test';

/**
 * Simule un utilisateur connecté en peuplant le localStorage
 * avant le chargement de la page (AuthProvider lit ce storage au mount).
 */
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

test.describe('Checklist — navigation et rendu', () => {
    test('charge la page et affiche le titre', async ({ page }) => {
        await page.goto('/checklist');
        await expect(page.getByText('Checklist')).toBeVisible();
    });

    test('affiche le compteur de tâches dans le hero', async ({ page }) => {
        await page.goto('/checklist');
        await expect(page.getByText(/0\/11 tâches complétées/)).toBeVisible();
    });

    test('affiche les onglets de catégorie', async ({ page }) => {
        await page.goto('/checklist');
        await expect(page.getByText('Toutes')).toBeVisible();
        await expect(page.getByText('Admin')).toBeVisible();
        await expect(page.getByText('Finance')).toBeVisible();
        await expect(page.getByText('Santé')).toBeVisible();
    });

    test('affiche les tâches de la liste', async ({ page }) => {
        await page.goto('/checklist');
        await expect(page.getByText('Demande de visa')).toBeVisible();
        await expect(page.getByText('Passeport valide +6 mois')).toBeVisible();
        await expect(page.getByText('Adaptateur électrique')).toBeVisible();
    });
});

test.describe('Checklist — filtrage par catégorie', () => {
    test('filtre sur Admin affiche seulement les tâches admin', async ({ page }) => {
        await page.goto('/checklist');

        await page.getByRole('button', { name: /admin/i }).first().click();

        await expect(page.getByText('Demande de visa')).toBeVisible();
        await expect(page.getByText('Budget prévu sur 6 mois')).not.toBeVisible();
    });

    test('retour sur "Toutes" réaffiche tout', async ({ page }) => {
        await page.goto('/checklist');

        await page.getByRole('button', { name: /admin/i }).first().click();
        await page.getByRole('button', { name: /toutes/i }).first().click();

        await expect(page.getByText('Budget prévu sur 6 mois')).toBeVisible();
    });
});

test.describe('Checklist — interactions tâches', () => {
    test('cocher une tâche met à jour le compteur', async ({ page }) => {
        await page.goto('/checklist');

        await page
            .getByRole('button', { name: /marquer comme complété/i })
            .first()
            .click();

        await expect(page.getByText(/1\/11 tâches complétées/)).toBeVisible();
    });

    test('cliquer sur une tâche affiche sa description', async ({ page }) => {
        await page.goto('/checklist');

        await page.getByText('Demande de visa').click();

        await expect(
            page.getByText('Déposer le dossier de visa auprès du consulat compétent.'),
        ).toBeVisible();
    });
});

test.describe('Checklist — modale ajout', () => {
    test('le FAB ouvre la modale', async ({ page }) => {
        await page.goto('/checklist');

        await page.getByRole('button', { name: /ajouter une tâche/i }).click();

        await expect(page.getByRole('heading', { name: /ajouter une tâche/i })).toBeVisible();
    });

    test('Escape ferme la modale', async ({ page }) => {
        await page.goto('/checklist');

        await page.getByRole('button', { name: /ajouter une tâche/i }).click();
        await page.keyboard.press('Escape');

        await expect(
            page.getByRole('heading', { name: /ajouter une tâche/i }),
        ).not.toBeVisible();
    });

    test("ajouter une tâche l'affiche dans la liste", async ({ page }) => {
        await page.goto('/checklist');

        await page.getByRole('button', { name: /ajouter une tâche/i }).click();
        await page
            .getByPlaceholder(/ouvrir un compte bancaire local/i)
            .fill('Tâche E2E test');
        await page.getByRole('button', { name: /^ajouter$/i }).click();

        await expect(page.getByText('Tâche E2E test')).toBeVisible();
    });
});
