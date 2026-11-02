import type { SxProps, Theme } from "@mui/material/styles";

import {
  color_dv_banner_title,
  color_dv_border,
  color_dv_control_border,
  color_dv_divider,
  color_dv_header_bg,
  color_dv_primary,
  color_dv_primary_hover,
  color_dv_text,
  color_dv_text_muted,
} from "../../../constants/colors";

type AddInfoSx = SxProps<Theme>;

/* Shared look for the Add student / Add info form (matches the "Add new student" artboard). */

export const ADD_INFO_LABEL_COLOR = "#3D4657";
export const ADD_INFO_REQUIRED_COLOR = "#A12C3A";

const focusRing = {
  "&:focus-visible": { outline: `3px solid ${color_dv_primary}`, outlineOffset: "2px" },
};

/* Text inputs (MUI TextField / Autocomplete) */
export const ADD_INFO_INPUT_SX: AddInfoSx = {
  background: "#FFFFFF",
  borderRadius: "10px",
  "& .MuiOutlinedInput-root": { borderRadius: "10px", background: "#FFFFFF" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: color_dv_control_border },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9AA3B2" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: color_dv_primary,
    borderWidth: "2px",
  },
  "& .MuiInputBase-input": {
    fontSize: "16px",
    fontWeight: 400,
    color: color_dv_text,
    padding: "10px 12px",
    minHeight: "24px",
  },
  "& .MuiInputBase-multiline": { padding: 0 },
  "& .MuiInputBase-input::placeholder": { color: "#8A93A3", opacity: 1 },
  "& .Mui-disabled .MuiInputBase-input": { WebkitTextFillColor: color_dv_text_muted },
};

/* Square "remove" icon button next to an input */
export const ADD_INFO_REMOVE_BUTTON_SX: AddInfoSx = {
  width: 44,
  minWidth: 44,
  height: 44,
  flexShrink: 0,
  borderRadius: "10px",
  border: `1px solid ${color_dv_control_border}`,
  background: "#FFFFFF",
  color: color_dv_text_muted,
  "&:hover": { background: color_dv_header_bg },
  ...focusRing,
};

/* Small outline "Add ..." button under a list of inputs */
export const ADD_INFO_ADD_BUTTON_SX: AddInfoSx = {
  height: 40,
  px: 1.75,
  gap: 0.25,
  borderRadius: "10px",
  textTransform: "none",
  fontSize: 14,
  fontWeight: 500,
  border: `1px solid ${color_dv_control_border}`,
  background: "#FFFFFF",
  color: color_dv_primary,
  "&:hover": { background: color_dv_header_bg, borderColor: "#9AA3B2" },
  "& .MuiButton-startIcon": { mr: 0.5 },
  ...focusRing,
};

export const ADD_INFO_CARD_SX: AddInfoSx = {
  border: `1px solid ${color_dv_border}`,
  background: "#FFFFFF",
  borderRadius: "12px",
  p: 2.5,
};

export const ADD_INFO_DIALOG_PAPER_SX: AddInfoSx = {
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 28px 72px rgba(16, 24, 40, 0.22)",
};

export const ADD_INFO_DIALOG_HEADER_SX: AddInfoSx = {
  background: "#FFFFFF",
  borderBottom: `1px solid ${color_dv_border}`,
};

export const ADD_INFO_DIALOG_CONTENT_SX: AddInfoSx = {
  background: "#FFFFFF",
};

export const ADD_INFO_DIALOG_ACTIONS_SX: AddInfoSx = {
  background: "#FAFBFC",
  borderTop: `1px solid ${color_dv_border}`,
};

export const ADD_INFO_DIALOG_TITLE_SX: AddInfoSx = {
  m: 0,
  fontSize: 22,
  fontWeight: 600,
  color: color_dv_text,
  lineHeight: 1.3,
};

export const ADD_INFO_DIALOG_SUBTITLE_SX: AddInfoSx = {
  m: 0,
  mt: 0.5,
  fontSize: 15,
  color: color_dv_text_muted,
};

export const ADD_INFO_CARD_TITLE_SX: AddInfoSx = {
  fontWeight: 600,
  fontSize: 16,
  color: color_dv_text,
  mb: 0.25,
};

export const ADD_INFO_CARD_DESCRIPTION_SX: AddInfoSx = {
  color: color_dv_text_muted,
  fontSize: 13,
  lineHeight: 1.5,
  mb: 1.5,
};

export const ADD_INFO_SECTION_TITLE_SX: AddInfoSx = {
  m: 0,
  fontSize: 17,
  fontWeight: 600,
  color: color_dv_banner_title,
};

export const ADD_INFO_PRIMARY_ACTION_BUTTON_SX: AddInfoSx = {
  height: 44,
  background: color_dv_primary,
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: 500,
  textTransform: "none",
  borderRadius: "10px",
  boxShadow: "none",
  px: 3,
  "&:hover": { background: color_dv_primary_hover, boxShadow: "none" },
  ...focusRing,
};

export const ADD_INFO_SECONDARY_ACTION_BUTTON_SX: AddInfoSx = {
  height: 44,
  textTransform: "none",
  fontSize: 15,
  fontWeight: 500,
  borderRadius: "10px",
  px: 2.5,
  border: `1px solid ${color_dv_control_border}`,
  background: "#FFFFFF",
  color: color_dv_text,
  "&:hover": { background: color_dv_header_bg, borderColor: "#9AA3B2" },
  ...focusRing,
};

export const ADD_INFO_GHOST_BUTTON_SX: AddInfoSx = {
  height: 44,
  textTransform: "none",
  fontSize: 15,
  fontWeight: 500,
  borderRadius: "10px",
  px: 1.75,
  color: color_dv_text_muted,
  background: "transparent",
  "&:hover": { background: "#F1F3F6" },
  ...focusRing,
};

export const ADD_INFO_CONSENT_TEXT_SX: AddInfoSx = {
  color: ADD_INFO_LABEL_COLOR,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.5,
};

export const ADD_INFO_DISCLAIMER_BOX_SX: AddInfoSx = {
  mt: 1.5,
  p: 2,
  display: "flex",
  gap: 1.5,
  alignItems: "flex-start",
  borderRadius: "12px",
  border: "1px solid #F0D9A0",
  background: "#FFF8E6",
};

export const ADD_INFO_DISCLAIMER_KICKER_SX: AddInfoSx = {
  color: "#6B4A00",
  fontSize: 15,
  fontWeight: 600,
  lineHeight: 1.4,
  mb: 0.5,
};

export const ADD_INFO_DISCLAIMER_TEXT_SX: AddInfoSx = {
  color: color_dv_text,
  fontSize: 15,
  fontWeight: 400,
  lineHeight: 1.6,
};

export const ADD_INFO_REVIEW_SECTION_TITLE_SX: AddInfoSx = {
  fontWeight: 600,
  fontSize: 15,
  color: color_dv_text,
  lineHeight: 1.3,
};

export const ADD_INFO_REVIEW_SECTION_SUBTITLE_SX: AddInfoSx = {
  mt: 0.35,
  fontSize: 13,
  fontWeight: 400,
  color: color_dv_text_muted,
  lineHeight: 1.4,
};

export const ADD_INFO_REVIEW_DIALOG_TITLE_SX: AddInfoSx = {
  fontWeight: 600,
  fontSize: 20,
  color: color_dv_text,
  lineHeight: 1.3,
};

export const ADD_INFO_DIVIDER_COLOR = color_dv_divider;
