import "@testing-library/jest-dom";
import "@/core/i18n"; // Initialize i18n so useTranslation() resolves properly in tests
import { vi } from "vitest";
import { REFERENCE, STATS } from "./fixtures/reference";

// Backend reference endpoints, answered like the real API for every test.
// A test can still override them with its own vi.mock("@/core/api/reference").
vi.mock("@/core/api/reference", () => ({
    getReference: vi.fn().mockResolvedValue({ data: { data: REFERENCE, message: "OK" } }),
    getStats: vi.fn().mockResolvedValue({ data: { data: STATS, message: "OK" } }),
    getHealth: vi.fn().mockResolvedValue({ data: { data: { status: "healthy" }, message: "OK" } }),
}));

// Node >= 25 ships an experimental global `localStorage` that shadows jsdom's and has
// no methods unless `--localstorage-file` is set. Install an in-memory Storage instead.
class MemoryStorage implements Storage {
    private items = new Map<string, string>();
    get length() {
        return this.items.size;
    }
    clear() {
        this.items.clear();
    }
    getItem(key: string) {
        return this.items.get(key) ?? null;
    }
    key(index: number) {
        return [...this.items.keys()][index] ?? null;
    }
    removeItem(key: string) {
        this.items.delete(key);
    }
    setItem(key: string, value: string) {
        this.items.set(key, String(value));
    }
}

for (const name of ["localStorage", "sessionStorage"] as const) {
    if (typeof globalThis[name]?.clear !== "function") {
        Object.defineProperty(globalThis, name, { value: new MemoryStorage(), configurable: true });
    }
}
