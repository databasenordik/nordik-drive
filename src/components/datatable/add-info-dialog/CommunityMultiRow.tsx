"use client";

import React from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import { ADD_INFO_ADD_BUTTON_SX, ADD_INFO_INPUT_SX, ADD_INFO_REMOVE_BUTTON_SX } from "./styles";

type CommunityMultiConfig = {
  placeholder?: string;
  no_options_text?: string;
  add_label?: string;
};

type Props = {
  values: string[];
  options: string[];
  onChange: (next: string[]) => void;
  onAddNewCommunity: (name: string) => Promise<void>;

  disabled?: boolean;
  validateValue?: (value: string) => string;

  config?: CommunityMultiConfig;
};

export default function CommunityMultiRow({
  values,
  options,
  onChange,
  onAddNewCommunity,
  disabled = false,
  validateValue,
  config,
}: Props) {
  const safe = values?.length ? values : [""];

  const norm = (v: any) => (typeof v === "string" ? v.trim() : "");

  const safeOptions = Array.isArray(options) ? options : [];
  const exists = (name: string) =>
    safeOptions.some((o) => o.trim().toLowerCase() === name.trim().toLowerCase());

  const commit = async (idx: number, raw: any) => {
    if (disabled) return;

    const cleaned = norm(raw);
    if (validateValue?.(cleaned)) return;
    const next = [...safe];
    next[idx] = cleaned;
    onChange(next);

    if (cleaned && !exists(cleaned)) {
      await onAddNewCommunity(cleaned);
    }
  };

  const placeholder =
    config?.placeholder || "Search or type a community (press Enter to add)";
  const noOptionsText =
    config?.no_options_text || "No match — type the name and press Enter to add it";
  const addLabel = config?.add_label || "+ Add Community";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {safe.map((val, idx) => (
        <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "stretch" }}>
          <Autocomplete
            freeSolo
            fullWidth
            options={safeOptions}
            value={val || ""}
            inputValue={val || ""}
            disabled={disabled}
            onInputChange={(_, newInputValue) => {
              if (disabled || validateValue?.(newInputValue)) return;
              const next = [...safe];
              next[idx] = newInputValue;
              onChange(next);
            }}
            onChange={(_, newValue) => {
              void commit(idx, newValue);
            }}
            noOptionsText={noOptionsText}
            renderInput={(params) => (
              <TextField
                {...params}
                disabled={disabled}
                placeholder={placeholder}
                onKeyDown={(e) => {
                  if (disabled) return;
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = (e.target as HTMLInputElement).value;
                    void commit(idx, v);
                  }
                }}
                sx={[
                  ADD_INFO_INPUT_SX as any,
                  { "& .MuiAutocomplete-inputRoot.MuiOutlinedInput-root": { py: 0, pl: 0 } },
                  { "& .MuiAutocomplete-inputRoot .MuiAutocomplete-input": { padding: "10px 12px" } },
                ]}
              />
            )}
          />

          <IconButton
            disabled={disabled}
            aria-label="Remove community"
            onClick={() => {
              if (disabled) return;
              const next = safe.filter((_, i) => i !== idx);
              onChange(next.length ? next : [""]);
            }}
            sx={ADD_INFO_REMOVE_BUTTON_SX}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      ))}

      <Box>
        <Button
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            onChange([...safe, ""]);
          }}
          aria-label={addLabel}
          startIcon={<AddIcon sx={{ fontSize: "16px !important" }} />}
          sx={ADD_INFO_ADD_BUTTON_SX}
        >
          {addLabel.replace(/^\+\s*/, "").replace(/\bCommunity\b/, "community")}
        </Button>
      </Box>
    </Box>
  );
}