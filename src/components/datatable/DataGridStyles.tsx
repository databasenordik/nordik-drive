import React from "react";
import {
  color_dv_page,
  color_dv_surface,
  color_dv_border,
  color_dv_control_border,
  color_dv_divider,
  color_dv_text,
  color_dv_text_muted,
  color_dv_text_faint,
  color_dv_primary,
  color_dv_primary_hover,
  color_dv_chip_bg,
  color_dv_chip_hover,
  color_dv_banner_bg,
  color_dv_banner_title,
  color_dv_banner_text,
  color_dv_header_bg,
  color_dv_row_hover,
  color_primary,
  color_danger,
} from "../../constants/colors";

/*
 * Visual styles for the data view (student records page).
 * Matches the "Student records page, redesigned" artboard.
 */
export default function DataGridStyles() {
  return (
    <style>
      {`
        /* ---------- Page shell ---------- */
        .dv-page {
          background: ${color_dv_page};
          color: ${color_dv_text};
        }
        .dv-shell {
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          padding: 16px 24px 20px !important;
          gap: 12px;
        }
        @media (max-width: 600px) {
          .dv-shell { padding: 12px !important; gap: 10px; }
        }

        .dv-visually-hidden {
          position: absolute !important;
          width: 1px; height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        /* ---------- Buttons ---------- */
        .dv-btn {
          height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
          border-radius: 10px;
          border: 1px solid ${color_dv_control_border};
          background: ${color_dv_surface};
          color: ${color_dv_text};
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          flex-shrink: 0;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }
        .dv-btn:hover { background: ${color_dv_header_bg}; border-color: #9AA3B2; }
        .dv-btn svg { flex-shrink: 0; }
        .dv-btn-trailing { display: inline-flex; color: ${color_dv_text_faint}; }

        .dv-btn-primary {
          background: ${color_dv_primary};
          border-color: transparent;
          color: #FFFFFF;
        }
        .dv-btn-primary:hover { background: ${color_dv_primary_hover}; border-color: transparent; }

        .dv-btn-soft {
          background: ${color_dv_chip_bg};
          border-color: transparent;
          color: ${color_dv_primary};
        }
        .dv-btn-soft:hover { background: ${color_dv_chip_hover}; border-color: transparent; }

        .dv-icon-btn {
          width: 34px; height: 34px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: ${color_dv_text_muted};
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0;
          cursor: pointer;
          flex-shrink: 0;
        }
        .dv-icon-btn:hover:not(:disabled) { background: ${color_dv_header_bg}; border-color: ${color_dv_control_border}; }
        .dv-icon-btn:disabled { opacity: 0.4; cursor: default; }
        .dv-icon-btn-recording { color: ${color_danger}; background: #FDECEE; }

        .dv-btn:focus-visible,
        .dv-icon-btn:focus-visible,
        .dv-row-btn:focus-visible,
        .dv-chip:focus-visible,
        .cf-link:focus-visible,
        .cf-close:focus-visible,
        .cf-row:focus-visible {
          outline: 3px solid ${color_dv_primary};
          outline-offset: 2px;
        }

        /* ---------- Toolbar ---------- */
        .top-controls-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: ${color_dv_surface};
          border: 1px solid ${color_dv_border};
          border-radius: 12px;
          flex-shrink: 0;
        }

        .dv-search {
          flex: 1 1 360px;
          min-width: 0;
          height: 44px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 0 5px 0 4px;
          border: 1px solid ${color_dv_control_border};
          border-radius: 10px;
          background: ${color_dv_surface};
        }
        .dv-search:focus-within { border-color: ${color_dv_primary}; box-shadow: 0 0 0 1px ${color_dv_primary}; }
        .dv-search-mobile { flex-basis: 100%; }
        .dv-search-go { color: ${color_dv_text_faint}; }
        .dv-search-input {
          flex: 1;
          min-width: 60px;
          height: 100%;
          border: 0;
          outline: none;
          background: transparent;
          font-family: inherit;
          font-size: 16px;
          color: ${color_dv_text};
          padding: 0 4px;
        }
        .dv-search-input::placeholder { color: ${color_dv_text_faint}; opacity: 1; }
        .dv-search-count {
          font-size: 14px;
          color: ${color_dv_text_muted};
          white-space: nowrap;
          padding: 0 6px;
          font-variant-numeric: tabular-nums;
        }
        .dv-search-divider { width: 1px; height: 20px; background: ${color_dv_control_border}; margin: 0 2px; }

        .dv-nia { position: relative; }
        .dv-nia-badge {
          min-width: 20px; height: 20px;
          padding: 0 6px;
          border-radius: 999px;
          background: ${color_danger};
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex; align-items: center; justify-content: center;
        }

        /* ---------- Page title (files without the community welcome) ---------- */
        .dv-page-title { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
        .dv-page-title h1 { margin: 0; font-size: 24px; font-weight: 600; color: ${color_dv_text}; }
        .dv-page-title p { margin: 0; font-size: 15px; color: ${color_dv_text_muted}; }
        @media (max-width: 600px) { .dv-page-title h1 { font-size: 20px; } }

        /* ---------- Source filter ---------- */
        .dv-source-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .dv-source-label { font-size: 15px; font-weight: 500; color: #3D4657; margin-right: 4px; }
        .dv-source-pills { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; }
        .dv-source-pill:hover { filter: brightness(0.97); }
        .dv-source-pill:focus-visible { outline: 3px solid ${color_dv_primary}; outline-offset: 2px; }

        .dv-source-value {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          max-width: 100%;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
        }
        .dv-source-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .dv-cell-text { padding: 8px 12px; line-height: 1.4; }

        /* ---------- Filter / Add student row ---------- */
        .community-action-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          gap: 8px;
          flex-shrink: 0;
        }
        .community-action-msg {
          flex: 1 1 420px;
          min-width: 0;
          min-height: 44px;
          box-sizing: border-box;
          margin: 0;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          column-gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          background: ${color_dv_banner_bg};
          color: ${color_dv_banner_text};
          font-size: 15px;
          line-height: 1.45;
        }
        .community-action-msg-greeting {
          font-family: 'Lora', Georgia, serif;
          font-size: 16px;
          font-weight: 600;
          color: ${color_dv_banner_title};
        }
        @media (max-width: 600px) {
          .community-action-msg { flex-basis: 100%; padding: 10px 14px; }
        }

        /* ---------- Filter panel + grid ---------- */
        .dv-content {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 16px;
          width: 100%;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .cf-link {
          background: none;
          border: 0;
          padding: 4px 0;
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          color: ${color_dv_primary};
          cursor: pointer;
          border-radius: 4px;
        }
        .cf-link:hover { text-decoration: underline; }
        .cf-close:hover { background: ${color_dv_header_bg} !important; }
        .cf-row:hover { background: ${color_dv_page}; }
        .cf-search:focus { outline: none; border-color: ${color_dv_primary} !important; box-shadow: 0 0 0 1px ${color_dv_primary}; }

        .mobile-filter-button { display: none; }
        .left-panel { display: flex; }
        @media (max-width: 900px) {
          .mobile-filter-button { display: inline-flex !important; align-items: center; justify-content: center; }
          .left-panel { display: none !important; }
        }

        /* ---------- Grid card ---------- */
        .dv-grid-card {
          flex: 1;
          min-width: 0;
          min-height: 0;
          height: 100%;
          overflow: hidden;
          background: ${color_dv_surface};
          border: 1px solid ${color_dv_border};
          border-radius: 12px;

          --ag-font-family: inherit;
          --ag-font-size: 15px;
          --ag-foreground-color: ${color_dv_text};
          --ag-background-color: ${color_dv_surface};
          --ag-header-background-color: ${color_dv_header_bg};
          --ag-header-foreground-color: ${color_dv_text_muted};
          --ag-border-color: transparent;
          --ag-wrapper-border-radius: 0;
          --ag-row-border-color: ${color_dv_divider};
          --ag-header-column-separator-display: none;
          --ag-row-hover-color: ${color_dv_row_hover};
          --ag-selected-row-background-color: ${color_dv_banner_bg};
          --ag-odd-row-background-color: ${color_dv_surface};
          --ag-cell-horizontal-padding: 12px;
        }

        .ag-theme-quartz .bold-header {
          font-size: 14px !important;
          font-weight: 500 !important;
          background-color: ${color_dv_header_bg} !important;
          color: ${color_dv_text_muted} !important;
          border-bottom: 1px solid ${color_dv_control_border};
        }
        .ag-theme-quartz .ag-header {
          border-bottom: 1px solid ${color_dv_control_border} !important;
        }
        .ag-theme-quartz .ag-header-cell-text { font-weight: 500; }
        .ag-theme-quartz .ag-row { background-color: ${color_dv_surface}; }
        .ag-theme-quartz .ag-row:hover { background-color: ${color_dv_row_hover} !important; }
        .ag-theme-quartz .ag-row-selected,
        .ag-theme-quartz .ag-row-selected:hover {
          background-color: ${color_dv_banner_bg} !important;
        }
        .ag-theme-quartz .ag-row-selected::before,
        .ag-theme-quartz .ag-row-hover::before,
        .ag-theme-quartz .ag-row:hover::before {
          background: transparent !important;
          background-image: none !important;
        }
        .ag-theme-quartz .ag-cell {
          font-weight: 400;
          color: ${color_dv_text};
          display: flex;
          align-items: center;
        }
        .ag-theme-quartz .ag-cell > .ag-cell-wrapper,
        .ag-theme-quartz .ag-cell > div { width: 100%; }
        .ag-theme-quartz .ag-pinned-left-header,
        .ag-theme-quartz .ag-pinned-left-cols-container {
          border-right: 1px solid ${color_dv_control_border} !important;
        }
        .ag-theme-quartz .ag-paging-panel { display: none !important; }
        .ag-pinned-left-cols-container,
        .ag-pinned-left-header {
          width: max-content !important;
        }

        .ag-header-cell-label { width: 100%; overflow: hidden; }
        .ag-header-cell-text { width: 100%; white-space: nowrap; overflow: hidden; }
        .ag-header-cell-comp-wrapper { width: 100%; overflow: hidden; }

        /* ---------- Buttons inside rows ---------- */
        .dv-row-btn {
          width: 100%;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: ${color_dv_primary};
          color: #FFFFFF;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
        }
        .dv-row-btn:hover { background: ${color_dv_primary_hover}; }

        .dv-chip {
          height: 32px;
          max-width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 12px;
          border-radius: 8px;
          border: 0;
          background: ${color_dv_chip_bg};
          color: ${color_dv_primary};
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }
        .dv-chip:hover { background: ${color_dv_chip_hover}; }
        .dv-cell-pad { padding: 0 12px; }
        .ag-theme-quartz .ag-cell > .dv-chip { margin: 0 12px; max-width: calc(100% - 24px); }
        .ag-theme-quartz .ag-cell .dv-row-btn { width: calc(100% - 16px); margin: 0 8px; }
      `}
    </style>
  );
}
