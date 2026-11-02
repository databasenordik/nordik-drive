import {
  color_dv_primary,
  color_dv_surface,
  color_dv_border,
  color_dv_control_border,
  color_dv_divider,
  color_dv_text,
  color_dv_text_muted,
  color_dv_text_faint,
  color_dv_chip_bg,
  color_dv_banner_bg,
} from "../../constants/colors";

export const COMMUNITY_FILTER_ACCENT = color_dv_primary;

export const COMMUNITY_FILTER_LAYOUT = {
  panelBorderRadius: 12,
  panelPadding: 16,
  headerZIndex: 10,
  sectionGap: 12,
  titleFontSize: 17,
  titleFontWeight: 600,
  closeButtonSize: 36,
  closeButtonRadius: 8,
  searchInputHeight: 44,
  searchInputFontSize: 15,
  inputBorderRadius: 10,
  linkFontSize: 15,
  countFontSize: 13,
  listItemMinHeight: 44,
  listItemGap: 12,
  listItemBorderRadius: 8,
  listItemFontSize: 15,
  checkboxSize: 20,
} as const;

export const COMMUNITY_FILTER_COLORS = {
  surface: color_dv_surface,
  border: color_dv_border,
  controlBorder: color_dv_control_border,
  divider: color_dv_divider,
  text: color_dv_text,
  textMuted: color_dv_text_muted,
  icon: color_dv_text_faint,
  countActiveBg: color_dv_chip_bg,
  countIdleBg: "#F1F3F6",
  selectedItemBackground: color_dv_banner_bg,
  emptyStateText: color_dv_text_muted,
} as const;
