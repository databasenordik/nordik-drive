"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";

import { header_height, header_mobile_height } from "../../constants/colors";
import {
  color_border,
  color_text_primary,
  color_text_secondary,
  color_white,
  color_dv_page,
  color_dv_border,
  color_dv_divider,
  color_dv_header_bg,
  color_dv_text,
  color_dv_text_muted,
} from "../../constants/colors";
import {
  REQUEST_HUB_NAV_HEADER_SX,
  REQUEST_HUB_NAV_ITEM_SX,
} from "./styles";
import SectionSwitcher from "../../components/shared/SectionSwitcher";

type RequestView = "ADD_INFO" | "FORM_SUBMISSION" | "SUPPORT" | "SUPPORT_CALLS";

type RequestsHubProps = {
  addInfoRequests: React.ReactNode;
  formSubmissionRequests?: React.ReactNode;
  supportRequests?: React.ReactNode;
  supportCalls?: React.ReactNode;
};

export default function RequestsHub({
  addInfoRequests,
  formSubmissionRequests,
  supportRequests,
  supportCalls,
}: RequestsHubProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<RequestView>("ADD_INFO");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const topOffset = isMobile ? header_mobile_height : header_height;

  const items = useMemo(
    () => [
      {
        key: "ADD_INFO" as const,
        label: "Add Info Requests",
        short: "Add info requests",
        icon: <AssignmentIcon />,
      },
      {
        key: "FORM_SUBMISSION" as const,
        label: "Form Submission Requests",
        short: "Form submission requests",
        icon: <DescriptionIcon />,
      },
      {
        key: "SUPPORT" as const,
        label: "Support Requests",
        short: "Support requests",
        icon: <SupportAgentIcon />,
      },
      {
        key: "SUPPORT_CALLS" as const,
        label: "Support Calls",
        short: "Support calls",
        icon: <EventAvailableRoundedIcon />,
      },
    ],
    []
  );

  const handleSelect = (next: RequestView) => {
    setView(next);
    setNavOpen(false);
  };

  return (
    <Box
      sx={{
        height: `calc(100vh - ${topOffset})`,
        mt: topOffset,
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        position: "relative",
        background: color_dv_page,
        width: "100%",
        maxWidth: 1440,
        mx: "auto",
      }}
    >
      <SectionSwitcher
        page="Requests"
        current={items.find((it) => it.key === view)?.short ?? ""}
        onOpen={() => setNavOpen(true)}
      />

      <Box sx={{ flex: 1, minHeight: 0, overflow: { xs: "auto", md: "hidden" } }}>
        <Box sx={{ height: "100%", overflow: { xs: "visible", md: "hidden" } }}>
          {view === "ADD_INFO" && addInfoRequests}
          {view === "FORM_SUBMISSION" &&
            (formSubmissionRequests ?? <DefaultFormSubmissionPlaceholder />)}
          {view === "SUPPORT" && (supportRequests ?? <DefaultSupportRequestsPlaceholder />)}
          {view === "SUPPORT_CALLS" && (supportCalls ?? <DefaultSupportCallsPlaceholder />)}
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={navOpen}
        onClose={() => setNavOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiBackdrop-root": {
            top: topOffset,
            height: `calc(100vh - ${topOffset})`,
          },
          "& .MuiDrawer-paper": {
            top: topOffset,
            height: `calc(100vh - ${topOffset})`,
            width: { xs: "88vw", sm: 340 },
            maxWidth: 340,
            background: color_white,
            borderLeft: `1px solid ${color_dv_border}`,
            boxShadow: "none",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              ...REQUEST_HUB_NAV_HEADER_SX,
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                letterSpacing: "0.06em",
                color: color_dv_text_muted,
                fontSize: 12,
              }}
            >
              NAVIGATION
            </Typography>

            <IconButton
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation"
              sx={{
                width: 44,
                height: 44,
                color: color_dv_text,
                "&:hover": { background: color_dv_header_bg },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: color_dv_divider }} />

          <Box sx={{ p: 1.5, flex: 1 }}>
            <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {items.map((it) => {
                const selected = view === it.key;

                return (
                  <ListItemButton
                    key={it.key}
                    selected={selected}
                    onClick={() => handleSelect(it.key)}
                    sx={REQUEST_HUB_NAV_ITEM_SX}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: selected ? color_white : undefined,
                      }}
                    >
                      {it.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={it.label}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: 15,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

function DefaultFormSubmissionPlaceholder() {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          border: `1px dashed ${color_border}`,
          borderRadius: "12px",
          background: color_white,
          p: { xs: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 20, md: 24 },
            fontWeight: 600,
            color: color_text_primary,
            mb: 1,
          }}
        >
          Form Submission Requests
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            color: color_text_secondary,
            lineHeight: 1.7,
          }}
        >
          This section is kept as a placeholder for now.
        </Typography>
      </Box>
    </Box>
  );
}

function DefaultSupportRequestsPlaceholder() {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          border: `1px dashed ${color_border}`,
          borderRadius: "12px",
          background: color_white,
          p: { xs: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 20, md: 24 },
            fontWeight: 600,
            color: color_text_primary,
            mb: 1,
          }}
        >
          Support Requests
        </Typography>
        <Typography sx={{ fontSize: 14, color: color_text_secondary, lineHeight: 1.7 }}>
          Support requests will appear here.
        </Typography>
      </Box>
    </Box>
  );
}

function DefaultSupportCallsPlaceholder() {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          border: `1px dashed ${color_border}`,
          borderRadius: "12px",
          background: color_white,
          p: { xs: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 600, color: color_text_primary, mb: 1 }}>
          Support Calls
        </Typography>
        <Typography sx={{ fontSize: 14, color: color_text_secondary, lineHeight: 1.7 }}>
          Your support-call schedule will appear here.
        </Typography>
      </Box>
    </Box>
  );
}
