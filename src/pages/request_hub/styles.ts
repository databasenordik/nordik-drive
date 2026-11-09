import type { SxProps, Theme } from "@mui/material/styles";

import {
  color_dv_border,
  color_dv_control_border,
  color_dv_divider,
  color_dv_header_bg,
  color_dv_page,
  color_dv_primary,
  color_dv_primary_hover,
  color_dv_chip_bg,
  color_dv_surface,
  color_dv_text,
  color_dv_text_muted,
} from "../../constants/colors";
import { UI_NAV_ITEM_SX } from "../../theme/ui";

type RequestHubSx = SxProps<Theme>;

// Navy design: white cards with a thin grey border on a light grey page,
// plain white headers, 600 weight titles and 10px button corners.

export const REQUEST_HUB_SURFACE_SX: RequestHubSx = {
  minHeight: "100%",
  border: `1px solid ${color_dv_border}`,
  borderRadius: "12px",
  overflow: "hidden",
  background: color_dv_surface,
  boxShadow: "none",
};

export const REQUEST_HUB_HEADER_SX: RequestHubSx = {
  background: color_dv_surface,
  borderBottom: `1px solid ${color_dv_divider}`,
};

export const REQUEST_HUB_HEADER_ICON_SX: RequestHubSx = {
  width: 40,
  height: 40,
  minWidth: 40,
  display: "grid",
  placeItems: "center",
  borderRadius: "10px",
  color: color_dv_primary,
  background: color_dv_chip_bg,
  border: "none",
  boxShadow: "none",
};

export const REQUEST_HUB_HEADER_TITLE_SX: RequestHubSx = {
  color: color_dv_text,
  fontWeight: 600,
};

export const REQUEST_HUB_HEADER_SUBTITLE_SX: RequestHubSx = {
  color: color_dv_text_muted,
  fontWeight: 400,
};

export const REQUEST_HUB_CONTENT_SX: RequestHubSx = {
  background: color_dv_page,
};

export const REQUEST_HUB_PANEL_SX: RequestHubSx = {
  border: `1px solid ${color_dv_border}`,
  borderRadius: "12px",
  background: color_dv_surface,
};

export const REQUEST_HUB_EMPTY_STATE_SX: RequestHubSx = {
  border: `1px dashed ${color_dv_control_border}`,
  borderRadius: "12px",
  background: color_dv_surface,
};

export const REQUEST_HUB_PRIMARY_BUTTON_SX: RequestHubSx = {
  textTransform: "none",
  fontWeight: 500,
  borderRadius: "10px",
  background: color_dv_primary,
  color: "#FFFFFF",
  boxShadow: "none",
  "&:hover": {
    background: color_dv_primary_hover,
    boxShadow: "none",
  },
  "&:focus-visible": {
    outline: `3px solid ${color_dv_primary}`,
    outlineOffset: "2px",
  },
};

export const REQUEST_HUB_SECONDARY_BUTTON_SX: RequestHubSx = {
  textTransform: "none",
  fontWeight: 500,
  borderRadius: "10px",
  color: color_dv_text,
  border: `1px solid ${color_dv_control_border}`,
  background: color_dv_surface,
  "&:hover": {
    background: color_dv_header_bg,
  },
  "&:focus-visible": {
    outline: `3px solid ${color_dv_primary}`,
    outlineOffset: "2px",
  },
};

export const REQUEST_HUB_DIALOG_PAPER_SX: RequestHubSx = {
  borderRadius: "16px",
  overflow: "hidden",
  border: `1px solid ${color_dv_border}`,
};

export const REQUEST_HUB_DIALOG_HEADER_SX: RequestHubSx = {
  ...REQUEST_HUB_HEADER_SX,
};

export const REQUEST_HUB_DIALOG_CONTENT_SX: RequestHubSx = {
  background: color_dv_page,
};

export const REQUEST_HUB_DIALOG_ACTIONS_SX: RequestHubSx = {
  background: color_dv_surface,
  borderTop: `1px solid ${color_dv_divider}`,
};

export const REQUEST_HUB_NAV_HEADER_SX: RequestHubSx = {
  background: color_dv_surface,
};

export const REQUEST_HUB_NAV_ITEM_SX: RequestHubSx = UI_NAV_ITEM_SX;

export const REQUEST_HUB_SECTION_KICKER_SX: RequestHubSx = {
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: 0,
  textTransform: "none",
  color: color_dv_text_muted,
};

export const REQUEST_DETAILS_TITLE_SX: RequestHubSx = {
  fontWeight: 600,
  fontSize: 18,
  color: color_dv_text,
  lineHeight: 1.25,
};

export const REQUEST_DETAILS_SUBTITLE_SX: RequestHubSx = {
  mt: 0.35,
  fontSize: 13,
  fontWeight: 400,
  color: color_dv_text_muted,
  lineHeight: 1.45,
};

export const REQUEST_DETAILS_SECTION_TITLE_SX: RequestHubSx = {
  fontWeight: 600,
  fontSize: 14,
  color: color_dv_text,
  lineHeight: 1.25,
};
