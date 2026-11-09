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
import ViewListIcon from "@mui/icons-material/ViewList";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";

import { header_height, header_mobile_height } from "../../constants/colors";
import {
  color_border,
  color_white,
  color_text_secondary,
  color_text_light,
  color_background,
} from "../../constants/colors";

import SectionSwitcher from "../shared/SectionSwitcher";
import { UI_NAV_ITEM_SX } from "../../theme/ui";

// existing components (unchanged)
import UserActivity from "./UserActivity";
import AdminFileEditRequests from "./FileActivities";
import FormSubmissionLogs from "./FormSubmissionLogs";

type ActivityView = "GENERAL" | "FILE_MANAGEMENT" | "FORM_SUBMISSION";

export default function AdminActivitiesHub() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const topOffset = isMobile ? header_mobile_height : header_height;

  const [view, setView] = useState<ActivityView>("GENERAL");
  const [navOpen, setNavOpen] = useState(false);

  const items = useMemo(
    () => [
      { key: "GENERAL" as const, label: "General logs", short: "General", icon: <ViewListIcon /> },
      { key: "FILE_MANAGEMENT" as const, label: "File management logs", short: "File management", icon: <FolderIcon /> },
      { key: "FORM_SUBMISSION" as const, label: "Form submission logs", short: "Form submissions", icon: <DescriptionIcon /> },
    ],
    []
  );

  const handleSelect = (next: ActivityView) => {
    setView(next);
    setNavOpen(false); // close on selection
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
        background: color_background,
        width: "100%",
        maxWidth: 1440,
        mx: "auto",
      }}
    >
      <SectionSwitcher
        page="User activity"
        current={items.find((it) => it.key === view)?.short ?? ""}
        onOpen={() => setNavOpen(true)}
      />

      {/* Body */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: { xs: "auto", md: "hidden" } }}>
        <Box sx={{ height: "100%", overflow: { xs: "visible", md: "hidden" } }}>
          {view === "GENERAL" && <UserActivity />}
          {view === "FILE_MANAGEMENT" && (
            <AdminFileEditRequests
              onParentModeChange={(m: any) => {
                if (m === "GENERAL") setView("GENERAL");
                if (m === "FILE_MANAGEMENT") setView("FILE_MANAGEMENT");
              }}
            />
          )}
          {view === "FORM_SUBMISSION" && <FormSubmissionLogs />}
        </Box>
      </Box>

      {/* ✅ Right Drawer Navigation (OFFSET BELOW HEADER LIKE YOUR LOGS AREA) */}
      <Drawer
        anchor="right"
        open={navOpen}
        onClose={() => setNavOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          // IMPORTANT: make BOTH drawer panel and backdrop start below header
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
            borderLeft: `1px solid ${color_border}`,
            boxShadow: "none",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: color_white,
            }}
          >
            <Typography sx={{ fontWeight: 500, letterSpacing: "0.06em", color: color_text_light, fontSize: 12 }}>
              NAVIGATION
            </Typography>

            <IconButton onClick={() => setNavOpen(false)} aria-label="Close navigation" sx={{ width: 44, height: 44 }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: color_border }} />

          {/* Items */}
          <Box sx={{ p: 1.5 }}>
            <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {items.map((it) => {
                const selected = view === it.key;
                return (
                  <ListItemButton
                    key={it.key}
                    selected={selected}
                    onClick={() => handleSelect(it.key)}
                    sx={UI_NAV_ITEM_SX}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: selected ? color_white : color_text_secondary,
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