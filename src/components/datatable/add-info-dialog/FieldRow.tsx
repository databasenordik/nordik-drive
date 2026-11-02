"use client";

import React, { useId } from "react";
import { Box, Button } from "@mui/material";
import { RestartAlt } from "@mui/icons-material";
import { color_dv_text_muted, color_error } from "../../../constants/colors";
import { ADD_INFO_LABEL_COLOR, ADD_INFO_REQUIRED_COLOR } from "./styles";

type FieldRowProps = {
  label: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
  onReset?: () => void;
  resetDisabled?: boolean;
  children: React.ReactNode;
};

/* Label above the input, optional hint, error and a small "Reset" for edits. */
export default function FieldRow({
  label,
  required,
  helperText,
  errorText,
  onReset,
  resetDisabled,
  children,
}: FieldRowProps) {
  const labelId = useId();

  return (
    <Box role="group" aria-labelledby={labelId} sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 1, minHeight: 24 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box id={labelId} sx={{ fontSize: 14, fontWeight: 500, color: ADD_INFO_LABEL_COLOR, lineHeight: 1.4 }}>
            {label}
            {required ? (
              <span style={{ color: ADD_INFO_REQUIRED_COLOR, marginLeft: 4 }} aria-hidden="true">
                *
              </span>
            ) : null}
            {required ? (
              <span
                style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}
              >
                {" "}(required)
              </span>
            ) : null}
          </Box>
          {helperText ? (
            <Box sx={{ mt: 0.25, color: color_dv_text_muted, fontSize: 13, lineHeight: 1.4 }}>{helperText}</Box>
          ) : null}
        </Box>

        {onReset ? (
          <Button
            onClick={onReset}
            disabled={resetDisabled}
            startIcon={<RestartAlt sx={{ fontSize: "16px !important" }} />}
            sx={{
              flexShrink: 0,
              height: 32,
              px: 1.25,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: 13,
              fontWeight: 500,
              color: color_dv_text_muted,
              "&:hover": { background: "#F1F3F6" },
              "& .MuiButton-startIcon": { mr: 0.5 },
              "&:focus-visible": { outline: "3px solid #1F3A6E", outlineOffset: "2px" },
            }}
          >
            Reset
          </Button>
        ) : null}
      </Box>

      {errorText && (
        <Box role="alert" sx={{ color: color_error, fontSize: 13, fontWeight: 500 }}>
          {errorText}
        </Box>
      )}

      <Box>{children}</Box>
    </Box>
  );
}
