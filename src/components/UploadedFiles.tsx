import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
  TextField,
  Chip,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockIcon from "@mui/icons-material/Lock";
import SearchIcon from "@mui/icons-material/Search";

import { useDispatch, useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import { AppDispatch } from "../store/store";
import { setFiles } from "../store/auth/fileSlice";
import AccessModal from "./models/access_model/AccessManagementModal";
import FileVersionHistoryModal from "./models/FileHistoryModal";
import ReplaceFileModal from "./models/ReplaceFileModal";
import ConfirmModal from "./models/ConfirmModal";
import Loader from "./Loader";
import toast from "react-hot-toast";
import { apiUrl } from "../config/api";

import {
  UI_LIST_CARD_SX,
  UI_LIST_TITLE_SX,
  UI_LIST_TOOLBAR_SX,
  UI_SEARCH_FIELD_SX,
  UI_TABLE_HEAD_CELL_SX,
} from "../theme/ui";
import {
  color_dv_chip_bg,
  color_dv_control_border,
  color_dv_divider,
  color_dv_header_bg,
  color_dv_primary,
  color_dv_text,
  color_dv_text_muted,
} from "../constants/colors";

// Row action buttons: 40px outline squares with navy icons
const ACTION_BTN_SX = {
  width: 40,
  height: 40,
  borderRadius: "10px",
  border: `1px solid ${color_dv_control_border}`,
  background: "#fff",
  color: color_dv_primary,
  "&:hover": { background: color_dv_header_bg },
};

const UploadedFiles: React.FC = () => {
  const { files: rows } = useSelector((state: any) => state.file);
  const dispatch = useDispatch<AppDispatch>();

  const { data: deletedFile, fetchData: deleteFile, loading: dloading } = useFetch(
    apiUrl("file"),
    "DELETE",
    false
  );

  const { data: newFiles, fetchData: getFile, loading: galoading } = useFetch(
    apiUrl("file"),
    "GET",
    false
  );

  const { data: updatedFiles, fetchData: resetFile, loading: ploading } = useFetch(
    apiUrl("file/reset"),
    "PUT",
    false
  );

  const loading = dloading || galoading || ploading;

  const [searchText, setSearchText] = useState("");
  const [openAccess, setOpenAccess] = useState(false);
  const [openHisory, setOpenHistory] = useState(false);
  const [openReplaceFile, setOpenReplaceFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openRestoreConfirm, setOpenRestoreConfirm] = useState(false);

  const onDelete = () => deleteFile(null, { id: selectedFile?.id });
  const onRestore = () => resetFile(null, { id: selectedFile?.id });

  useEffect(() => {
    if (deletedFile) toast.success((deletedFile as any).message);
  }, [deletedFile]);

  useEffect(() => {
    if (updatedFiles) toast.success((updatedFiles as any).message);
  }, [updatedFiles]);

  useEffect(() => {
    if (deletedFile || updatedFiles) {
      closeOpenDeleteModal();
      closeRestoreConfirmModal();
      getFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedFile, updatedFiles]);

  useEffect(() => {
    if (newFiles) dispatch(setFiles({ files: (newFiles as any).files }));
  }, [newFiles, dispatch]);

  const openAccessModal = (file: any) => {
    setOpenAccess(true);
    setSelectedFile(file);
  };

  const closeAccessModal = () => {
    setOpenAccess(false);
    setSelectedFile(null);
  };

  const closeHistory = () => {
    setOpenHistory(false);
    setSelectedFile(null);
  };

  const closeReplaceFile = () => {
    setOpenReplaceFile(false);
    setSelectedFile(null);
  };

  const openReplaceFilemodal = (file: any) => {
    setOpenReplaceFile(true);
    setSelectedFile(file);
  };

  const openHisoryModal = (file: any) => {
    setOpenHistory(true);
    setSelectedFile(file);
  };

  const openConfirmDeleteModal = (file: any) => {
    setSelectedFile(file);
    setOpenDeleteConfirm(true);
  };

  const closeOpenDeleteModal = () => {
    setSelectedFile(null);
    setOpenDeleteConfirm(false);
  };

  const openRestoreConfirmModal = (file: any) => {
    setSelectedFile(file);
    setOpenRestoreConfirm(true);
  };

  const closeRestoreConfirmModal = () => {
    setSelectedFile(null);
    setOpenRestoreConfirm(false);
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${safe})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <span key={i} style={{ backgroundColor: "rgba(255, 230, 130, 0.85)" }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const filteredRows = useMemo(() => {
    const search = searchText.toLowerCase().trim();
    if (!search) return rows;

    return rows?.filter((row: any) => {
      const fileName = String(row.filename || "").toLowerCase();
      const insertedBy = String(row.inserted_by || "").toLowerCase();
      const createdAt = String(row.created_at || "").toLowerCase();
      const fullName = String(`${row.firstname || ""} ${row.lastname || ""}`).toLowerCase();
      return fileName.includes(search) || insertedBy.includes(search) || createdAt.includes(search) || fullName.includes(search);
    });
  }, [rows, searchText]);

  return (
    <>
      <Loader loading={loading} />

      {openAccess && (
        <AccessModal
          file={{ fileId: selectedFile?.id, fileName: selectedFile?.fileName }}
          open={openAccess}
          onClose={closeAccessModal}
        />
      )}

      {openHisory && (
        <FileVersionHistoryModal
          open={openHisory}
          onClose={closeHistory}
          file={{ id: selectedFile?.id, filename: selectedFile?.filename }}
        />
      )}

      {openReplaceFile && (
        <ReplaceFileModal
          refresh={getFile}
          open={openReplaceFile}
          onClose={closeReplaceFile}
          file={{ id: selectedFile?.id, filename: selectedFile?.filename, version: selectedFile?.version }}
        />
      )}

      {openDeleteConfirm && (
        <ConfirmModal
          open={openDeleteConfirm}
          text="Delete this file? Customers won’t be able to access it until you restore it."
          onConfirm={onDelete}
          onCancel={closeOpenDeleteModal}
        />
      )}

      {openRestoreConfirm && (
        <ConfirmModal
          open={openRestoreConfirm}
          text="Are you sure you want to restore this file? Customers will be able to view it again."
          onConfirm={onRestore}
          onCancel={closeRestoreConfirmModal}
        />
      )}

      {/*  Portal table card */}
      <Paper
        elevation={0}
        sx={UI_LIST_CARD_SX}
      >
        {/* Header row */}
        <Box
          sx={UI_LIST_TOOLBAR_SX}
        >
          <Box sx={{ minWidth: 0, flex: "1 1 260px" }}>
            <Typography sx={UI_LIST_TITLE_SX}>
              Uploaded Files
            </Typography>
            <Typography sx={{ fontSize: 14, color: color_dv_text_muted, mt: 0.25, lineHeight: 1.45 }}>
              Manage visibility, versions, and access. Deleted files can be restored.
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="Search files..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={UI_SEARCH_FIELD_SX}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Scroll area */}
        <TableContainer
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            pb: 2,
            background: "#fff",
          }}
        >
          <Table stickyHeader size="small" sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                {[
                  "File name",
                  "Version",
                  "Size (MB)",
                  "Row count",
                  "Inserted by",
                  "Created date",
                  "Type / status",
                  "Actions",
                ].map((h, idx) => (
                  <TableCell
                    key={h}
                    align={idx === 7 ? "right" : "left"}
                    sx={UI_TABLE_HEAD_CELL_SX}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, fontSize: 15, color: color_dv_text_muted }}>
                    No files found
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {filteredRows?.map((row: any) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        "& td": {
                          borderBottom: `1px solid ${color_dv_divider}`,
                          fontSize: 14,
                          color: color_dv_text,
                          py: 1.25,
                          px: 2,
                        },
                        backgroundColor: row.is_delete ? "rgba(220, 53, 69, 0.06)" : "#fff",
                      }}
                    >
                      <TableCell sx={{ minWidth: 240, maxWidth: 520, whiteSpace: "normal", overflowWrap: "anywhere", fontWeight: 500 }}>
                        {highlightMatch(String(row.filename || ""), searchText)}
                      </TableCell>
                      <TableCell>{highlightMatch(String(row.version || ""), searchText)}</TableCell>
                      <TableCell>{highlightMatch(String(row.size || ""), searchText)}</TableCell>
                      <TableCell>{highlightMatch(String(row.rows || ""), searchText)}</TableCell>
                      <TableCell>
                        {highlightMatch(String(`${row.firstname || ""} ${row.lastname || ""}`.trim()), searchText)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{highlightMatch(String(row.created_at || ""), searchText)}</TableCell>

                      <TableCell>
                        {row.is_delete ? (
                          <Chip
                            label="Deleted"
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: 13,
                              fontWeight: 500,
                              borderRadius: "999px",
                              background: "rgba(220,53,69,0.14)",
                              color: "#b42318",
                            }}
                          />
                        ) : row.private ? (
                          <Chip
                            label="Private"
                            size="small"
                            icon={<LockIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              height: 24,
                              fontSize: 13,
                              fontWeight: 500,
                              borderRadius: "999px",
                              background: "#FDECEE",
                              color: "#8B1E2D",
                              "& .MuiChip-icon": { color: "#8B1E2D" },
                            }}
                          />
                        ) : (
                          <Chip
                            label="Public"
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: 13,
                              fontWeight: 500,
                              borderRadius: "999px",
                              background: color_dv_chip_bg,
                              color: color_dv_primary,
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell align="right" sx={{ p: 1 }}>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", width: "100%", alignItems: "center" }}>
                          {!row.is_delete ? (
                            <>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  sx={ACTION_BTN_SX}
                                  onClick={() => openConfirmDeleteModal(row)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Replace">
                                <IconButton
                                  onClick={() => openReplaceFilemodal(row)}
                                  size="small"
                                  sx={ACTION_BTN_SX}
                                >
                                  <SwapHorizIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="History">
                                <IconButton
                                  onClick={() => openHisoryModal(row)}
                                  size="small"
                                  sx={ACTION_BTN_SX}
                                >
                                  <AccessTimeIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {row.private && (
                                <Tooltip title="Assign to user">
                                  <IconButton
                                    onClick={() => openAccessModal(row)}
                                    size="small"
                                    sx={ACTION_BTN_SX}
                                  >
                                    <PersonAddIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </>
                          ) : (
                            <Tooltip title="Restore">
                              <IconButton
                                size="small"
                                sx={ACTION_BTN_SX}
                                onClick={() => openRestoreConfirmModal(row)}
                              >
                                <RestoreIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Spacer row ensures last item never clipped */}
                  <TableRow>
                    <TableCell colSpan={8} sx={{ height: 14, borderBottom: "none" }} />
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default UploadedFiles;
