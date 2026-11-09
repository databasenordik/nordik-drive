// Acknowledgement.tsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  color_white,
  color_secondary,
  color_secondary_dark,
  color_border,
  color_text_secondary,
  color_black_light,
  header_height,
  header_mobile_height,
  color_dv_page,
  color_dv_border,
} from "../../constants/colors";

const Acknowledgement = () => {
  const [highContrast, setHighContrast] = useState(false);

  const palette = useMemo(() => {
    if (!highContrast) {
      return {
        pageBg: color_dv_page,
        cardBg: color_white,
        title: color_secondary_dark,
        body: color_text_secondary,
        border: color_border,
      };
    }
    return {
      pageBg: `linear-gradient(180deg, ${color_black_light} 0%, ${color_black_light} 100%)`,
      cardBg: color_white,
      title: color_secondary_dark,
      body: color_black_light,
      border: color_border,
    };
  }, [highContrast]);

  return (
    <Box sx={{ minHeight: "100vh", background: palette.pageBg }}>
      <Container
        maxWidth={false}
        sx={{
          pt: {
            xs: `calc(${header_mobile_height} + 2.2rem)`,
            md: `calc(${header_height} + 2.6rem)`,
          },
          pb: { xs: 4, md: 6 },
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },

          // keep content readable on big monitors
          maxWidth: { xs: "100%", md: 980, lg: 1040 },

          //  same “premium” large-screen behavior as ContactUs
          display: "flex",
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "center",
          minHeight: {
            xs: "auto",
            md: `calc(100vh - ${header_height} - 5.2rem)`,
          },
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 860,
            borderRadius: "12px",
            background: palette.cardBg,
            border: `1px solid ${color_dv_border}`,
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ px: { xs: 3, md: 5 }, py: { xs: 3.5, md: 4.5 } }}>
            <Box sx={{ textAlign: "center", mb: 2.2 }}>
              <Typography
                sx={{
                  fontSize: { xs: 26, md: 30 },
                  fontWeight: 600,
                  color: palette.title,
                  mb: 1,
                }}
              >
                Acknowledgement
              </Typography>

              <Box
                sx={{
                  width: 44,
                  height: 3,
                  background: color_secondary,
                  borderRadius: 2,
                  mx: "auto",
                }}
              />
            </Box>

            {/* Body text bold + bigger (as you requested) */}
            <Stack spacing={1.6} sx={{ px: { xs: 0, md: 1 } }}>
              <Typography
                sx={{
                  fontSize: { xs: 16.2, md: 16.8 },
                  lineHeight: 1.8,
                  color: palette.body,
                  fontWeight: 500,
                }}
              >
                The Children of Shingwauk Alumni Association’s (CSAA) mission is to provide for the
                well-being of the Children of Shingwauk Alumni who are former students of the Shingwauk
                and Wawanosh Indian Residential Schools, their families and their communities.
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 16.2, md: 16.8 },
                  lineHeight: 1.8,
                  color: palette.body,
                  fontWeight: 500,
                }}
              >
                The CSAA facilitates the ongoing development of a partnership with Algoma University and
                the other partners in fulfilling Chief Shingwauk’s vision of{" "}
                <Box component="span" sx={{ fontWeight: 600 }}>
                  “Sharing, Healing and Learning.”
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 16.2, md: 16.8 },
                  lineHeight: 1.8,
                  color: palette.body,
                  fontWeight: 500,
                }}
              >
                The CSAA provides: A non-political voice for survivors’ concerns and interests to support,
                promote &amp; enhance healing and reconciliation.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Acknowledgement;
