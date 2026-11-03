"use client";

import React from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { ADD_INFO_ADD_BUTTON_SX, ADD_INFO_INPUT_SX, ADD_INFO_REMOVE_BUTTON_SX } from "./styles";

type Props = {
  values: string[];
  onChange: (next: string[]) => void;
  addLabel: string;
  disabled?: boolean;
};

/* "Add Name" -> "name", "Add Sibling" -> "sibling" */
const itemNoun = (addLabel: string) => addLabel.replace(/^\+?\s*add\s+/i, "").trim().toLowerCase() || "item";

export default function MultiValueRow({ values, onChange, addLabel, disabled }: Props) {
  const safe = values?.length ? values : [""];
  const noun = itemNoun(addLabel);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {safe.map((val, idx) => (
        <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <TextField
            fullWidth
            value={val || ""}
            disabled={disabled}
            inputProps={{ "aria-label": `${noun.charAt(0).toUpperCase() + noun.slice(1)} ${idx + 1}` }}
            onChange={(e) => {
              const next = [...safe];
              next[idx] = e.target.value;
              onChange(next);
            }}
            sx={ADD_INFO_INPUT_SX}
          />
          <IconButton
            aria-label={`Remove ${noun}`}
            disabled={disabled}
            onClick={() => {
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
          startIcon={<AddIcon sx={{ fontSize: "16px !important" }} />}
          onClick={() => onChange([...safe, ""])}
          sx={ADD_INFO_ADD_BUTTON_SX}
        >
          {addLabel.charAt(0).toUpperCase() + addLabel.slice(1).toLowerCase()}
        </Button>
      </Box>
    </Box>
  );
}
