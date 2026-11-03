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
