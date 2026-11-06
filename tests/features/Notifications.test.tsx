/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppNotification } from "@/core/api/notifications";
import { NotificationBell } from "@/features/notifications";
import NotificationsPage from "@/features/notifications/pages/NotificationsPage";
import {
    formatBadge,
    formatRelativeTime,
    notificationLink,
} from "@/features/notifications/utils/notificationUtils";

vi.mock("@/core/api/notifications", () => ({
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markNotificationRead: vi.fn(),
    markAllNotificationsRead: vi.fn(),
    deleteNotification: vi.fn(),
}));

import {
    deleteNotification,
    getNotifications,
    getUnreadCount,
    markAllNotificationsRead,
    markNotificationRead,
} from "@/core/api/notifications";

const now = new Date().toISOString();

function notification(fields: Partial<AppNotification>): AppNotification {
    return {
        id: "n1",
        type: "task_due_soon",
        title: "Échéance proche",
        body: "« Learning agreement » est à faire dans 5 jours.",
        data: { taskId: "t1", mobilityId: "m1" },
        isRead: false,
        readAt: null,
        createdAt: now,
        ...fields,
    };
}

const ITEMS = [
    notification({ id: "n1" }),
    notification({ id: "n2", type: "invitation_accepted", title: "Invitation acceptée", body: "Lucas a rejoint École Démo.", isRead: true }),
];

const ok = (data: unknown) => Promise.resolve({ data: { data, message: "OK" } } as any);

function renderAt(ui: ReactElement, path = "/") {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route path="/" element={ui} />
                    <Route path="/checklist" element={<p>checklist page</p>} />
                    <Route path="/notifications" element={<p>notifications page</p>} />
                    <Route path="/org/notifications" element={<p>org notifications page</p>} />
                    <Route path="/org/invitations" element={<p>org invitations page</p>} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>,
    );
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getNotifications).mockImplementation((params = {}) =>
        ok({
            items: params.unreadOnly ? ITEMS.filter((n) => !n.isRead) : ITEMS,
            unreadCount: 1,
        }),
    );
    vi.mocked(getUnreadCount).mockImplementation(() => ok({ count: 1 }));
    vi.mocked(markNotificationRead).mockImplementation(() => ok(ITEMS[0]));
    vi.mocked(markAllNotificationsRead).mockImplementation(() => ok({ updated: 1 }));
    vi.mocked(deleteNotification).mockImplementation(() => Promise.resolve({} as any));
});

describe("notification helpers", () => {
    it("caps the badge at 9+", () => {
        expect(formatBadge(3)).toBe("3");
        expect(formatBadge(12)).toBe("9+");
    });

    it("links reminders to the checklist and accepted invitations to the school space", () => {
        expect(notificationLink(notification({ type: "task_overdue" }))).toBe("/checklist");
        expect(notificationLink(notification({ type: "invitation_accepted" }))).toBe("/org/invitations");
        expect(notificationLink(notification({ type: "organization_invitation" }))).toBeNull();
        expect(notificationLink(notification({ type: "something_new" }))).toBeNull();
    });

    it("formats recent dates relatively", () => {
        const ref = new Date("2026-11-06T12:00:00Z");
        expect(formatRelativeTime("2026-11-06T11:55:00Z", "en", ref)).toBe("5 min. ago");
        expect(formatRelativeTime("2026-11-06T09:00:00Z", "en", ref)).toBe("3 hr. ago");
    });
});

describe("NotificationBell", () => {
    it("shows the unread badge", async () => {
        renderAt(<NotificationBell />);
        expect(await screen.findByTestId("notification-badge")).toHaveTextContent("1");
    });

    it("opens the latest notifications and marks all as read", async () => {
        const user = userEvent.setup({ delay: null });
        renderAt(<NotificationBell />);
        await user.click(await screen.findByRole("button", { name: /notifications/i }));

        const panel = screen.getByRole("dialog");
        expect(await within(panel).findByText("Échéance proche")).toBeInTheDocument();
        expect(within(panel).getByText("Invitation acceptée")).toBeInTheDocument();
        expect(getNotifications).toHaveBeenCalledWith({ unreadOnly: false, limit: 5 });

        await user.click(within(panel).getByRole("button", { name: "Tout marquer comme lu" }));
        expect(markAllNotificationsRead).toHaveBeenCalledTimes(1);
    });

    it("clicking a reminder marks it read and opens the checklist", async () => {
        const user = userEvent.setup({ delay: null });
        renderAt(<NotificationBell />);
        await user.click(await screen.findByRole("button", { name: /notifications/i }));
        await user.click(await screen.findByText("Échéance proche"));

        expect(markNotificationRead).toHaveBeenCalledWith("n1");
        expect(await screen.findByText("checklist page")).toBeInTheDocument();
    });

    it("does not mark an already read notification again", async () => {
        const user = userEvent.setup({ delay: null });
        renderAt(<NotificationBell />);
        await user.click(await screen.findByRole("button", { name: /notifications/i }));
        await user.click(await screen.findByText("Invitation acceptée"));

        expect(markNotificationRead).not.toHaveBeenCalled();
        expect(await screen.findByText("org invitations page")).toBeInTheDocument();
    });

    it("links to the school staff page when used in the school space", async () => {
        const user = userEvent.setup({ delay: null });
        renderAt(<NotificationBell allPath="/org/notifications" />);
        await user.click(await screen.findByRole("button", { name: /notifications/i }));
        await user.click(screen.getByText("Voir toutes les notifications"));

        expect(await screen.findByText("org notifications page")).toBeInTheDocument();
    });

    it("links to the full page", async () => {
        const user = userEvent.setup({ delay: null });
        renderAt(<NotificationBell />);
        await user.click(await screen.findByRole("button", { name: /notifications/i }));
        await user.click(screen.getByText("Voir toutes les notifications"));

        expect(await screen.findByText("notifications page")).toBeInTheDocument();
    });
});

describe("NotificationsPage", () => {
    it("lists notifications and filters the unread ones", async () => {
        const user = userEvent.setup({ delay: null });
        renderAt(<NotificationsPage />);

        expect(await screen.findByText("Invitation acceptée")).toBeInTheDocument();
        await user.click(screen.getByRole("tab", { name: "Non lues (1)" }));

        await waitFor(() => expect(screen.queryByText("Invitation acceptée")).not.toBeInTheDocument());
        expect(screen.getByText("Échéance proche")).toBeInTheDocument();
        expect(getNotifications).toHaveBeenLastCalledWith({ unreadOnly: true, limit: 100 });
    });

    it("deletes a notification", async () => {
        const user = userEvent.setup({ delay: null });
        renderAt(<NotificationsPage />);
        await screen.findByText("Invitation acceptée");

        await user.click(screen.getAllByRole("button", { name: "Supprimer" })[1]);
        expect(deleteNotification).toHaveBeenCalledWith("n2");
    });

    it("shows the empty state", async () => {
        vi.mocked(getNotifications).mockImplementation(() => ok({ items: [], unreadCount: 0 }));
        renderAt(<NotificationsPage />);

        expect(await screen.findByText("Aucune notification pour l'instant.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Tout marquer comme lu" })).toBeDisabled();
    });
});
