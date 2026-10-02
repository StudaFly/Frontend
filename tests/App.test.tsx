import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../src/App";
import { renderWithProviders } from "./utils/providers";

describe("App", () => {
  it("renders without crashing and shows the Navbar logo", () => {
    // App uses RouterProvider internally — no wrapper needed
    renderWithProviders(<App />);
    expect(screen.getByAltText("StudaFly")).toBeInTheDocument();
  });

  it("renders navigation links on mount", () => {
    renderWithProviders(<App />);
    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Destinations")).toBeInTheDocument();
    expect(screen.getByText("À propos")).toBeInTheDocument();
  });
});
