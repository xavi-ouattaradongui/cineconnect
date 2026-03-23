import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Film } from "lucide-react";
import Loader from "../components/shared/Loader";
import EmptyState from "../components/shared/EmptyState";

describe("Loader", () => {
  it("rend le spinner sans erreur", () => {
    const { container } = render(<Loader />);
    const spinner = container.firstChild;
    expect(spinner).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("affiche le titre et la description", () => {
    render(
      <EmptyState
        icon={Film}
        title="Aucun film"
        description="Votre liste est vide."
      />
    );
    expect(screen.getByText("Aucun film")).toBeInTheDocument();
    expect(screen.getByText("Votre liste est vide.")).toBeInTheDocument();
  });

  it("rend l'icone passee en prop", () => {
    const { container } = render(
      <EmptyState icon={Film} title="Test" description="Desc" />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
