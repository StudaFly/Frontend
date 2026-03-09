import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../src/App";

describe("App", () => {
  it("renders without crashing and shows the Navbar logo", () => {
    // App uses RouterProvider internally — no wrapper needed
    render(<App />);
    expect(screen.getByAltText("StudaFly")).toBeInTheDocument();
  });

  it("renders navigation links on mount", () => {
    render(<App />);
    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Destinations")).toBeInTheDocument();
    expect(screen.getByText("À propos")).toBeInTheDocument();
  });
});
