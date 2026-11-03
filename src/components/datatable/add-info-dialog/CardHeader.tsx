"use client";

import React from "react";
import { Box } from "@mui/material";
import { color_dv_chip_bg, color_dv_primary } from "../../../constants/colors";
import { ADD_INFO_CARD_DESCRIPTION_SX, ADD_INFO_CARD_TITLE_SX } from "./styles";

/* Icon tile + title + hint, used at the top of the photo and document cards. */
export default function CardHeader({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 1.75 }}>
      <Box
        aria-hidden="true"
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          background: color_dv_chip_bg,
          color: color_dv_primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          "& svg": { fontSize: 20 },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={ADD_INFO_CARD_TITLE_SX}>{title}</Box>
        <Box sx={{ ...(ADD_INFO_CARD_DESCRIPTION_SX as object), mb: 0 }}>{children}</Box>
      </Box>
    </Box>
  );
}
