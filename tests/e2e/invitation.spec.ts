import { test, expect, type Route } from '@playwright/test';
import { USER, loginAs, mockApi } from './fixtures';

const SCHOOL = { id: 'o1', name: 'École Démo', slug: 'ecole-demo', logoUrl: null, branding: { primary_color: '#33518A' } };
const TOKEN = 'invitation-token';

const ok = (route: Route, data: unknown) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data, message: 'OK' }) });

test.describe('Invitation → consent → enrollment', () => {
    test('a signed-in student accepts the invitation of their school', async ({ page }) => {
        await loginAs(page);
        await mockApi(page);
        let enrolled = false;
        await page.route('**/api/v1/users/me', (route) =>
            ok(route, { ...USER, organization: enrolled ? SCHOOL : null, premium: { active: enrolled, source: enrolled ? 'organization' : null, until: null } }),
        );
        await page.route(`**/api/v1/invitations/${TOKEN}**`, async (route) => {
            if (route.request().method() === 'POST') {
                enrolled = true;
                return ok(route, { kind: 'student', organization: SCHOOL, auth: null });
            }
            return ok(route, {
                organization: SCHOOL,
                kind: 'student',
                orgRole: null,
                email: USER.email,
                status: 'pending',
                expiresAt: '2030-01-01T00:00:00Z',
                sharedWithSchool: ['profile', 'mobilities', 'progress', 'document_status'],
                neverShared: ['document_content'],
            });
        });

        await page.goto(`/invitations/${TOKEN}`);

        await expect(page.getByText('École Démo pourra voir :')).toBeVisible();
        await expect(page.getByText(/Le contenu de tes documents/)).toBeVisible();
        await page.getByRole('button', { name: /j'accepte et je rejoins école démo/i }).click();

        await expect(page).toHaveURL(/\/profile$/);
        await expect(page.getByRole('heading', { name: 'Mon établissement' })).toBeVisible();
        await expect(page.getByText('Rattaché·e')).toBeVisible();
    });

    test('an anonymous visitor is asked to sign in, then comes back', async ({ page }) => {
        await mockApi(page);
        await page.route(`**/api/v1/invitations/${TOKEN}`, (route) =>
            ok(route, {
                organization: SCHOOL,
                kind: 'student',
                orgRole: null,
                email: USER.email,
                status: 'pending',
                expiresAt: '2030-01-01T00:00:00Z',
                sharedWithSchool: ['profile'],
                neverShared: ['document_content'],
            }),
        );

        await page.goto(`/invitations/${TOKEN}`);
        await page.getByRole('link', { name: 'Se connecter' }).click();

        await expect(page).toHaveURL(new RegExp(`/login\\?redirect=%2Finvitations%2F${TOKEN}`));
    });
});
