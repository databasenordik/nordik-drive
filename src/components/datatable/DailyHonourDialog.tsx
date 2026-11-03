import React, { useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  color_dv_banner_title,
  color_dv_border,
  color_dv_control_border,
  color_dv_header_bg,
  color_dv_primary,
  color_dv_primary_hover,
  color_dv_text,
  color_dv_text_muted,
} from "../../constants/colors";

type DailyHonourDialogProps = {
  open: boolean;
  loading: boolean;
  honourText: string;
  date?: string;
  onClose: () => void;
};

const SERIF = "'Lora', Georgia, 'Times New Roman', serif";
const GOLD_RULE = "#C8B874";

/* "2026-10-15" -> "Thursday, October 15, 2026"; anything else is shown as given. */
export const formatHonourDate = (date?: string): string => {
  if (!date) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!m) return date;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
};

const focusRing = {
  "&:focus-visible": { outline: `3px solid ${color_dv_primary}`, outlineOffset: "2px" },
};

export default function DailyHonourDialog({ open, loading, honourText, date, onClose }: DailyHonourDialogProps) {
  // Split into paragraphs; when there are several, the closing line reads as a quiet dedication.
  const paragraphs = useMemo(
    () =>
      String(honourText || "")
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    [honourText]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      aria-labelledby="daily-honour-dialog-title"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 720,
          m: { xs: 1.5, sm: 4 },
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 28px 72px rgba(16, 24, 40, 0.22)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          pt: { xs: 2.5, sm: 3.5 },
          pr: { xs: 1.5, sm: 3.5 },
          pl: { xs: 2.5, sm: 5 },
        }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.75 }}>
          {date ? (
            <Typography
              data-testid="daily-honour-date"
              component="span"
              sx={{ fontSize: 13, fontWeight: 500, color: color_dv_text_muted }}
            >
              {formatHonourDate(date)}
            </Typography>
          ) : null}
          <Typography
            id="daily-honour-dialog-title"
            component="h2"
            sx={{
              m: 0,
              fontFamily: SERIF,
              fontSize: { xs: 24, sm: 28 },
              fontWeight: 600,
              lineHeight: 1.25,
              color: color_dv_banner_title,
            }}
          >
            Today's honour
          </Typography>
          <Typography component="span" sx={{ fontSize: 15, color: color_dv_text_muted }}>
            Shared with respect
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          aria-label="Close today's honour"
          sx={{ width: 40, height: 40, borderRadius: "10px", color: color_dv_text_muted, ...focusRing }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent sx={{ px: { xs: 2.5, sm: 5 }, pt: 3, pb: { xs: 3, sm: 4.5 } }}>
        <Box sx={{ width: 48, height: 2, background: GOLD_RULE, mb: 3 }} aria-hidden="true" />

        <Box
          data-testid={loading ? "daily-honour-loading" : "daily-honour-text"}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {loading ? (
            <Typography sx={{ fontSize: 17, color: color_dv_text_muted }}>Loading today's honour…</Typography>
          ) : (
            paragraphs.map((p, i) => {
              const isDedication = paragraphs.length > 1 && i === paragraphs.length - 1;
              return (
                <Typography
                  key={i}
                  sx={{
                    m: 0,
                    fontFamily: SERIF,
                    fontSize: { xs: 18, sm: 21 },
                    lineHeight: 1.75,
                    whiteSpace: "pre-line",
                    color: isDedication ? color_dv_banner_title : color_dv_text,
                    fontStyle: isDedication ? "italic" : "normal",
                  }}
                >
                  {p}
                </Typography>
              );
            })
          )}
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3.5 },
          py: 2,
          gap: 1,
          borderTop: `1px solid ${color_dv_border}`,
          background: "#FAFBFC",
          "& > :not(style) ~ :not(style)": { ml: 0 },
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            height: 44,
            px: 2.5,
            borderRadius: "10px",
            border: `1px solid ${color_dv_control_border}`,
            background: "#FFFFFF",
            color: color_dv_text,
            fontSize: 15,
            fontWeight: 500,
            textTransform: "none",
            "&:hover": { background: color_dv_header_bg, borderColor: "#9AA3B2" },
            ...focusRing,
          }}
        >
          Close
        </Button>

        <Button
          onClick={onClose}
          endIcon={<ArrowForwardIcon />}
          sx={{
            height: 44,
            px: 2.75,
            borderRadius: "10px",
            background: color_dv_primary,
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { background: color_dv_primary_hover, boxShadow: "none" },
            ...focusRing,
          }}
        >
          Continue to records
        </Button>
      </DialogActions>
    </Dialog>
  );
}
