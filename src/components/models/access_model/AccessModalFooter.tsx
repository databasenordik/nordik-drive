import React from "react";
import { Box, Button } from "@mui/material";

import { color_primary, color_primary_dark, color_white } from "../../../constants/colors";

type Props = {
  onClose: () => void;
};

const AccessModalFooter: React.FC<Props> = ({ onClose }) => {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        bgcolor: `${color_white}`,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Button
        onClick={onClose}
        variant="contained"
        sx={{
          borderRadius: "10px",
          px: 3,
          minHeight: 44,
          fontWeight: 500,
          textTransform: "none",
          fontSize: 15,
          boxShadow: "none",
          backgroundColor: color_primary,
          "&:hover": { backgroundColor: color_primary_dark, boxShadow: "none" },
        }}
      >
        Done
      </Button>
    </Box>
  );
};

export default AccessModalFooter;
