// ==============================
// AdminPanel.tsx (FULL CODE)
// ==============================
import React, { useEffect, useMemo, useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setFiles } from "../../store/auth/fileSlice";

import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import FileUploader from "../../components/FileUploader";
import UploadedFiles from "../../components/UploadedFiles";
import {
  color_primary,
  color_dv_border,
  color_dv_divider,
  color_dv_page,
  color_dv_text_muted,
  header_height,
  header_mobile_height,
} from "../../constants/colors";
import { apiUrl } from "../../config/api";

//  Keep your wrapper if you already use it elsewhere; otherwise remove
import { AdminPanelWrapper } from "../../components/Wrappers";

const AdminPanel = () => {
  const [tab, setTab] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { loading, data: files } = useFetch(
    apiUrl("file"),
    "GET",
    true
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (files) dispatch(setFiles({ files: (files as any).files }));
  }, [files, dispatch]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  //  IMPORTANT: prevent outer (page) scroll on this screen
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  const top = useMemo(() => (isMobile ? header_mobile_height : header_height), [isMobile]);

  return (
    <>
      <Loader loading={loading} />

      <AdminPanelWrapper>
        {/*  Fixed workspace area below header (no page scroll) */}
        <Box
          data-testid="admin-workspace"
          sx={{
            position: "fixed",
            top,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            px: { xs: 1.25, md: 3 },
            py: { xs: 1.25, md: 2 },
            boxSizing: "border-box",
            background: color_dv_page, // page background (navy design)
          }}
        >
          <Box
            sx={{
              height: "100%",
              maxWidth: 1400,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            {/*  Portal shell */}
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                minHeight: 0,
                borderRadius: "12px",
                overflow: "hidden",
                border: `1px solid ${color_dv_border}`,
                background: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Top "workspace header" (matches your UX vibe) */}
              

              {/* Tabs row (clean + flat) */}
              <Box
                sx={{
                  flexShrink: 0,
                  borderBottom: `1px solid ${color_dv_divider}`,
                  background: "#fff",
                  px: { xs: 1.5, md: 2.5 },
                }}
              >
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v)}
                  sx={{
                    minHeight: 52,
                    "& .MuiTab-root": {
                      minHeight: 52,
                      fontWeight: 500,
                      textTransform: "none",
                      px: 2,
                      letterSpacing: 0,
                      color: color_dv_text_muted,
                      fontSize: 15,
                    },
                    "& .Mui-selected": { color: color_primary, fontWeight: 600 },
                    "& .MuiTabs-indicator": {
                      backgroundColor: color_primary,
                      height: 3,
                      borderRadius: 3,
                    },
                  }}
                >
                  <Tab label="Upload File" />
                  <Tab label="Uploaded Files" />
                </Tabs>
              </Box>

              {/* Content region: ONLY this area can scroll internally */}
              <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", p: { xs: 1.5, md: 2.5 } }}>
                {tab === 0 && (
                  <Box sx={{ height: "100%", minHeight: 0, overflow: "auto" }}>
                    <FileUploader />
                  </Box>
                )}

                {tab === 1 && (
                  <Box sx={{ height: "100%", minHeight: 0, overflow: "hidden" }}>
                    <UploadedFiles />
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </AdminPanelWrapper>
    </>
  );
};

export default AdminPanel;
