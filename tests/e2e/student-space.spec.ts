import { test, expect } from '@playwright/test';
import { loginAs, mockApi } from './fixtures';

test.describe('Student space', () => {
    test.beforeEach(async ({ page }) => {
        await loginAs(page);
    });

    test('dashboard shows progress and next deadlines', async ({ page }) => {
        await mockApi(page);
        await page.goto('/dashboard');

        await expect(page.getByRole('heading', { name: 'Alice !' })).toBeVisible();
        await expect(page.getByText('Barcelone · Erasmus')).toBeVisible();
        await expect(page.getByText('20%')).toBeVisible();
        await expect(page.getByText('Vérifier la validité du passeport')).toBeVisible();
    });

    test('creates a mobility in 4 steps', async ({ page }) => {
        const calls = await mockApi(page, { mobilities: [] });
        await page.goto('/mobility/new');

        await page.getByRole('radio', { name: /Stage/ }).click();
        await page.getByRole('button', { name: /continuer/i }).click();
        await page.getByRole('button', { name: /Berlin/ }).click();
        await page.getByRole('button', { name: /continuer/i }).click();
        await page.getByLabel('Date de départ').fill('2027-02-01');
        await page.getByRole('button', { name: /continuer/i }).click();
        await page.getByRole('button', { name: /générer mon parcours/i }).click();

        await expect(page).toHaveURL(/\/dashboard$/);
        expect(calls).toContain('POST /mobilities');
    });

    test('budget page shows the monthly estimate', async ({ page }) => {
        await mockApi(page);
        await page.goto('/budget');

        await expect(page.getByText('Budget mensuel estimé')).toBeVisible();
        await expect(page.getByText('Logement')).toBeVisible();
    });
});
