import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import DataGridStyles from "./DataGridStyles";
import {
  color_danger,
  color_dv_primary,
  color_dv_primary_hover,
  color_dv_surface,
  color_dv_border,
  color_dv_control_border,
  color_dv_text,
  color_dv_text_muted,
  color_dv_header_bg,
  color_dv_banner_bg,
  color_dv_banner_text,
  color_dv_banner_title,
  color_dv_row_hover,
  color_dv_chip_bg,
  color_dv_chip_hover,
  color_dv_page,
} from "../../constants/colors";

/* Returns the declarations of the first rule whose selector list matches `selector` exactly. */
const ruleFor = (css: string, selector: string): string => {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, " ");
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(withoutComments))) {
    const selectors = m[1].split(",").map((s) => s.trim());
    if (selectors.includes(selector)) return m[2].replace(/\s+/g, " ").trim();
  }
  throw new Error(`No CSS rule found for selector "${selector}"`);
};

describe("DataGridStyles", () => {
  const renderComponent = () => render(<DataGridStyles />);

  const getCss = (container: HTMLElement) =>
    (container.querySelector("style")?.textContent || "").replace(/\s+/g, " ");

  it("renders a style tag", () => {
    const { container } = renderComponent();

    const styleEl = container.querySelector("style");

    expect(styleEl).toBeInTheDocument();
    expect(styleEl?.textContent).toBeTruthy();
  });

  it("styles the AG Grid header, selected row and hovered row with the design colours", () => {
    const css = getCss(renderComponent().container);

    const header = ruleFor(css, ".ag-theme-quartz .bold-header");
    expect(header).toContain(`background-color: ${color_dv_header_bg} !important;`);
    expect(header).toContain(`color: ${color_dv_text_muted} !important;`);
    expect(header).toContain("font-size: 14px !important;");
    expect(header).toContain("font-weight: 500 !important;");

    const selected = ruleFor(css, ".ag-theme-quartz .ag-row-selected");
    expect(selected).toContain(`background-color: ${color_dv_banner_bg} !important;`);

    const hover = ruleFor(css, ".ag-theme-quartz .ag-row:hover");
    expect(hover).toContain(`background-color: ${color_dv_row_hover} !important;`);

    const selectedOverlay = ruleFor(css, ".ag-theme-quartz .ag-row-selected::before");
    expect(selectedOverlay).toContain("background: transparent !important;");

    const cell = ruleFor(css, ".ag-theme-quartz .ag-cell");
    expect(cell).toContain("font-weight: 400;");
    expect(cell).toContain(`color: ${color_dv_text};`);
  });

  it("keeps paging hidden and pinned columns sized to their content", () => {
    const css = getCss(renderComponent().container);

    expect(ruleFor(css, ".ag-theme-quartz .ag-paging-panel")).toContain("display: none !important;");
    expect(ruleFor(css, ".ag-pinned-left-cols-container")).toContain("width: max-content !important;");
    expect(ruleFor(css, ".ag-pinned-left-header")).toContain("width: max-content !important;");
  });

  it("contains responsive mobile media query rules", () => {
    const css = getCss(renderComponent().container);

    expect(css).toContain("@media (max-width: 900px)");
    expect(css).toContain(".mobile-filter-button { display: inline-flex !important;");
    expect(css).toContain(".left-panel { display: none !important; }");
    expect(css).toContain("@media (max-width: 600px)");
    expect(css).toMatch(/@media \(max-width: 600px\) \{ \.dv-shell \{ padding: 12px !important;/);
  });

  it("styles the page shell and the toolbar card", () => {
    const css = getCss(renderComponent().container);

    const page = ruleFor(css, ".dv-page");
    expect(page).toContain(`background: ${color_dv_page};`);

    const shell = ruleFor(css, ".dv-shell");
    expect(shell).toContain("max-width: 1360px;");
    expect(shell).toContain("margin: 0 auto;");

    const toolbar = ruleFor(css, ".top-controls-bar");
    expect(toolbar).toContain("flex-wrap: wrap;");
    expect(toolbar).toContain(`background: ${color_dv_surface};`);
    expect(toolbar).toContain(`border: 1px solid ${color_dv_border};`);
    expect(toolbar).toContain("border-radius: 12px;");
  });

  it("styles outline and primary buttons with 44px touch targets", () => {
    const css = getCss(renderComponent().container);

    const btn = ruleFor(css, ".dv-btn");
    expect(btn).toContain("height: 44px;");
    expect(btn).toContain(`border: 1px solid ${color_dv_control_border};`);
    expect(btn).toContain(`background: ${color_dv_surface};`);
    expect(btn).toContain(`color: ${color_dv_text};`);

    const primary = ruleFor(css, ".dv-btn-primary");
    expect(primary).toContain(`background: ${color_dv_primary};`);
    expect(primary).toContain("color: #FFFFFF;");

    expect(ruleFor(css, ".dv-btn-primary:hover")).toContain(`background: ${color_dv_primary_hover};`);

    const soft = ruleFor(css, ".dv-btn-soft");
    expect(soft).toContain(`background: ${color_dv_chip_bg};`);
    expect(soft).toContain(`color: ${color_dv_primary};`);
  });

  it("gives every interactive control a visible 3px navy focus ring", () => {
    const css = getCss(renderComponent().container);

    [".dv-btn:focus-visible", ".dv-icon-btn:focus-visible", ".dv-row-btn:focus-visible", ".dv-chip:focus-visible", ".cf-link:focus-visible", ".cf-row:focus-visible"].forEach(
      (selector) => {
        expect(ruleFor(css, selector)).toContain(`outline: 3px solid ${color_dv_primary};`);
      }
    );
  });

  it("styles the search field, its icon buttons, and the recording state", () => {
    const css = getCss(renderComponent().container);

    const search = ruleFor(css, ".dv-search");
    expect(search).toContain("height: 44px;");
    expect(search).toContain(`border: 1px solid ${color_dv_control_border};`);

    expect(ruleFor(css, ".dv-search:focus-within")).toContain(`border-color: ${color_dv_primary};`);
    expect(ruleFor(css, ".dv-search-input")).toContain("font-size: 16px;");
    expect(ruleFor(css, ".dv-icon-btn:disabled")).toContain("opacity: 0.4;");
    expect(ruleFor(css, ".dv-icon-btn-recording")).toContain(`color: ${color_danger};`);
    expect(ruleFor(css, ".dv-nia-badge")).toContain(`background: ${color_danger};`);
  });

  it("styles the welcome note beside the filter buttons", () => {
    const css = getCss(renderComponent().container);

    expect(ruleFor(css, ".community-action-bar")).toContain("flex-wrap: wrap;");

    const msg = ruleFor(css, ".community-action-msg");
    expect(msg).toContain(`background: ${color_dv_banner_bg};`);
    expect(msg).toContain(`color: ${color_dv_banner_text};`);
    expect(msg).toContain("min-height: 44px;");

    const greeting = ruleFor(css, ".community-action-msg-greeting");
    expect(greeting).toContain("font-family: 'Lora', Georgia, serif;");
    expect(greeting).toContain(`color: ${color_dv_banner_title};`);
  });

  it("styles the row action buttons and the soft View chips", () => {
    const css = getCss(renderComponent().container);

    const rowBtn = ruleFor(css, ".dv-row-btn");
    expect(rowBtn).toContain("height: 40px;");
    expect(rowBtn).toContain(`background: ${color_dv_primary};`);
    expect(rowBtn).toContain("color: #FFFFFF;");
    expect(ruleFor(css, ".dv-row-btn:hover")).toContain(`background: ${color_dv_primary_hover};`);

    const chip = ruleFor(css, ".dv-chip");
    expect(chip).toContain(`background: ${color_dv_chip_bg};`);
    expect(chip).toContain(`color: ${color_dv_primary};`);
    expect(ruleFor(css, ".dv-chip:hover")).toContain(`background: ${color_dv_chip_hover};`);
  });

  it("styles the page title and source pills used by files without the community filter", () => {
    const css = getCss(renderComponent().container);

    expect(ruleFor(css, ".dv-page-title h1")).toContain("font-size: 24px;");
    expect(ruleFor(css, ".dv-page-title p")).toContain(`color: ${color_dv_text_muted};`);

    const pill = ruleFor(css, ".dv-source-value");
    expect(pill).toContain("border-radius: 999px;");
    expect(pill).toContain("display: inline-flex;");

    const dot = ruleFor(css, ".dv-source-dot");
    expect(dot).toContain("width: 8px;");
    expect(dot).toContain("border-radius: 50%;");
  });

  it("contains AG Grid header overflow handling rules", () => {
    const css = getCss(renderComponent().container);

    const label = ruleFor(css, ".ag-header-cell-label");
    expect(label).toContain("width: 100%;");
    expect(label).toContain("overflow: hidden;");

    const text = ruleFor(css, ".ag-header-cell-text");
    expect(text).toContain("width: 100%;");
    expect(text).toContain("white-space: nowrap;");
    expect(text).toContain("overflow: hidden;");

    const wrapper = ruleFor(css, ".ag-header-cell-comp-wrapper");
    expect(wrapper).toContain("width: 100%;");
    expect(wrapper).toContain("overflow: hidden;");
  });
});
