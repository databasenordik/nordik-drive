import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setSelectedFile } from "../../store/auth/fileSlice";
import { apiUrl } from "../../config/api";

import {
  header_height,
  header_mobile_height,
  color_white,
  color_focus_ring,
  color_overlay_white_80,
} from "../../constants/colors";

import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import PasswordModal from "../../components/models/PasswordModal";

interface FileType {
  filename: string;
  version: string;
  private: boolean;
  community_filter: boolean;
  id: number;
}

// Background photo tint keeps its original blue/burgundy wash.
const ORIGINAL_BLUE = "#004B9C";
const ORIGINAL_BURGUNDY = "#A61D33";

const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const FileList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { loading, fetchData, data: files } = useFetch<{ files: FileType[] }>(
    apiUrl("file"),
    "GET",
    false
  );

  const { selectedFile } = useSelector((state: RootState) => state.file);

  const [voiceEnabled] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const speak = (text: string) => {
    if (voiceEnabled && window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    }
  };

  const openPasswordModal = () => {
    setPasswordModalOpen(true);
  };

  const closePasswordModal = (success: boolean) => {
    if (success) {
      setPasswordModalOpen(false);
      navigate("/dataview");
      speak(`Selected file ${selectedFile?.filename}`);
    } else {
      dispatch(setSelectedFile({ selected: null }));
      setPasswordModalOpen(false);
    }
  };

  const onSelectFile = (file: FileType) => {
    if (file.private) {
      openPasswordModal();
      dispatch(
        setSelectedFile({
          selected: {
            filename: file.filename,
            id: file.id,
            version: file.version,
            community_filter: file.community_filter,
          },
        })
      );
    } else {
      dispatch(
        setSelectedFile({
          selected: {
            filename: file.filename,
            id: file.id,
            version: file.version,
            community_filter: file.community_filter,
          },
        })
      );
      speak(`Selected file ${file.filename}`);
      navigate("/dataview");
    }
  };

  const allFiles = useMemo(() => files?.files || [], [files]);
  const publicFiles = useMemo(() => allFiles.filter((f) => !f.private), [allFiles]);
  const confidentialFiles = useMemo(() => allFiles.filter((f) => f.private), [allFiles]);

  // Public = soft blue, Confidential = soft burgundy (matches the file-card design)
  const FILE_TONES = {
    public: { tint: "#E3ECFB", icon: "#1D4ED8", badgeText: "#1E3A8A" },
    confidential: { tint: "#FDE4E6", icon: "#A61D33", badgeText: "#A61D33" },
  } as const;

  const renderFileCard = (file: FileType, isConfidential: boolean) => {
    const isSelected = file.filename === selectedFile?.filename;
    const tone = isConfidential ? FILE_TONES.confidential : FILE_TONES.public;

    const a11yLabel = `${file.filename}. ${isConfidential ? "Confidential" : "Public"}. ${
      isSelected ? "Selected" : "Not selected"
    }.`;

    return (
      <Card
        role="button"
        key={file.filename}
        aria-label={a11yLabel}
        aria-pressed={isSelected}
        tabIndex={0}
        onClick={() => onSelectFile(file)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectFile(file);
          }
        }}
        onFocus={() => speak(`${file.filename}, ${isConfidential ? "Confidential" : "Public"}`)}
        elevation={0}
        sx={{
          cursor: "pointer",
          borderRadius: "8px",
          backgroundColor: color_white,
          border: "1px solid #E5E9F0",
          boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
          outline: isSelected ? "2px dashed #93B4F0" : "none",
          outlineOffset: "3px",
          transition: "box-shadow 0.15s ease, border-color 0.15s ease",
          "&:hover": {
            borderColor: "#D5DCE6",
            boxShadow: "0 6px 18px rgba(16, 24, 40, 0.10)",
          },
          "&:focus-visible": {
            outline: `3px solid ${color_focus_ring}`,
            outlineOffset: "3px",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            "&:last-child": { pb: 2 },
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              backgroundColor: tone.tint,
              color: tone.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isConfidential ? <LockIcon /> : <FolderIcon />}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "0.95rem",
                mb: 0.5,
                color: "#111827",
                wordBreak: "break-word",
              }}
            >
              {file.filename}
            </Typography>

            <Chip
              label={isConfidential ? "Confidential" : "Public"}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.7rem",
                fontWeight: 600,
                backgroundColor: tone.tint,
                color: tone.badgeText,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const sectionTitleSx = {
    mb: 2.5,
    fontSize: { xs: "1.6rem", sm: "1.9rem" },
    fontWeight: 700,
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  } as const;

  const SectionIcon = ({ confidential }: { confidential: boolean }) => {
    const tone = confidential ? FILE_TONES.confidential : FILE_TONES.public;
    return (
      <Box
        aria-hidden="true"
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          backgroundColor: tone.tint,
          color: tone.icon,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          "& svg": { fontSize: 18 },
        }}
      >
        {confidential ? <LockIcon /> : <FolderIcon />}
      </Box>
    );
  };

  return (
    <>
      <Loader loading={loading} />

      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",

          // Keep background image and overlay exactly as you have it
          backgroundImage: `
            linear-gradient(
              135deg,
              ${hexToRgba(ORIGINAL_BLUE, 0.1)} 0%,
              ${hexToRgba(ORIGINAL_BURGUNDY, 0.06)} 25%,
              ${hexToRgba(ORIGINAL_BLUE, 0.04)} 50%,
              ${hexToRgba(ORIGINAL_BURGUNDY, 0.08)} 75%,
              ${hexToRgba(ORIGINAL_BLUE, 0.05)} 100%
            ),
            url("Copy of 2018 Reunion.jpg")
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",

          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: color_overlay_white_80,
            zIndex: 0,
          },

          "& > *": {
            position: "relative",
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            pt: {
              xs: `calc(${header_mobile_height} + 1.25rem)`,
              md: `calc(${header_height} + 1.25rem)`,
            },
            pb: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Public Section */}
          {publicFiles.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Typography component="h1" sx={sectionTitleSx}>
                <SectionIcon confidential={false} />
                Community Records
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {publicFiles.map((file) => renderFileCard(file, false))}
              </Box>
            </Box>
          )}

          {/* Confidential Section */}
          {confidentialFiles.length > 0 && (
            <Box>
              <Typography component="h2" sx={sectionTitleSx}>
                <SectionIcon confidential />
                <span>
                  Community Records{" "}
                  <Box component="span" sx={{ color: "#6B7280", fontWeight: 600 }}>
                    (Confidential)
                  </Box>
                </span>
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {confidentialFiles.map((file) => renderFileCard(file, true))}
              </Box>
            </Box>
          )}

          {passwordModalOpen && (
            <PasswordModal open={passwordModalOpen} closePasswordModal={closePasswordModal} />
          )}
        </Container>
      </Box>
    </>
  );
};

export default FileList;
