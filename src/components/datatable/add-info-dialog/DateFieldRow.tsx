"use client";

import React from "react";
import { Box, TextField } from "@mui/material";
import DropdownDatePicker from "../DropDownPicker";
import { ADD_INFO_INPUT_SX } from "./styles";

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export default function DateFieldRow({ value, onChange, disabled = false }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: { xs: "wrap", sm: "nowrap" } }}>
      <TextField
        fullWidth
        placeholder="yyyy-mm-dd"
        inputProps={{ "aria-label": "Full date (yyyy-mm-dd)" }}
        value={value || ""}
        disabled={disabled}
        onChange={(e) => !disabled && onChange(e.target.value)}
        sx={ADD_INFO_INPUT_SX}
      />
      <DropdownDatePicker
        value={value || ""}
        onChange={(v: string) => !disabled && onChange(v)}
        {...({ disabled } as any)}
      />
    </Box>
  );
}