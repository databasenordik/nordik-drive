"use client";

import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { RestartAlt } from "@mui/icons-material";
import { color_dv_text, color_dv_text_muted } from "../../../constants/colors";
import {
  ADD_INFO_DIALOG_ACTIONS_SX,
  ADD_INFO_DIALOG_PAPER_SX,
  ADD_INFO_PRIMARY_ACTION_BUTTON_SX,
  ADD_INFO_SECONDARY_ACTION_BUTTON_SX,
} from "./styles";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ResetAllDialog({ open, onClose, onConfirm }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="reset-all-title"
      PaperProps={{ sx: { ...(ADD_INFO_DIALOG_PAPER_SX as object), maxWidth: 480 } }}
    >
      <DialogTitle id="reset-all-title" sx={{ fontSize: 20, fontWeight: 600, color: color_dv_text, pt: 3, px: 3 }}>
        Reset All?
      </DialogTitle>
      <DialogContent sx={{ color: color_dv_text_muted, fontSize: 16, lineHeight: 1.5, px: 3 }}>
        Are you sure you want to reset all fields and remove uploaded photos and documents?
      </DialogContent>
      <DialogActions
        sx={{ ...(ADD_INFO_DIALOG_ACTIONS_SX as object), px: 3, py: 2, gap: 1, "& > :not(style) ~ :not(style)": { ml: 0 } }}
      >
        <Button onClick={onClose} sx={ADD_INFO_SECONDARY_ACTION_BUTTON_SX}>
          Cancel
        </Button>
        <Button onClick={onConfirm} startIcon={<RestartAlt />} sx={ADD_INFO_PRIMARY_ACTION_BUTTON_SX}>
          Reset all
        </Button>
      </DialogActions>
    </Dialog>
  );
}
