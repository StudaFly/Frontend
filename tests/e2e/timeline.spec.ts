import { test, expect } from '@playwright/test';
import { loginAs, mockApi } from './fixtures';

test.describe('Timeline', () => {
    test.beforeEach(async ({ page }) => {
        await loginAs(page);
        await mockApi(page);
    });

    test('groups the steps by period before departure', async ({ page }) => {
        await page.goto('/timeline');

        await expect(page.getByText('5 étapes', { exact: false }).first()).toBeVisible();
        await expect(page.getByText("Après l'arrivée")).toBeVisible();
    });

    test('expands every period', async ({ page }) => {
        await page.goto('/timeline');

        await page.getByRole('button', { name: /tout développer/i }).click();

        await expect(page.getByText('Souscrire une assurance santé')).toBeVisible();
        await expect(page.getByText("Accomplir les formalités d'arrivée")).toBeVisible();
    });
});
