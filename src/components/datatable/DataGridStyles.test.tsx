import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import DataGridStyles from "./DataGridStyles";
import {
  color_dv_primary,
  color_dv_primary_hover,
  color_dv_surface,
  color_dv_border,
  color_dv_control_border,
  color_dv_text_muted,
  color_dv_header_bg,
  color_dv_banner_bg,
  color_dv_banner_title,
  color_dv_row_hover,
  color_dv_chip_bg,
} from "../../constants/colors";

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

  it("contains AG Grid header and row styles with the correct theme colors", () => {
    const { container } = renderComponent();
    const css = getCss(container);

    expect(css).toContain(".ag-theme-quartz .bold-header");
    expect(css).toContain(`background-color: ${color_dv_header_bg} !important;`);
    expect(css).toContain(`color: ${color_dv_text_muted} !important;`);

    expect(css).toContain(".ag-theme-quartz .ag-row-selected");
    expect(css).toContain(`background-color: ${color_dv_banner_bg} !important;`);

    expect(css).toContain(".ag-theme-quartz .ag-row:hover");
    expect(css).toContain(`background-color: ${color_dv_row_hover} !important;`);
  });

  it("contains paging and pinned column layout rules", () => {
    const { container } = renderComponent();
    const css = getCss(container);

    expect(css).toContain(".ag-theme-quartz .ag-paging-panel");
    expect(css).toContain("display: none !important;");

    expect(css).toContain(".ag-pinned-left-cols-container, .ag-pinned-left-header");
    expect(css).toContain("width: max-content !important;");
  });

  it("contains responsive mobile media query rules", () => {
    const { container } = renderComponent();
    const css = getCss(container);

    expect(css).toContain("@media (max-width: 900px)");
    expect(css).toContain(".mobile-filter-button { display: inline-flex !important;");
    expect(css).toContain(".left-panel { display: none !important; }");
    expect(css).toContain("@media (max-width: 600px)");
  });

  it("contains toolbar, button and focus-visible accessibility styles", () => {
    const { container } = renderComponent();
    const css = getCss(container);

    expect(css).toContain(".top-controls-bar");
    expect(css).toContain(`background: ${color_dv_surface};`);
    expect(css).toContain(`border: 1px solid ${color_dv_border};`);

    expect(css).toContain(".dv-btn");
    expect(css).toContain("height: 44px;");
    expect(css).toContain(`border: 1px solid ${color_dv_control_border};`);

    expect(css).toContain(".dv-btn-primary");
    expect(css).toContain(`background: ${color_dv_primary};`);
    expect(css).toContain(`background: ${color_dv_primary_hover};`);

    expect(css).toContain(".dv-btn:focus-visible");
    expect(css).toContain(`outline: 3px solid ${color_dv_primary};`);
  });

  it("contains row button and chip styling with the correct colors", () => {
    const { container } = renderComponent();
    const css = getCss(container);

    expect(css).toContain(".community-action-bar");
    expect(css).toContain(".community-action-msg");
    expect(css).toContain(`background: ${color_dv_banner_bg};`);
    expect(css).toContain(`color: ${color_dv_banner_title};`);


    expect(css).toContain(".dv-row-btn");
    expect(css).toContain(".dv-chip");
    expect(css).toContain(`background: ${color_dv_chip_bg};`);
  });

  it("contains AG Grid header overflow handling rules", () => {
    const { container } = renderComponent();
    const css = getCss(container);

    expect(css).toContain(".ag-header-cell-label");
    expect(css).toContain(".ag-header-cell-text");
    expect(css).toContain(".ag-header-cell-comp-wrapper");

    expect(css).toContain("width: 100%;");
    expect(css).toContain("overflow: hidden;");
    expect(css).toContain("white-space: nowrap;");
  });
});