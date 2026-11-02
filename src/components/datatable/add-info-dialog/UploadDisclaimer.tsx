"use client";

import React from "react";
import { Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  ADD_INFO_DISCLAIMER_BOX_SX,
  ADD_INFO_DISCLAIMER_KICKER_SX,
  ADD_INFO_DISCLAIMER_TEXT_SX,
} from "./styles";

type Props = {
  text?: string;
};

export default function UploadDisclaimer({ text }: Props) {
  const disclaimerText = String(text || "").trim();

  if (!disclaimerText) return null;

  return (
    <Box
      role="alert"
      aria-live="polite"
      sx={ADD_INFO_DISCLAIMER_BOX_SX}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          minWidth: 36,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          color: "#8A5A00",
          background: "#FDF0D5",
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 20 }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Box sx={ADD_INFO_DISCLAIMER_KICKER_SX}>
          Disclaimer
        </Box>
        <Box sx={ADD_INFO_DISCLAIMER_TEXT_SX}>
          {disclaimerText}
        </Box>
      </Box>
    </Box>
  );
}
