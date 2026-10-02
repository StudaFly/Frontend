import { test, expect } from '@playwright/test';
import { loginAs, mockApi } from './fixtures';

test.describe('Checklist', () => {
    test.beforeEach(async ({ page }) => {
        await loginAs(page);
    });

    test('shows the tasks of the mobility with the completion counter', async ({ page }) => {
        await mockApi(page);
        await page.goto('/checklist');

        await expect(page.getByText('Vérifier la validité du passeport')).toBeVisible();
        await expect(page.getByText('Trouver un logement')).toBeVisible();
        await expect(page.getByText(/1\/5/)).toBeVisible();
    });

    test('filters by category', async ({ page }) => {
        await mockApi(page);
        await page.goto('/checklist');

        await page.getByRole('button', { name: /Logement/ }).first().click();

        await expect(page.getByText('Trouver un logement')).toBeVisible();
        await expect(page.getByText('Vérifier la validité du passeport')).toBeHidden();
    });

    test('marks a task as done through the API', async ({ page }) => {
        const calls = await mockApi(page);
        await page.goto('/checklist');

        await page.getByRole('button', { name: 'Marquer comme complété', exact: true }).first().click();

        await expect(page.getByText(/2\/5/)).toBeVisible();
        expect(calls).toContain('PATCH /tasks/t1/complete');
    });

    test('invites to create a mobility when there is none', async ({ page }) => {
        await mockApi(page, { mobilities: [] });
        await page.goto('/checklist');

        await expect(page.getByRole('link', { name: 'Créer ma mobilité' })).toHaveAttribute('href', '/mobility/new');
    });
});

test('redirects to the login page without a session', async ({ page }) => {
    await mockApi(page);
    await page.goto('/checklist');
    await expect(page).toHaveURL(/\/login$/);
});
