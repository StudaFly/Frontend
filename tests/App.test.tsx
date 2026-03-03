import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("App", () => {
  it("renders the title", () => {
    render(<App />);
    expect(screen.getByText("StudaFly")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<App />);
    expect(
      screen.getByText("Prépare ton départ à l'étranger, sereinement.")
    ).toBeInTheDocument();
  });
});
