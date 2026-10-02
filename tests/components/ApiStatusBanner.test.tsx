import { screen } from "@testing-library/react";
import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it, vi } from "vitest";
import { ApiStatusBanner } from "@/components/shared/ApiStatusBanner";
import { getHealth } from "@/core/api/reference";
import { renderWithProviders } from "../utils/providers";

function healthError(status?: number, details?: Record<string, string>) {
    const config = { headers: new AxiosHeaders() };
    const response = status
        ? { status, statusText: "", headers: {}, config, data: { error: { code: "SERVICE_UNAVAILABLE", details } } }
        : undefined;
    return new AxiosError("fail", "ERR", config, null, response);
}

describe("ApiStatusBanner", () => {
    it("stays hidden when the API and its services are up", async () => {
        renderWithProviders(<ApiStatusBanner />);
        await new Promise((r) => setTimeout(r, 0));
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("says the API is unreachable when there is no response", async () => {
        vi.mocked(getHealth).mockRejectedValueOnce(healthError());
        renderWithProviders(<ApiStatusBanner />);
        expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de joindre l'API");
    });

    it("names the unreachable service when the API answers 503", async () => {
        vi.mocked(getHealth).mockRejectedValueOnce(healthError(503, { database: "unreachable", cache: "ok" }));
        renderWithProviders(<ApiStatusBanner />);
        const alert = await screen.findByRole("alert");
        expect(alert).toHaveTextContent("la base de données (PostgreSQL) est injoignable");
        expect(alert).toHaveTextContent("make services");
    });
});
