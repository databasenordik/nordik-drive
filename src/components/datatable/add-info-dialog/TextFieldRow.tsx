"use client";

import React from "react";
import { TextField } from "@mui/material";
import { ADD_INFO_INPUT_SX } from "./styles";

type Props = {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
};

export default function TextFieldRow({ value, onChange, multiline, rows, placeholder, disabled }: Props) {
  return (
    <TextField
      fullWidth
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      multiline={!!multiline}
      rows={multiline ? rows ?? 4 : 1}
      sx={[
        ADD_INFO_INPUT_SX as any,
        multiline ? { "& .MuiInputBase-input": { lineHeight: 1.5 } } : {},
      ]}
    />
  );
}
