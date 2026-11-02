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
import { SOURCE_TINTS } from "./sourceColors";
import {
  color_dv_control_border,
  color_dv_primary,
  color_dv_surface,
  color_dv_text,
} from "../../constants/colors";

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

    expect(container.firstChild).toBeNull();
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

  it("lays the filter pills out in a wrapping row (no horizontal scrolling)", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter={null} setSourceFilter={mockSetSourceFilter} />
    );

    const rail = screen.getByTestId("source-filter-scroll");

    expect(rail).toHaveStyle("display: flex");
    expect(rail).toHaveStyle("flex-wrap: wrap");
    expect(rail).toHaveStyle("align-items: center");
    expect(rail).toHaveStyle("gap: 8px");
    expect(rail).not.toHaveStyle("overflow-x: auto");
  });

  it("calls setSourceFilter(null) when All sources is clicked", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter="SourceA" setSourceFilter={mockSetSourceFilter} />
    );

    fireEvent.click(screen.getByRole("button", { name: "All sources" }));

    expect(mockSetSourceFilter).toHaveBeenCalledTimes(1);
    expect(mockSetSourceFilter).toHaveBeenCalledWith(null);
  });

  it("calls setSourceFilter(source) when a source button is clicked", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter={null} setSourceFilter={mockSetSourceFilter} />
    );

    fireEvent.click(screen.getByRole("button", { name: "SourceB" }));

    expect(mockSetSourceFilter).toHaveBeenCalledTimes(1);
    expect(mockSetSourceFilter).toHaveBeenCalledWith("SourceB");
  });

  it("applies selected styles to All sources when sourceFilter is null", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter={null} setSourceFilter={mockSetSourceFilter} />
    );

    const allButton = screen.getByRole("button", { name: "All sources" });

    expect(allButton).toHaveAttribute("aria-pressed", "true");
    expect(allButton).toHaveStyle(`background: ${color_dv_primary}`);
    expect(allButton).toHaveStyle("color: #FFFFFF");
    expect(allButton).toHaveStyle(`border: 1px solid ${color_dv_primary}`);
  });

  it("applies unselected styles to All sources when a source is selected", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter="SourceA" setSourceFilter={mockSetSourceFilter} />
    );

    const allButton = screen.getByRole("button", { name: "All sources" });

    expect(allButton).toHaveAttribute("aria-pressed", "false");
    expect(allButton).toHaveStyle(`background: ${color_dv_surface}`);
    expect(allButton).toHaveStyle(`color: ${color_dv_text}`);
    expect(allButton).toHaveStyle(`border: 1px solid ${color_dv_control_border}`);
  });

  it("applies selected styles to the active source button", () => {
    render(
      <SourceFilterBar availableSources={sources} sourceFilter="SourceA" setSourceFilter={mockSetSourceFilter} />
    );

    const sourceAButton = screen.getByRole("button", { name: "SourceA" });

    expect(sourceAButton).toHaveAttribute("aria-pressed", "true");
    expect(sourceAButton).toHaveStyle(`background: ${color_dv_primary}`);
    expect(sourceAButton).toHaveStyle("color: #FFFFFF");
    expect(sourceAButton).toHaveStyle(`border: 1px solid ${color_dv_primary}`);
    expect(within(sourceAButton).getByTestId("source-dot")).toHaveStyle("background: #FFFFFF");
  });

  it("applies the source's tinted pill styles to inactive source buttons", () => {
    const tint = SOURCE_TINTS["NCTR SOURCE"];

    render(
      <SourceFilterBar
        availableSources={["NCTR SOURCE", "SourceA"]}
        sourceFilter="SourceA"
        setSourceFilter={mockSetSourceFilter}
      />
    );

    const nctrButton = screen.getByRole("button", { name: "NCTR SOURCE" });

    expect(nctrButton).toHaveAttribute("aria-pressed", "false");
    expect(nctrButton).toHaveStyle(`background: ${tint.bg}`);
    expect(nctrButton).toHaveStyle(`color: ${tint.fg}`);
    expect(nctrButton).toHaveStyle("border: 1px solid transparent");
    expect(within(nctrButton).getByTestId("source-dot")).toHaveStyle(`background: ${tint.dot}`);
  });

  it("shows short labels but keeps the full source name as the accessible name", () => {
    render(
      <SourceFilterBar
        availableSources={["NCTR SOURCE", "CIRNAC SOURCE", "SourceA"]}
        sourceFilter={null}
        setSourceFilter={mockSetSourceFilter}
      />
    );

    expect(screen.getByRole("button", { name: "NCTR SOURCE" })).toHaveTextContent(/^NCTR$/);
    expect(screen.getByRole("button", { name: "CIRNAC SOURCE" })).toHaveTextContent(/^CIRNAC$/);
    expect(screen.getByRole("button", { name: "SourceA" })).toHaveTextContent(/^SourceA$/);
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

  it("does not show a tooltip for sources without a known acronym", async () => {
    render(
      <SourceFilterBar availableSources={["SourceA"]} sourceFilter={null} setSourceFilter={mockSetSourceFilter} />
    );

    fireEvent.mouseOver(screen.getByRole("button", { name: "SourceA" }));

    await new Promise((r) => setTimeout(r, 150));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
