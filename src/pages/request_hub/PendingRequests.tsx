"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
  FormControlLabel,
  Switch,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import {
  color_border,
  color_background,
  color_text_primary,
  color_text_light,
  color_white,
} from "../../constants/colors";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import {
  UI_COUNT_CHIP_SX,
  UI_LIST_CARD_SX,
  UI_LIST_TITLE_SX,
  UI_LIST_TOOLBAR_SX,
  UI_ROW_ICON_BUTTON_SX,
  UI_SEARCH_FIELD_SX,
  UI_TABLE_BODY_CELL_SX,
  UI_TABLE_HEAD_CELL_SX,
} from "../../theme/ui";
import RequestDetailsModal from "./RequestDetailsModal";
import { apiUrl } from "../../config/api";

const isStoryRequest = (request: any) => String(request?.request_type || "").toLowerCase() === "achiever_story";
const requestFileLabel = (request: any) => isStoryRequest(request)
  ? request?.stories?.[0]?.file_name || "Achiever Story"
  : request?.file_name || request?.details?.[0]?.filename || "—";

const PendingRequests: React.FC = () => {
  const { data, fetchData, loading } = useFetch(
    apiUrl("file/edit/request"),
    "GET",
    false
  );

  const [requests, setRequests] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [storyRequestsOnly, setStoryRequestsOnly] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) setRequests((data as any).requests || []);
  }, [data]);

  const filtered = useMemo(() => {
    const search = searchText.toLowerCase().trim();
    const scopedRequests = storyRequestsOnly ? requests.filter(isStoryRequest) : requests;
    if (!search) return scopedRequests;

    return scopedRequests.filter((r) => {
      const createdBy = `${r.firstname || ""} ${r.lastname || ""}`.toLowerCase();
      const userName = `${r.efirstname || ""} ${r.elastname || ""}`.toLowerCase();
      const filename = requestFileLabel(r).toLowerCase();
      return createdBy.includes(search) || userName.includes(search) || filename.includes(search);
    });
  }, [requests, searchText, storyRequestsOnly]);

  const headCellSx = UI_TABLE_HEAD_CELL_SX as Record<string, unknown>;

  const bodyCellSx = { ...(UI_TABLE_BODY_CELL_SX as Record<string, unknown>), whiteSpace: "nowrap" as const };

  const fileCellSx = {
    ...bodyCellSx,
    whiteSpace: "normal" as const,
    minWidth: 220,
    maxWidth: 520,
    wordBreak: "break-word" as const,
  };

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Loader loading={loading} />

      <Paper
        elevation={0}
        sx={UI_LIST_CARD_SX}
      >
        <Box sx={UI_LIST_TOOLBAR_SX}
        >
          <Typography sx={UI_LIST_TITLE_SX}>
            Pending Requests
          </Typography>

          <TextField
            size="small"
            placeholder="Search by user/file..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={UI_SEARCH_FIELD_SX}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ fontSize: 20, color: color_text_light }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={storyRequestsOnly}
                onChange={(event) => setStoryRequestsOnly(event.target.checked)}
                inputProps={{ "aria-label": "Only show story requests" }}
              />
            }
            label="Story requests only"
            sx={{
              ml: 0,
              color: color_text_primary,
              "& .MuiFormControlLabel-label": { fontWeight: 500, fontSize: 15 },
            }}
          />
        </Box>

        <TableContainer
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            backgroundColor: color_white,
          }}
        >
          <Table stickyHeader size="small" sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={headCellSx}>User Name</TableCell>
                <TableCell sx={headCellSx}>Created By</TableCell>
                <TableCell sx={headCellSx}>File</TableCell>
                <TableCell sx={headCellSx}>Total Changes</TableCell>
                <TableCell sx={headCellSx}>Created</TableCell>
                <TableCell sx={{ ...headCellSx }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 4,
                      color: color_text_light,
                      backgroundColor: color_white,
                      borderBottom: `1px solid ${color_border}`,
                      fontSize: 15,
                    }}
                  >
                    No pending requests
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((req) => (
                  <TableRow
                    hover
                    key={req.request_id}
                    sx={{
                      "&:hover td": {
                        backgroundColor: color_background,
                      },
                    }}
                  >
                    <TableCell sx={bodyCellSx}>
                      {`${req.efirstname ?? ""} ${req.elastname ?? ""}`.trim()}
                    </TableCell>

                    <TableCell sx={bodyCellSx}>
                      {`${req.firstname ?? ""} ${req.lastname ?? ""}`.trim()}
                    </TableCell>

                    <TableCell sx={fileCellSx}>{requestFileLabel(req)}</TableCell>

                    <TableCell sx={bodyCellSx}>
                      <Chip
                        label={isStoryRequest(req)
                          ? `${req.stories?.length || 0} ${(req.stories?.length || 0) === 1 ? "story" : "stories"}`
                          : `${req.details?.length || 0} changes`}
                        size="small"
                        sx={UI_COUNT_CHIP_SX}
                      />
                    </TableCell>

                    <TableCell sx={bodyCellSx}>{req.created_at}</TableCell>

                    <TableCell sx={bodyCellSx} align="center">
                      <Tooltip title="View Request">
                        <IconButton
                          onClick={() => setSelectedRequest(req)}
                          size="small"
                          sx={UI_ROW_ICON_BUTTON_SX}
                        >
                          <VisibilityIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}

              {filtered.length > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{
                      height: 14,
                      borderBottom: "none",
                      backgroundColor: color_white,
                    }}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <RequestDetailsModal
        open={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApproved={fetchData}
      />
    </Box>
  );
};

export default PendingRequests;
