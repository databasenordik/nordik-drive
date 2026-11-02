"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CardHeader from "./CardHeader";
import {
  color_border,
  color_light_gray,
  color_secondary,
  color_secondary_dark,
  color_text_primary,
  color_warning_light,
  color_white,
  color_white_smoke,
  dark_grey,
  color_focus_ring,
} from "../../../constants/colors";
import { MAX_PHOTOS } from "./constants";
import { bytesToMB, clamp, getTotalBytes } from "./utils";
import {
  getPhotoCombinedUploadText,
  getPhotoUploadAltText,
  getPhotoUploadDefaultDescription,
  getPhotoUploadLimitText,
  getPhotoUploadWarningText,
  PHOTO_UPLOAD_COMMENT_LABEL,
  PHOTO_UPLOAD_COMMENT_PLACEHOLDER,
  PHOTO_UPLOAD_FALLBACK_TITLE,
  PHOTO_UPLOAD_SELECT_LABEL,
} from "./messages";
import { ADD_INFO_ADD_BUTTON_SX, ADD_INFO_CARD_SX, ADD_INFO_CONSENT_TEXT_SX } from "./styles";
import UploadDisclaimer from "./UploadDisclaimer";

export type PhotoItem = {
  id: string;
  file: File;
  comment: string;
};

type UploadConfig = {
  name?: string;
  display_name?: string;
  description?: string;
  consent?: string;
  disclaimer?: string;
  docs_count_enabled?: boolean;
  total_upload_size?: boolean;
  individual_upload_size?: boolean;
};

type Props = {
  photos: PhotoItem[];
  setPhotos: (next: PhotoItem[]) => void;
  totalCombinedMB: number;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (idx: number) => void;
  consent: boolean;
  setConsent: (v: boolean) => void;
  disabled?: boolean;
  config?: UploadConfig;
};

function PhotoPreview({
  file,
  alt,
}: {
  file: File;
  alt: string;
}) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      width={140}
      height={110}
      style={{
        borderRadius: 10,
        border: `1px solid ${color_border}`,
        objectFit: "cover",
        background: color_white_smoke,
        display: "block",
      }}
    />
  );
}

export default function PhotoUploadCard({
  photos,
  setPhotos,
  totalCombinedMB,
  onUpload,
  onRemove,
  consent,
  setConsent,
  disabled = false,
  config,
}: Props) {
  const totalPhotoMB = bytesToMB(getTotalBytes(photos.map((p) => p.file)));

  const title = String(config?.display_name || config?.name || PHOTO_UPLOAD_FALLBACK_TITLE);
  const description = String(config?.description || getPhotoUploadDefaultDescription());
  const consentText = String(config?.consent || "").trim();
  const disclaimerText = String(config?.disclaimer || "").trim();

  const showCount = config?.docs_count_enabled !== false;
  const showTotal = config?.total_upload_size !== false;

  const warning = useMemo(() => {
    const percentUsed = (photos.length / MAX_PHOTOS) * 100;
    const text = getPhotoUploadWarningText(percentUsed);
    return text ? { bg: color_warning_light, text } : null;
  }, [photos.length]);

  const onChangeComment = (idx: number, value: string) => {
    if (disabled) return;
    setPhotos(photos.map((p, i) => (i === idx ? { ...p, comment: value } : p)));
  };

  return (
    <Box
      sx={{
        ...ADD_INFO_CARD_SX,
        opacity: disabled ? 0.9 : 1,
      }}
    >
      <CardHeader icon={<PhotoOutlinedIcon />} title={title}>
        {description}
        {(showCount || showTotal) && showTotal ? (
          <>
            <br />
            <b style={{ fontWeight: 500 }}>Total upload (photos + docs):</b>{" "}
            {getPhotoCombinedUploadText(totalCombinedMB).replace("Total upload (photos + docs): ", "")}
          </>
        ) : null}
      </CardHeader>

      <Button
        disabled={disabled}
        component="label"
        startIcon={<FileUploadOutlinedIcon sx={{ fontSize: "18px !important" }} />}
        sx={ADD_INFO_ADD_BUTTON_SX}
      >
        {PHOTO_UPLOAD_SELECT_LABEL}
        <input type="file" hidden accept="image/*" multiple onChange={onUpload} />
      </Button>

      {photos.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
          {photos.map((p, idx) => (
            <Box key={p.id} sx={{ position: "relative", width: 140 }}>
              <PhotoPreview
                file={p.file}
                alt={p.file?.name || getPhotoUploadAltText(idx)}
              />

              <IconButton
                disabled={disabled}
                aria-label={`Remove photo ${idx + 1}`}
                onClick={() => !disabled && onRemove(idx)}
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 32,
                  height: 32,
                  background: "#FFFFFF",
                  color: color_text_primary,
                  border: `1px solid ${color_border}`,
                  boxShadow: "0 2px 6px rgba(16,24,40,0.12)",
                  "&:hover": { background: "#F7F8FA" },
                  "&:focus-visible": { outline: `3px solid ${color_focus_ring}`, outlineOffset: "2px" },
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>

              <Box sx={{ mt: 1 }}>
                <TextField
                  disabled={disabled}
                  label={PHOTO_UPLOAD_COMMENT_LABEL}
                  value={p.comment || ""}
                  onChange={(e) => onChangeComment(idx, e.target.value)}
                  placeholder={PHOTO_UPLOAD_COMMENT_PLACEHOLDER}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={3}
                  inputProps={{ maxLength: 100 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      background: color_white,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: color_border,
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: color_focus_ring,
                      borderWidth: "2px",
                    },
                    "& .MuiFormHelperText-root": {
                      marginLeft: 0,
                      color: "#5B6475",
                      fontWeight: 400,
                    },
                  }}
                  helperText={`${(p.comment || "").length}/100`}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {showCount && (
        <Box sx={{ mt: 2, color: "#5B6475", fontSize: 13, fontWeight: 500 }}>
          {getPhotoUploadLimitText(photos.length, totalPhotoMB)}
          <Box
            sx={{
              mt: 0.75,
              height: 6,
              width: "100%",
              background: "#EDF0F3",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${clamp((photos.length / MAX_PHOTOS) * 100, 0, 100)}%`,
                background: "#1F3A6E",
              }}
            />
          </Box>
        </Box>
      )}

      {warning ? (
        <Box
          sx={{
            mt: 1.5,
            p: 1.25,
            borderRadius: "10px",
            background: warning.bg,
            border: "1px solid #F0D9A0",
            color: color_text_primary,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {warning.text}
        </Box>
      ) : null}

      {consentText ? (
        <Box component="label" sx={{ mt: 2, display: "flex", gap: 1.25, alignItems: "flex-start", cursor: "pointer" }}>
          <input
            type="checkbox"
            disabled={disabled}
            checked={consent}
            onChange={(e) => !disabled && setConsent(e.target.checked)}
            style={{ width: 20, height: 20, margin: "1px 0 0", accentColor: "#1F3A6E", flexShrink: 0, cursor: "pointer" }}
          />
          <Box component="span" sx={ADD_INFO_CONSENT_TEXT_SX}>
            {consentText}
          </Box>
        </Box>
      ) : null}

      {consent && disclaimerText ? (
        <UploadDisclaimer text={disclaimerText} />
      ) : null}
    </Box>
  );
}
