import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RatingCircle from "../components/shared/RatingCircle";

describe("RatingCircle", () => {
  it("affiche la note passee en prop", () => {
    render(<RatingCircle rating={8.5} />);
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  it('affiche "-" si aucune note n\'est passee', () => {
    render(<RatingCircle rating={null} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("affiche le cercle SVG", () => {
    const { container } = render(<RatingCircle rating={7} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });
});
