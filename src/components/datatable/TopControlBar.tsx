"use client";

import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Download,
  Mic,
  MicOff,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import NiaMark from "../nia/NiaMark";
import { clearSelectedFile } from "../../store/auth/fileSlice";
import { useDispatch } from "react-redux";


type Props = {
  isMobile: boolean;
  gridApi: any;

  searchText: string;
  setSearchText: (v: string) => void;

  matchesCount: number;
  currentMatchIndex: number;

  onNavigateMatch: (dir: "next" | "prev") => void;

  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  recognitionRef: React.MutableRefObject<any>;

  onSearch: (termOverride?: string) => void;

  fontSize: number;
  onZoomChange: (newSize: number) => void;

  setNiaOpen: (v: boolean) => void;
  niaUnreadCount: number;
};

export default function TopControlsBar({
  isMobile,
  gridApi,
  searchText,
  setSearchText,
  matchesCount,
  currentMatchIndex,
  onNavigateMatch,
  isRecording,
  setIsRecording,
  recognitionRef,
  onSearch,
  fontSize,
  onZoomChange,
  setNiaOpen,
  niaUnreadCount,
}: Props) {
  const resultsText = useMemo(() => {
    return matchesCount > 0 ? `${currentMatchIndex + 1} of ${matchesCount}` : "0 results";
  }, [matchesCount, currentMatchIndex]);

  const dispatch = useDispatch();

  const [totalRecords, setTotalRecords] = useState(0);

  const recomputeTotalRecords = useCallback(() => {
    if (!gridApi) {
      setTotalRecords(0);
      return;
    }

    let count = 0;
    gridApi.forEachNode((node: any) => {
      if (node?.data) count += 1; // only real rows
    });

    setTotalRecords(count);
  }, [gridApi]);

  useEffect(() => {
    recomputeTotalRecords();
    if (!gridApi) return;

    const handler = () => recomputeTotalRecords();

    gridApi.addEventListener("modelUpdated", handler);
    gridApi.addEventListener("rowDataUpdated", handler);

    return () => {
      gridApi.removeEventListener("modelUpdated", handler);
      gridApi.removeEventListener("rowDataUpdated", handler);
    };
  }, [gridApi, recomputeTotalRecords]);

  const totalRecordsText = useMemo(() => {
    const formatted = new Intl.NumberFormat().format(totalRecords);
    return `${formatted} ${totalRecords === 1 ? "record" : "records"}`;
  }, [totalRecords]);

  const clearSearch = useCallback(() => {
    setSearchText("");
    onSearch("");
  }, [onSearch, setSearchText]);


  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
      onSearch(transcript);
    };
    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const handleDownload = async () => {
    if (!gridApi) return;

    const XLSX = await import("xlsx");

    let totalRows: any[] = [];
    let rowDataToExport: any[] = [];

    gridApi.forEachNode((node: any) => {
      if (node.data) totalRows.push(node.data);
    });
    gridApi.forEachNodeAfterFilterAndSort((node: any) => {
      if (node.data) rowDataToExport.push(node.data);
    });

    const isFiltered = rowDataToExport.length !== totalRows.length;

    const worksheet = XLSX.utils.json_to_sheet(rowDataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, isFiltered ? "filtered_data.xlsx" : "all_data.xlsx");
  };

  const hasSearch = searchText.trim().length > 0;

  return (
    <section className="top-controls-bar" aria-label="Search and tools">
      {/* Back to files */}
      <button
        type="button"
        className="dv-btn"
        onClick={() => {
          dispatch(clearSelectedFile());
          window.history.back();
        }}
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Files
      </button>

      {/* Search field with result count + navigation */}
      <div className={`dv-search${isMobile ? " dv-search-mobile" : ""}`}>
        <button type="button" className="dv-icon-btn dv-search-go" aria-label="Search" onClick={() => onSearch()}>
          <Search size={18} aria-hidden="true" />
        </button>
        <label htmlFor="dv-search-input" className="dv-visually-hidden">
          Search records
        </label>
        <input
          id="dv-search-input"
          type="text"
          className="dv-search-input"
          placeholder="Search records..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
        <span className="dv-search-count" aria-live="polite">
          {matchesCount > 0 ? resultsText : totalRecordsText}
        </span>
        {hasSearch && (
          <button type="button" className="dv-icon-btn" aria-label="Clear search" onClick={clearSearch}>
            <X size={18} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className="dv-icon-btn"
          aria-label="Previous result"
          disabled={matchesCount === 0}
          onClick={() => onNavigateMatch("prev")}
        >
          <ChevronUp size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="dv-icon-btn"
          aria-label="Next result"
          disabled={matchesCount === 0}
          onClick={() => onNavigateMatch("next")}
        >
          <ChevronDown size={18} aria-hidden="true" />
        </button>
        <span className="dv-search-divider" aria-hidden="true" />
        <button
          type="button"
          className={`dv-icon-btn${isRecording ? " dv-icon-btn-recording" : ""}`}
          aria-label={isRecording ? "Stop voice search" : "Start voice search"}
          title={isRecording ? "Stop voice search" : "Start voice search"}
          onClick={() => {
            if (!isRecording) startVoice();
            else stopVoice();
          }}
        >
          {isRecording ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
        </button>
      </div>

      {/* NIA assistant */}
      <button type="button" className="dv-btn dv-btn-soft dv-nia" onClick={() => setNiaOpen(true)}>
        <NiaMark size={30} />
        Ask NIA
        {niaUnreadCount > 0 && (
          <span className="dv-nia-badge" aria-label={`${niaUnreadCount} unread NIA answers`}>
            {niaUnreadCount > 9 ? "9+" : niaUnreadCount}
          </span>
        )}
      </button>

      {/* Zoom (kept as labelled buttons for older users) */}
      <button type="button" className="dv-btn" onClick={() => onZoomChange(Math.max(12, fontSize - 2))}>
        <ZoomOut size={18} aria-hidden="true" />
        Zoom out
      </button>
      <button type="button" className="dv-btn" onClick={() => onZoomChange(Math.min(28, fontSize + 2))}>
        <ZoomIn size={18} aria-hidden="true" />
        Zoom in
      </button>

      {/* Download */}
      <button type="button" className="dv-btn" onClick={() => void handleDownload()}>
        <Download size={18} aria-hidden="true" />
        Download
      </button>
    </section>
  );
}
