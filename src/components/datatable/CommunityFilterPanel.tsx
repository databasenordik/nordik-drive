"use client";

import React from "react";
import CommunityFilter from "../CommunityFilter/CommunityFilter";
import { color_dv_border, color_dv_page } from "../../constants/colors";

type Props = {
  enabled: boolean;
  isMobile: boolean;

  filterOpen: boolean;
  setFilterOpen: (v: boolean) => void;

  overlayTop: number;
  overlayHeight: number;
};

export default function CommunityFilterPanel({
  enabled,
  isMobile,
  filterOpen,
  setFilterOpen,
  overlayTop,
}: Props) {
  if (!enabled) return null;

  return (
    <>
      {/* Desktop left panel */}
      {!isMobile && filterOpen && (
        <div
          className="left-panel"
          style={{
            boxSizing: "border-box",
            flex: "0 0 280px",
            maxWidth: 300,

            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
            maxHeight: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            {/* Desktop: the "Hide filter" button closes the panel, so no extra close button here */}
            <CommunityFilter />
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && filterOpen && (
        <div
          className="mobile-filter-overlay"
          role="dialog"
          aria-modal="true"
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            top: overlayTop,
            zIndex: 999,
            background: color_dv_page,
            borderRadius: 12,
            border: `1px solid ${color_dv_border}`,
            boxShadow: "0 12px 40px rgba(16,24,40,0.18)",
            maxHeight: `calc(100vh - ${overlayTop + 16}px)`,
            overflow: "auto",
            padding: 12,
            transform: "translateY(0)",
            transition: "opacity 240ms ease, transform 240ms ease",
            opacity: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <button
              type="button"
              className="dv-btn dv-btn-primary"
              onClick={() => setFilterOpen(false)}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Close filter
            </button>
          </div>

          <CommunityFilter onClose={() => setFilterOpen(false)} showClose />
        </div>
      )}
    </>
  );
}
