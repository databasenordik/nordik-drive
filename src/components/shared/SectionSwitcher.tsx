import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import {
  color_dv_control_border,
  color_dv_header_bg,
  color_dv_primary,
  color_dv_surface,
  color_dv_text,
  color_dv_text_muted,
} from "../../constants/colors";

type SectionSwitcherProps = {
  /** Page name, e.g. "Requests" */
  page: string;
  /** The section currently shown */
  current: string;
  onOpen: () => void;
};

/**
 * Slim bar above a workspace page showing which section is open, with the
 * button that opens the section drawer. Sits in the page flow so it never
 * covers the content below it.
 */
export default function SectionSwitcher({ page, current, onOpen }: SectionSwitcherProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        flexShrink: 0,
        minHeight: 44,
      }}
    >
      <Box sx={{ minWidth: 0, display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
        <Typography component="span" sx={{ fontSize: 14, color: color_dv_text_muted, fontWeight: 400 }}>
          {page}
        </Typography>
        <Typography component="span" aria-hidden="true" sx={{ fontSize: 14, color: color_dv_text_muted }}>
          /
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: { xs: 16, md: 18 }, color: color_dv_text, fontWeight: 600, lineHeight: 1.3 }}
        >
          {current}
        </Typography>
      </Box>

      <IconButton
        onClick={onOpen}
        aria-label="Open navigation"
        title="Open navigation"
        sx={{
          flexShrink: 0,
          height: 44,
          px: { xs: 1.25, sm: 2 },
          gap: 1,
          borderRadius: "10px",
          border: `1px solid ${color_dv_control_border}`,
          background: color_dv_surface,
          color: color_dv_text,
          fontSize: 15,
          fontWeight: 500,
          fontFamily: "inherit",
          "&:hover": { background: color_dv_header_bg },
          "&:focus-visible": { outline: `3px solid ${color_dv_primary}`, outlineOffset: "2px" },
        }}
      >
        <MenuOpenRoundedIcon sx={{ fontSize: 20, color: color_dv_primary }} aria-hidden="true" />
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }} aria-hidden="true">
          Sections
        </Box>
      </IconButton>
    </Box>
  );
}
