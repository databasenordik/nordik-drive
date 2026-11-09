import { Box } from "@mui/material";
import { color_border, color_white, color_white_smoke } from "../../constants/colors";

export function PanelBox({
  children,
  sx,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode;
  sx?: any;
  "data-testid"?: string;
}) {
  return (
    <Box
      data-testid={dataTestId}
      sx={{
        backgroundColor: color_white,
        border: `1px solid ${color_border}`,
        borderRadius: "12px",
        p: 1.5,
        boxShadow: "none",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function SectionDivider({ mt = 2 }: { mt?: number }) {
  return <Box sx={{ mt, mb: 0.5, height: 1, background: color_white_smoke }} />;
}