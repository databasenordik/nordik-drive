export const SOURCE_COLORS: Record<string, string> = {
  "NCTR SOURCE": "#FFC000",
  "Office of the Registrar General": "#0070C0",
  "Report Complete": "#00B050",
  "Library and Archives Canada": "#00B0F0",
  "St. Margaret's Register & OLOL List": "#92D050",
  "CIRNAC SOURCE": "#9F5FCF",
  "CORONER'S OFFICE SOURCE": "#FF0000",
  "STUDENTS REMOVED FROM NCTR": "#d77d7d",
  "FURTHER INVESTIGATION REQUIRED": "#afaf5b",
};

export const SOURCE_ACRONYM_DETAILS = [
  {
    acronym: "NCTR",
    fullName: "National Center for Truth and Reconciliation",
  },
  {
    acronym: "CIRNAC",
    fullName: "Crown-Indigenous Relations and Northern Affairs Canada",
  },
];
/*
 * Soft "pill" palette for each source (redesign).
 * bg = tinted background, fg = text (passes 4.5:1 on bg), dot = the source's signature colour.
 */
export type SourceTint = { bg: string; fg: string; dot: string };

export const SOURCE_TINTS: Record<string, SourceTint> = {
  "NCTR SOURCE": { bg: "#FDF0D5", fg: "#7A4A00", dot: "#D98B00" },
  "Office of the Registrar General": { bg: "#E8EEF9", fg: "#1F3A6E", dot: "#1F3A6E" },
  "Report Complete": { bg: "#E3F4E8", fg: "#14632F", dot: "#1E9E4A" },
  "Library and Archives Canada": { bg: "#E1F1FA", fg: "#0B5A8A", dot: "#1B8FD1" },
  "St. Margaret's Register & OLOL List": { bg: "#EEF6E0", fg: "#3F6212", dot: "#6AA623" },
  "CIRNAC SOURCE": { bg: "#F0E8FB", fg: "#5B2D91", dot: "#8A4FD1" },
  "CORONER'S OFFICE SOURCE": { bg: "#FDECEE", fg: "#9B1C2C", dot: "#D32F3F" },
  "STUDENTS REMOVED FROM NCTR": { bg: "#F8E8E8", fg: "#8A3A3A", dot: "#C96A6A" },
  "FURTHER INVESTIGATION REQUIRED": { bg: "#F3F3DF", fg: "#5C5C1E", dot: "#A3A33E" },
};

const FALLBACK_TINT: SourceTint = { bg: "#F1F3F6", fg: "#3D4657", dot: "#8A93A3" };

export const getSourceTint = (source: string | null | undefined): SourceTint => {
  if (!source) return FALLBACK_TINT;
  return SOURCE_TINTS[source] || (SOURCE_COLORS[source] ? { ...FALLBACK_TINT, dot: SOURCE_COLORS[source] } : FALLBACK_TINT);
};

/* "NCTR SOURCE" -> "NCTR", "CORONER'S OFFICE SOURCE" -> "Coroner's office" (display only) */
export const getSourceDisplayName = (source: string): string => {
  const trimmed = source.replace(/\s+SOURCE$/i, "").trim();
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 6) {
    const lower = trimmed.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return trimmed;
};
