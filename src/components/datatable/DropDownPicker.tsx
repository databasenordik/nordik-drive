import { TextField, MenuItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import { ADD_INFO_INPUT_SX } from "./add-info-dialog/styles";

const SELECT_SX = [ADD_INFO_INPUT_SX as any, { "& .MuiInputLabel-root:not(.MuiInputLabel-shrink)": { transform: "translate(12px, 11px) scale(1)" } }];

export default function DropdownDatePicker({ value, onChange, disabled = false }:any) {
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const years = Array.from({ length: 150 }, (_, i) => (new Date().getFullYear() - i).toString());

  const storedYear = /^(\d{4})-/.exec(value || "")?.[1];
  if (storedYear && !years.includes(storedYear)) years.push(storedYear);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    setDay(parts?.[3] || "");
    setMonth(parts ? months[Number(parts[2]) - 1] || "" : "");
    setYear(parts?.[1] || "");
  }, [value]);

  const selectPart = (part: string, next: string) => {
    if (disabled) return;
    const nextDay = part === "day" ? next : day;
    const nextMonth = part === "month" ? next : month;
    const nextYear = part === "year" ? next : year;
    setDay(nextDay);
    setMonth(nextMonth);
    setYear(nextYear);
    if (nextDay && nextMonth && nextYear) {
      const monthNumber = String(months.indexOf(nextMonth) + 1).padStart(2, "0");
      onChange(`${nextYear}-${monthNumber}-${nextDay}`);
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", width: "100%" }}>
      <TextField
        select fullWidth disabled={disabled} value={day} onChange={(e) => selectPart("day", e.target.value)}
        label="Day"
        sx={SELECT_SX}
      >
        {days.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
      </TextField>

      <TextField
        select fullWidth disabled={disabled} value={month} onChange={(e) => selectPart("month", e.target.value)}
        label="Month"
        sx={SELECT_SX}
      >
        {months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
      </TextField>

      <TextField
        select fullWidth disabled={disabled} value={year} onChange={(e) => selectPart("year", e.target.value)}
        label="Year"
        sx={SELECT_SX}
      >
        {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
      </TextField>
    </div>
  );
}
