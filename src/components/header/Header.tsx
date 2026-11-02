import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { useState } from "react";
import "./Header.scss";
import HeaderNav from "../header_nav/HeaderNav";
import Logout from "../logout/Logout";
import { NavContainer } from "../NavContainer";

import { useTheme, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../hooks/useFetch";
import { apiUrl } from "../../config/api";
import {
  color_nav_active,
  color_nav_bg,
  color_nav_border,
  color_nav_text,
  color_nav_wordmark,
} from "../../constants/colors";

const hasExternalScheme = (value: string) =>
  /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(value) || /^[a-z][a-z\d+\-.]*:/i.test(value);

const normalizeInternalPath = (value: string) => {
  if (!value) return "";
  if (/^[?#]/.test(value)) return value;
  return value.startsWith("/") ? value : `/${value}`;
};

const normalizeConfigValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

type LogoContentResponse =
  | string
  | {
      html?: string;
      content?: string;
      data?: string;
    };

const extractHtml = (payload: LogoContentResponse | null) => {
  if (typeof payload === "string") return payload.trim();
  if (!payload || typeof payload !== "object") return "";

  if (typeof payload.html === "string") return payload.html.trim();
  if (typeof payload.content === "string") return payload.content.trim();
  if (typeof payload.data === "string") return payload.data.trim();

  return "";
};

const AppToolbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { selectedFile } = useSelector((state: RootState) => state.file);
  const configFileName = (selectedFile?.filename || "").trim();
  const configEntry = useSelector((state: RootState) =>
    configFileName ? state.api.entries[`config_${configFileName}`] : null
  );
  const configJson = (configEntry?.data as any)?.config || null;
  const fileLogo = normalizeConfigValue(configJson?.logo);
  const logoNavigationLink = normalizeConfigValue(configJson?.logo_navigation_link);
  const partnerLogo = (
    <img
      src={fileLogo}
      alt={`${selectedFile?.filename || "Selected file"} partner logo`}
      style={{
        height: isMobile ? "2.75rem" : "3.75rem",
        width: "auto",
        objectFit: "contain",
      }}
    />
  );

  const handleContentNavigation = async () => {
    const fileId = selectedFile?.id;
    if (!fileId || contentLoading) return;

    try {
      setContentLoading(true);
      const response = await apiRequest<LogoContentResponse>(apiUrl(`logo-content/${fileId}`), "GET");
      const htmlContent = extractHtml(response);

      if (!htmlContent) return;

      navigate("/file-content", {
        state: {
          htmlContent,
          fileId,
          pageTitle: selectedFile?.filename ? `${selectedFile.filename} content page` : "File content page",
        },
      });
    } catch {
      // If the API returns no content or 404, keep the user on the current page.
    } finally {
      setContentLoading(false);
    }
  };

  const drawer = (
    <Box
      sx={{
        width: 260,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        py: 2,
        px: 1.5,
      }}
    >
      <HeaderNav onLinkClick={() => setMobileOpen(false)} />

      {/* Logout only in drawer for mobile */}
      {isMobile && (
        <Box mt={2}>
          <Logout />
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: color_nav_bg,
          color: color_nav_text,
          borderBottom: `1px solid ${color_nav_border}`,
          boxShadow: "none",
          zIndex: 1300,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: "100%",
            maxWidth: 1360,
            mx: "auto",
            px: { xs: 1.5, sm: 3 },
            minHeight: { xs: 56, sm: 72 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* LEFT: Shingwauk logo + wordmark (+ optional partner logo) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: { xs: "0 0 auto", md: "1 1 0" },
              minWidth: 0,
            }}
          >
            <Box
              component="a"
              href="https://childrenofshingwauk.org/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                borderRadius: "8px",
                "&:focus-visible": {
                  outline: `3px solid ${color_nav_active}`,
                  outlineOffset: "2px",
                },
              }}
            >
              <Box
                component="img"
                src="/logo-1.png"
                alt="Children of Shingwauk Alumni Association"
                sx={{
                  width: { xs: 42, sm: 58 },
                  height: { xs: 44, sm: 60 },
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />
              <Box
                aria-hidden="true"
                sx={{
                  display: { xs: "none", lg: "flex" },
                  flexDirection: "column",
                  gap: "2px",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  lineHeight: 1.25,
                  color: color_nav_wordmark,
                  whiteSpace: "nowrap",
                }}
              >
                <span>Children of Shingwauk</span>
                <span>Alumni Association</span>
              </Box>
            </Box>

            {fileLogo && (
              logoNavigationLink ? (
                hasExternalScheme(logoNavigationLink) ? (
                  <a
                    href={logoNavigationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="partner-logo-external-link"
                  >
                    {partnerLogo}
                  </a>
                ) : (
                  <Link to={normalizeInternalPath(logoNavigationLink)}>
                    {partnerLogo}
                  </Link>
                )
              ) : (
                <Box
                  component="button"
                  type="button"
                  onClick={handleContentNavigation}
                  disabled={!selectedFile?.id || contentLoading}
                  aria-label={`${selectedFile?.filename || "Selected file"} content logo`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    background: "transparent",
                    border: 0,
                    padding: 0,
                    cursor: !selectedFile?.id || contentLoading ? "default" : "pointer",
                  }}
                >
                  {partnerLogo}
                </Box>
              )
            )}
          </Box>

          {/* CENTER: navigation (desktop / tablet) */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
              flex: "0 1 auto",
              minWidth: 0,
            }}
          >
            <NavContainer>
              <HeaderNav />
            </NavContainer>
          </Box>

          {/* RIGHT: Nordik logo + account */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1.5,
              flex: { xs: "0 1 auto", md: "1 1 0" },
              minWidth: 0,
            }}
          >
            <Box
              component="a"
              href="https://nordikinstitute.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
                "&:focus-visible": {
                  outline: `3px solid ${color_nav_active}`,
                  outlineOffset: "2px",
                },
              }}
            >
              <Box
                component="img"
                src="https://nordikinstitute.com/wp-content/uploads/2020/04/NordikFinalLogo-640x160.png"
                alt="Nordik Institute"
                sx={{
                  width: "auto",
                  height: { xs: 32, sm: 44 },
                  maxWidth: { xs: 128, sm: 176 },
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Account menu in the bar on tablet/desktop; in the drawer on mobile */}
            {!isMobile && <Logout />}

            {/* Mobile menu button */}
            <IconButton
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                display: { sm: "none" },
                width: 44,
                height: 44,
                color: color_nav_active,
                "&:focus-visible": {
                  outline: `3px solid ${color_nav_active}`,
                  outlineOffset: "2px",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 260,
            top: { xs: 56, sm: 72 },
            height: { xs: "calc(100% - 56px)", sm: "calc(100% - 72px)" },
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AppToolbar;
