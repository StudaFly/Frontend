import type { Page, Route } from '@playwright/test';
import { REFERENCE, STATS } from '../fixtures/reference';

/** Mocked backend for the E2E suite (no real API needed, runs in CI). */

const inDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const USER = {
    id: 'u1',
    email: 'alice@test.com',
    name: 'Alice Test',
    role: 'student',
    institutionId: null,
    isPremium: false,
    emailVerified: true,
    oauthProvider: null,
    avatarEmoji: '🎓',
    phone: null,
    enableNotifications: true,
    createdAt: '2026-09-01T00:00:00Z',
};

export const DESTINATION = { id: 'd1', city: 'Barcelone', country: 'Espagne', imageUrl: null, summary: 'Soleil et culture catalane.' };

export const MOBILITY = {
    id: 'm1',
    userId: 'u1',
    destinationId: 'd1',
    type: 'erasmus',
    departureDate: inDays(120),
    returnDate: null,
    status: 'preparing',
    school: null,
    createdAt: '2026-09-01T00:00:00Z',
    daysUntilDeparture: 120,
    stayMonths: null,
};

export function makeTasks() {
    return [
        { id: 't1', mobilityId: 'm1', title: 'Vérifier la validité du passeport', description: 'Valide toute la durée du séjour.', category: 'admin', deadline: inDays(10), daysUntilDeadline: 10, isCompleted: false, priority: 1 },
        { id: 't2', mobilityId: 'm1', title: 'Trouver un logement', description: 'Résidence ou colocation.', category: 'housing', deadline: inDays(30), daysUntilDeadline: 30, isCompleted: false, priority: 1 },
        { id: 't3', mobilityId: 'm1', title: 'Établir un budget prévisionnel', description: null, category: 'finance', deadline: inDays(45), daysUntilDeadline: 45, isCompleted: true, priority: 2 },
        { id: 't4', mobilityId: 'm1', title: 'Souscrire une assurance santé', description: null, category: 'health', deadline: inDays(75), daysUntilDeadline: 75, isCompleted: false, priority: 1 },
        { id: 't5', mobilityId: 'm1', title: 'Accomplir les formalités d\'arrivée', description: null, category: 'admin', deadline: inDays(127), daysUntilDeadline: 127, isCompleted: false, priority: 1 },
    ];
}

interface MockOptions {
    mobilities?: unknown[];
}

const ok = (route: Route, data: unknown, status = 200) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ data, message: 'OK' }) });

/** Routes every /api/v1 call to in-memory data; returns the recorded requests. */
export async function mockApi(page: Page, { mobilities = [MOBILITY] }: MockOptions = {}) {
    const tasks = makeTasks();
    const calls: string[] = [];

    await page.route('**/api/v1/**', async (route) => {
        const request = route.request();
        const path = new URL(request.url()).pathname.replace('/api/v1', '');
        const method = request.method();
        calls.push(`${method} ${path}`);

        if (method === 'GET' && path === '/health') return ok(route, { status: 'healthy' });
        if (method === 'GET' && path === '/reference') return ok(route, REFERENCE);
        if (method === 'GET' && path === '/stats') return ok(route, STATS);
        if (method === 'GET' && path === '/users/me') return ok(route, USER);
        if (method === 'GET' && /\/mobilities\/[^/]+\/progress$/.test(path)) {
            const done = tasks.filter((t) => t.isCompleted).length;
            const pending = tasks.filter((t) => !t.isCompleted && t.deadline);
            return ok(route, {
                mobilityId: 'm1',
                totalTasks: tasks.length,
                completedTasks: done,
                percent: Math.round((done * 100) / tasks.length),
                daysUntilDeparture: 120,
                overdueTasks: 0,
                byCategory: REFERENCE.taskCategories.map((c) => ({
                    category: c.key,
                    label: c.label,
                    done: tasks.filter((t) => t.category === c.key && t.isCompleted).length,
                    total: tasks.filter((t) => t.category === c.key).length,
                })).filter((c) => c.total > 0),
                nextTasks: pending.slice(0, 3),
            });
        }
        if (method === 'GET' && path === '/mobilities') return ok(route, mobilities);
        if (method === 'POST' && path === '/mobilities') return ok(route, { ...MOBILITY, ...request.postDataJSON() }, 201);
        if (method === 'GET' && path === '/destinations') return ok(route, [DESTINATION, { id: 'd6', city: 'Berlin', country: 'Allemagne' }]);
        if (method === 'GET' && path.startsWith('/destinations/') && path.endsWith('/budget')) {
            return ok(route, {
                destinationId: 'd1', city: 'Barcelone', country: 'Espagne', monthlyTotalMin: 900, monthlyTotalMax: 1300, currency: 'EUR',
                breakdown: [{ key: 'housing', label: 'Logement', amountMin: 500, amountMax: 850, currency: 'EUR' }], tips: [],
            });
        }
        if (method === 'GET' && path.startsWith('/destinations/')) return ok(route, { ...DESTINATION, facts: null, hasBudget: true, hasGuide: false });
        if (method === 'GET' && /\/mobilities\/[^/]+\/(tasks|timeline)$/.test(path)) return ok(route, tasks);
        const complete = path.match(/^\/tasks\/([^/]+)\/complete$/);
        if (method === 'PATCH' && complete) {
            const task = tasks.find((t) => t.id === complete[1])!;
            task.isCompleted = !task.isCompleted;
            return ok(route, task);
        }
        return route.fulfill({ status: 501, contentType: 'application/json', body: JSON.stringify({ error: { code: 'NOT_IMPLEMENTED', message: 'Not mocked' } }) });
    });

    return calls;
}

/** Simulates a stored session (tokens + cached user), revalidated by the mocked /users/me. */
export async function loginAs(page: Page) {
    await page.addInitScript(() => {
        localStorage.setItem('accessToken', 'e2e-access-token');
        localStorage.setItem('refreshToken', 'e2e-refresh-token');
        localStorage.setItem(
            'studafly_auth_user',
            JSON.stringify({ id: 'u1', firstName: 'Alice', lastName: 'Test', email: 'alice@test.com', avatar: '🎓', avatarType: 'emoji' }),
        );
    });
}
