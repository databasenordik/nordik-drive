import { createTheme } from "@mui/material/styles";
import {
  color_primary,
  color_primary_dark,
  color_background,
  color_white,
  color_danger,
  color_dv_control_border,
  color_dv_text,
  color_dv_text_muted,
  color_dv_border,
  color_dv_header_bg,
  color_dv_divider,
} from "../constants/colors";

const FONT_STACK = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const theme = createTheme({
  palette: {
    primary: { main: color_primary, dark: color_primary_dark, contrastText: color_white },
    secondary: { main: color_primary, dark: color_primary_dark, contrastText: color_white },
    error: { main: color_danger },
    background: {
      default: color_background,
      paper: "#ffffff",
    },
    text: {
      primary: color_dv_text,
      secondary: color_dv_text_muted,
    },
  },
  typography: {
    fontFamily: FONT_STACK,
    button: { fontWeight: 500, textTransform: "none" },
    // Heading scale used across the redesigned screens
    h4: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.25, "@media (max-width:600px)": { fontSize: "1.25rem" } },
    h5: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.3 },
    h6: { fontSize: "1.0625rem", fontWeight: 600, lineHeight: 1.35 },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": { borderColor: color_dv_control_border },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: color_primary,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: color_primary,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Kept as a filled default so existing buttons keep their shape; navy instead of burgundy.
        root: {
          backgroundColor: color_primary,
          color: color_white,
          borderRadius: 10,
          boxShadow: "none",
          "&:hover": { backgroundColor: color_primary_dark, boxShadow: "none" },
          "&:focus-visible": { outline: `3px solid ${color_primary}`, outlineOffset: 2 },
        },
        // Outlined buttons are the design's secondary style: white with a grey border and navy text.
        outlined: {
          backgroundColor: color_white,
          color: color_primary,
          borderColor: color_dv_control_border,
          "&:hover": { backgroundColor: color_dv_header_bg, borderColor: color_dv_control_border },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: color_primary, height: 3, borderRadius: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: 0,
          color: color_dv_text_muted,
          "&.Mui-selected": { color: color_primary, fontWeight: 600 },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: color_dv_divider },
        head: {
          fontWeight: 500,
          color: color_dv_text_muted,
          backgroundColor: color_dv_header_bg,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: color_dv_border },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus-visible": { outline: `3px solid ${color_primary}`, outlineOffset: 2 },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: 13 },
      },
    },
  },
});

export default theme;
