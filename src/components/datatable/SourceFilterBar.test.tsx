// SourceFilterBar.test.tsx
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("./sourceColors", () => {
  const actual = jest.requireActual("./sourceColors");
  return {
    __esModule: true,
    ...actual,
    SOURCE_COLORS: {
      SourceA: "#123456",
      SourceB: "#654321",
      "NCTR SOURCE": "#FFC000",
      "CIRNAC SOURCE": "#9F5FCF",
    },
  };
});

import SourceFilterBar from "./SourceFilterBar";
import { color_dv_primary, color_dv_surface } from "../../constants/colors";

describe("SourceFilterBar", () => {
  const mockSetSourceFilter = jest.fn();
  const sources = ["SourceA", "SourceB"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when availableSources is empty", () => {
    const { container } = render(
      <SourceFilterBar availableSources={[]} sourceFilter={null} setSourceFilter={mockSetSourceFilter} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders label, All sources button, and source buttons", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter={null} setSourceFilter={mockSetSourceFilter} />
    );

    expect(screen.getByText("Filter by source")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All sources" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SourceA" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SourceB" })).toBeInTheDocument();
  });

  it("calls setSourceFilter(null) when All sources is clicked", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter="SourceA" setSourceFilter={mockSetSourceFilter} />
    );

    fireEvent.click(screen.getByRole("button", { name: "All sources" }));

    expect(mockSetSourceFilter).toHaveBeenCalledWith(null);
  });

  it("calls setSourceFilter(source) when a source button is clicked", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter={null} setSourceFilter={mockSetSourceFilter} />
    );

    fireEvent.click(screen.getByRole("button", { name: "SourceB" }));

    expect(mockSetSourceFilter).toHaveBeenCalledWith("SourceB");
  });

  it("marks All sources as pressed and navy when no source is selected", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter={null} setSourceFilter={mockSetSourceFilter} />
    );

    const allButton = screen.getByRole("button", { name: "All sources" });

    expect(allButton).toHaveAttribute("aria-pressed", "true");
    expect(allButton).toHaveStyle(`background: ${color_dv_primary}`);
    expect(screen.getByRole("button", { name: "SourceA" })).toHaveAttribute("aria-pressed", "false");
  });

  it("marks the active source as pressed and navy, and All sources as unpressed", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter="SourceA" setSourceFilter={mockSetSourceFilter} />
    );

    const allButton = screen.getByRole("button", { name: "All sources" });
    const sourceAButton = screen.getByRole("button", { name: "SourceA" });

    expect(allButton).toHaveAttribute("aria-pressed", "false");
    expect(allButton).toHaveStyle(`background: ${color_dv_surface}`);
    expect(sourceAButton).toHaveAttribute("aria-pressed", "true");
    expect(sourceAButton).toHaveStyle(`background: ${color_dv_primary}`);
  });

  it("shows short labels but keeps the full source name as the accessible name", () => {
    render(
      <SourceFilterBar
        availableSources={["NCTR SOURCE", "CIRNAC SOURCE", "SourceA"]}
        sourceFilter={null}
        setSourceFilter={mockSetSourceFilter}
      />
    );

    const nctr = screen.getByRole("button", { name: "NCTR SOURCE" });
    expect(nctr).toHaveTextContent("NCTR");
    expect(screen.getByRole("button", { name: "CIRNAC SOURCE" })).toHaveTextContent("CIRNAC");
    expect(screen.getByRole("button", { name: "SourceA" })).toBeInTheDocument();
  });

  it("shows the acronym and expanded source value in a tooltip", async () => {
    render(
      <SourceFilterBar availableSources={["NCTR SOURCE"]} sourceFilter={null} setSourceFilter={mockSetSourceFilter} />
    );

    fireEvent.mouseOver(screen.getByRole("button", { name: "NCTR SOURCE" }));

    const tooltip = await screen.findByRole("tooltip");
    expect(within(tooltip).getByText("NCTR")).toBeInTheDocument();
    expect(
      within(tooltip).getByText("National Center for Truth and Reconciliation Source")
    ).toBeInTheDocument();
  });
});
