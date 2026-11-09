// Shared styles for the redesigned screens (navy design).
// Values match the student records page: white cards on a light grey page,
// 12px card corners, 10px button corners, weights 400 / 500 / 600.
import type { SxProps, Theme } from "@mui/material/styles";
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
  color_dv_header_bg,
} from "../constants/colors";

type Sx = SxProps<Theme>;

export const ui_page_bg = color_dv_page;

export const UI_CARD_SX: Sx = {
  background: color_dv_surface,
  border: `1px solid ${color_dv_border}`,
  borderRadius: "12px",
  boxShadow: "none",
};

export const UI_CARD_HEADER_SX: Sx = {
  background: color_dv_surface,
  borderBottom: `1px solid ${color_dv_divider}`,
};

export const UI_TITLE_SX: Sx = {
  fontSize: { xs: 20, md: 24 },
  fontWeight: 600,
  color: color_dv_text,
  lineHeight: 1.25,
};

export const UI_SECTION_TITLE_SX: Sx = {
  fontSize: 17,
  fontWeight: 600,
  color: color_dv_text,
  lineHeight: 1.3,
};

export const UI_SUBTITLE_SX: Sx = {
  fontSize: 14,
  fontWeight: 400,
  color: color_dv_text_muted,
  lineHeight: 1.5,
};

export const UI_ICON_TILE_SX: Sx = {
  width: 40,
  height: 40,
  minWidth: 40,
  display: "grid",
  placeItems: "center",
  borderRadius: "10px",
  color: color_dv_primary,
  background: color_dv_chip_bg,
};

export const UI_PRIMARY_BUTTON_SX: Sx = {
  textTransform: "none",
  fontWeight: 500,
  fontSize: 15,
  minHeight: 44,
  px: 2,
  borderRadius: "10px",
  background: color_dv_primary,
  color: "#FFFFFF",
  boxShadow: "none",
  "&:hover": { background: color_dv_primary_hover, boxShadow: "none" },
  "&:focus-visible": { outline: `3px solid ${color_dv_primary}`, outlineOffset: "2px" },
};

export const UI_OUTLINE_BUTTON_SX: Sx = {
  textTransform: "none",
  fontWeight: 500,
  fontSize: 15,
  minHeight: 44,
  px: 2,
  borderRadius: "10px",
  color: color_dv_text,
  border: `1px solid ${color_dv_control_border}`,
  background: color_dv_surface,
  boxShadow: "none",
  "&:hover": { background: color_dv_header_bg, borderColor: color_dv_control_border },
  "&:focus-visible": { outline: `3px solid ${color_dv_primary}`, outlineOffset: "2px" },
};

export const UI_TABLE_HEAD_CELL_SX: Sx = {
  fontWeight: 500,
  fontSize: 13,
  color: color_dv_text_muted,
  backgroundColor: color_dv_header_bg,
  borderBottom: `1px solid ${color_dv_control_border}`,
  py: 1.25,
  px: 2,
  whiteSpace: "nowrap",
};

export const UI_TABLE_BODY_CELL_SX: Sx = {
  fontSize: 14,
  color: color_dv_text,
  borderBottom: `1px solid ${color_dv_divider}`,
  py: 1.5,
  px: 2,
  verticalAlign: "middle",
  backgroundColor: color_dv_surface,
};

export const UI_CHIP_SX: Sx = {
  height: 26,
  borderRadius: "999px",
  fontSize: 13,
  fontWeight: 500,
  background: color_dv_chip_bg,
  color: color_dv_primary,
};

export const UI_FAINT = color_dv_text_faint;

// Navigation drawer used by the Requests and User activity pages.
export const UI_NAV_ITEM_SX: Sx = {
  borderRadius: "10px",
  minHeight: 48,
  py: 1,
  px: 1.5,
  color: color_dv_text,
  border: "1px solid transparent",
  "&:hover": { background: color_dv_header_bg },
  "& .MuiListItemIcon-root": { color: color_dv_text_muted, minWidth: 40 },
  "& .MuiListItemText-primary": { color: "inherit", fontWeight: 500, fontSize: 15 },
  "&.Mui-selected": { background: color_dv_primary, color: "#FFFFFF" },
  "&.Mui-selected:hover": { background: color_dv_primary_hover },
  "&.Mui-selected .MuiListItemIcon-root": { color: "#FFFFFF" },
  "&:focus-visible": { outline: `3px solid ${color_dv_primary}`, outlineOffset: "2px" },
};

// Toolbar row at the top of a list card: title, search, filters. Wraps on narrow screens.
export const UI_LIST_TOOLBAR_SX: Sx = {
  px: { xs: 1.5, md: 2.5 },
  py: 1.5,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  columnGap: 2,
  rowGap: 1.25,
  borderBottom: `1px solid ${color_dv_divider}`,
  backgroundColor: color_dv_surface,
  flexShrink: 0,
};

export const UI_LIST_TITLE_SX: Sx = {
  fontWeight: 600,
  color: color_dv_text,
  fontSize: 17,
  lineHeight: 1.3,
};

export const UI_SEARCH_FIELD_SX: Sx = {
  flex: { xs: "1 1 100%", sm: "0 1 320px" },
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    height: 44,
    borderRadius: "10px",
    backgroundColor: color_dv_surface,
    fontSize: 15,
    color: color_dv_text,
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: color_dv_control_border },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: color_dv_control_border },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: color_dv_primary },
  "& input::placeholder": { color: color_dv_text_muted, opacity: 1 },
};

export const UI_LIST_CARD_SX: Sx = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  borderRadius: "12px",
  border: `1px solid ${color_dv_border}`,
  overflow: "hidden",
  backgroundColor: color_dv_surface,
  boxShadow: "none",
};

export const UI_COUNT_CHIP_SX: Sx = {
  height: 24,
  fontSize: 13,
  fontWeight: 500,
  borderRadius: "999px",
  backgroundColor: color_dv_chip_bg,
  color: color_dv_primary,
};

export const UI_ROW_ICON_BUTTON_SX: Sx = {
  width: 40,
  height: 40,
  borderRadius: "10px",
  color: color_dv_primary,
  backgroundColor: color_dv_chip_bg,
  "&:hover": { backgroundColor: "#D9E3F6" },
};
