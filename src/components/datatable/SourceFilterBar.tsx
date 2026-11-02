"use client";

import React from "react";
import { Box, Tooltip } from "@mui/material";
import { SOURCE_ACRONYM_DETAILS, getSourceDisplayName, getSourceTint } from "./sourceColors";
import {
  color_dv_primary,
  color_dv_surface,
  color_dv_control_border,
  color_dv_text,
  color_dv_text_muted,
} from "../../constants/colors";

type Props = {
  availableSources: string[];
  sourceFilter: string | null;
  setSourceFilter: (v: string | null) => void;
};

const getFriendlySourceLabel = (source: string) => {
  const detail = SOURCE_ACRONYM_DETAILS.find(({ acronym }) =>
    new RegExp(`\\b${acronym}\\b`, "i").test(source)
  );

  if (!detail) return { expandedLabel: source, acronym: null, fullName: null };

  const expandedLabel = source
    .replace(new RegExp(`\\b${detail.acronym}\\b`, "gi"), detail.fullName)
    .replace(/\bSOURCE\b/g, "Source");

  return { expandedLabel, acronym: detail.acronym, fullName: detail.fullName };
};

const pillBase: React.CSSProperties = {
  height: 40,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "0 14px",
  borderRadius: 999,
  fontFamily: "inherit",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

export default function SourceFilterBar({ availableSources, sourceFilter, setSourceFilter }: Props) {
  if (!availableSources || availableSources.length === 0) return null;

  const allSelected = sourceFilter === null;

  return (
    <section
      aria-label="Filter by source"
      className="dv-source-bar"
      style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}
    >
      <span className="dv-source-label">Filter by source</span>

      <div
        className="dv-source-pills"
        data-testid="source-filter-scroll"
        aria-label="Source filters"
        style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, minWidth: 0 }}
      >
        <button
          type="button"
          className="dv-source-pill"
          aria-pressed={allSelected}
          onClick={() => setSourceFilter(null)}
          style={{
            ...pillBase,
            background: allSelected ? color_dv_primary : color_dv_surface,
            color: allSelected ? "#FFFFFF" : color_dv_text,
            border: `1px solid ${allSelected ? color_dv_primary : color_dv_control_border}`,
          }}
        >
          All sources
        </button>

        {availableSources.map((key) => {
          const selected = sourceFilter === key;
          const tint = getSourceTint(key);
          const sourceLabel = getFriendlySourceLabel(key);

          const button = (
            <button
              key={key}
              type="button"
              className="dv-source-pill"
              aria-pressed={selected}
              aria-label={key}
              onClick={() => setSourceFilter(key)}
              style={{
                ...pillBase,
                background: selected ? color_dv_primary : tint.bg,
                color: selected ? "#FFFFFF" : tint.fg,
                border: `1px solid ${selected ? color_dv_primary : "transparent"}`,
              }}
            >
              <span
                aria-hidden="true"
                data-testid="source-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: selected ? "#FFFFFF" : tint.dot,
                  flexShrink: 0,
                }}
              />
              {getSourceDisplayName(key)}
            </button>
          );

          if (!sourceLabel.acronym) return button;

          return (
            <Tooltip
              key={key}
              arrow
              describeChild
              title={
                <Box sx={{ p: 0.4 }}>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      px: 0.8,
                      py: 0.2,
                      mb: 0.6,
                      borderRadius: "999px",
                      backgroundColor: color_dv_primary,
                      color: "#FFFFFF",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {sourceLabel.acronym}
                  </Box>
                  <Box sx={{ color: color_dv_text_muted, fontSize: "0.875rem", fontWeight: 500 }}>
                    {sourceLabel.expandedLabel}
                  </Box>
                </Box>
              }
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E3E6EB",
                    borderRadius: "10px",
                    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.14)",
                    maxWidth: 360,
                  },
                },
                arrow: { sx: { color: "#FFFFFF" } },
              }}
            >
              {button}
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
}
