import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { getApiErrorCode, getApiErrorMessage } from "@/core/api/errors";

function axiosError(data?: unknown) {
    const config = { headers: new AxiosHeaders() };
    const response = data === undefined
        ? undefined
        : { data, status: 400, statusText: "", headers: {}, config };
    return new AxiosError("fail", "ERR", config, null, response);
}

describe("getApiErrorMessage", () => {
    it("reads the backend error envelope", () => {
        const err = axiosError({ error: { code: "CONFLICT", message: "Email déjà utilisé" } });
        expect(getApiErrorMessage(err)).toBe("Email déjà utilisé");
        expect(getApiErrorCode(err)).toBe("CONFLICT");
    });

    it("falls back when the body has no message", () => {
        expect(getApiErrorMessage(axiosError({}), "Oups")).toBe("Oups");
    });

    it("reports network errors", () => {
        expect(getApiErrorMessage(axiosError())).toMatch(/joindre le serveur/);
    });

    it("handles non-axios errors", () => {
        expect(getApiErrorMessage(new Error("x"), "Oups")).toBe("Oups");
    });
});
