"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ArrowRight, ChevronUp, Maximize2, Mic, Minimize2, Minus, SlidersHorizontal, X } from "lucide-react";
import NiaMark from "./nia/NiaMark";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PauseIcon from "@mui/icons-material/Pause";

import { marked } from "marked";
import { decode } from "he";

import {
  color_nav_hover,
  color_dv_border,
  color_dv_chip_bg,
  color_dv_control_border,
  color_dv_divider,
  color_dv_header_bg,
  color_dv_primary,
  color_dv_primary_hover,
  color_dv_text,
  color_dv_text_faint,
  color_dv_text_muted,
} from "../constants/colors";
import { apiUrl } from "../config/api";
import {
  markThreadRead,
  selectHasAnyPendingNia,
  selectNiaThreadByFileName,
  setThreadVisibility,
  submitNiaQuestion,
  loadNiaHistory,
} from "../store/niaChatSlice";
import { setSelectedCommunities } from "../store/auth/fileSlice";
import type { AppDispatch, RootState } from "../store/store";

export { default as NIAChatTrigger } from "./NIAChatTrigger";

interface NIAChatProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

async function markdownToPlainText(md: string) {
  const safeMd = typeof md === "string" ? md : "";

  const maybeHtml = await (marked as any)(safeMd);
  const htmlAsString =
    typeof maybeHtml === "string" ? maybeHtml : String(maybeHtml ?? "");

  const decoded = decode(htmlAsString);
  const decodedAsString =
    typeof decoded === "string" ? decoded : String(decoded ?? "");

  return decodedAsString.replace(/<[^>]+>/g, "").replace(/\r/g, "");
}

function getPreferredSpeechLang() {
  return "en-CA";
}

function detectAudioMime(buf: ArrayBuffer): string {
  const u = new Uint8Array(buf);
  const s4 = (i: number) =>
    String.fromCharCode(u[i] || 0, u[i + 1] || 0, u[i + 2] || 0, u[i + 3] || 0);

  if (u.byteLength >= 12 && s4(0) === "RIFF" && s4(8) === "WAVE") return "audio/wav";
  if (u.byteLength >= 4 && s4(0) === "OggS") return "audio/ogg";
  if (u.byteLength >= 4 && s4(0) === "fLaC") return "audio/flac";

  if (
    u.byteLength >= 3 &&
    u[0] === 0x49 &&
    u[1] === 0x44 &&
    u[2] === 0x33
  ) {
    return "audio/mpeg";
  }

  if (u.byteLength >= 2 && u[0] === 0xff && (u[1] & 0xe0) === 0xe0) return "audio/mpeg";

  return "audio/mpeg";
}

function TinySpinner() {
  return (
    <span
      aria-label="Generating audio"
      role="status"
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `2px solid ${color_dv_control_border}`,
        borderTopColor: color_dv_primary,
        animation: "niaSpin 0.9s linear infinite",
        display: "inline-block",
      }}
    />
  );
}

function ThinkingBubble() {
  return (
    <div aria-label="NIA is thinking" role="status" className="nia-bubble nia-bubble-nia nia-thinking">
      <span className="nia-dots" aria-hidden="true">
        <span className="nia-dot" />
        <span className="nia-dot" style={{ animationDelay: ".2s" }} />
        <span className="nia-dot" style={{ animationDelay: ".4s" }} />
      </span>
      <span>NIA is thinking</span>
    </div>
  );
}

const NIA_CHAT_STYLES = `
@keyframes niaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes niaDot { 0%, 80%, 100% { opacity: .25; } 40% { opacity: 1; } }
.nia-panel { font-family: inherit; color: ${color_dv_text}; }
.nia-panel .dv-visually-hidden { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.nia-icon-btn {
  width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 10px; border: 1px solid transparent; background: transparent; color: #3D4657;
  cursor: pointer; padding: 0; flex-shrink: 0;
}
.nia-icon-btn:hover { background: #F1F3F6; }
.nia-icon-btn:focus-visible, .nia-listen:focus-visible, .nia-send:focus-visible, .nia-mic:focus-visible, .nia-clear:focus-visible {
  outline: 3px solid ${color_dv_primary}; outline-offset: 2px;
}
.nia-bubble { font-size: 16px; line-height: 1.5; padding: 10px 16px; overflow-wrap: anywhere; }
.nia-bubble p { margin: 0 0 8px; } .nia-bubble p:last-child { margin-bottom: 0; }
.nia-bubble ul, .nia-bubble ol { margin: 4px 0 8px; padding-left: 20px; }
.nia-bubble-you { align-self: flex-end; max-width: 80%; background: ${color_dv_primary}; color: #FFFFFF; border-radius: 16px 16px 4px 16px; }
.nia-bubble-you a { color: #FFFFFF; }
.nia-bubble-nia { background: #F1F3F6; color: ${color_dv_text}; border-radius: 16px 16px 16px 4px; }
.nia-bubble-error { background: #FDECEE; color: #8B1E2D; border: 1px solid #F3C4CB; }
.nia-thinking { display: flex; align-items: center; gap: 10px; padding: 14px 16px; font-size: 15px; color: ${color_dv_text_muted}; }
.nia-dots { display: inline-flex; gap: 4px; }
.nia-dot { width: 7px; height: 7px; border-radius: 50%; background: ${color_dv_text_muted}; display: inline-block; animation: niaDot 1.2s infinite; }
.nia-listen {
  display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border-radius: 8px; border: 0;
  background: transparent; color: ${color_dv_primary}; font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
}
.nia-listen:hover { background: ${color_nav_hover}; }
.nia-listen svg { font-size: 16px; }
.nia-input {
  flex: 1; min-width: 0; min-height: 48px; box-sizing: border-box; border: 1px solid ${color_dv_control_border}; border-radius: 12px;
  padding: 12px 14px; font-family: inherit; font-size: 16px; color: ${color_dv_text}; background: #FFFFFF; resize: none;
  white-space: pre-wrap; word-break: break-word; overflow-y: auto;
}
.nia-input:focus { outline: none; border-color: ${color_dv_primary}; box-shadow: 0 0 0 1px ${color_dv_primary}; }
.nia-input::placeholder { color: ${color_dv_text_faint}; }
.nia-mic, .nia-send {
  width: 48px; height: 48px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 12px; cursor: pointer; padding: 0; font-family: inherit;
}
.nia-mic { border: 1px solid ${color_dv_control_border}; background: #FFFFFF; color: ${color_dv_primary}; }
.nia-mic:hover:not(:disabled) { background: ${color_dv_header_bg}; }
.nia-mic-recording { background: #8B1E2D; border-color: #8B1E2D; color: #FFFFFF; font-size: 12px; font-weight: 600; }
.nia-send { border: 0; background: ${color_dv_primary}; color: #FFFFFF; }
.nia-send:hover:not(:disabled) { background: ${color_dv_primary_hover}; }
.nia-mic:disabled, .nia-send:disabled { opacity: 0.5; cursor: not-allowed; }
.nia-clear {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid transparent; background: transparent;
  color: ${color_dv_text_muted}; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0;
}
.nia-clear:hover { background: #F1F3F6; }
`;

const MAX_LINES = 4;
const LINE_HEIGHT_PX = 22;
const VERTICAL_PADDING_PX = 24;
const MAX_TEXTAREA_HEIGHT = MAX_LINES * LINE_HEIGHT_PX + VERTICAL_PADDING_PX;

export default function NIAChat({ open, setOpen }: NIAChatProps) {
  const dispatch = useDispatch<AppDispatch>();
  const finalTranscriptRef = useRef<string>("");
  const recognitionRef = useRef<any>(null);

  const [fullscreen, setFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [recordingState, setRecordingState] = useState<"idle" | "recording">("idle");
  const [ttsCache, setTtsCache] = useState<Record<string, string>>({});
  const ttsCacheRef = useRef<Record<string, string>>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const preferredLangRef = useRef<string>(getPreferredSpeechLang());
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const ttsRequestExchangeIdRef = useRef<string | null>(null);

  const { selectedFile, selectedCommunities } = useSelector((state: RootState) => state.file);
  const currentThread = useSelector((state: RootState) =>
    selectNiaThreadByFileName(state, selectedFile?.filename)
  );
  const hasPendingExchange = useSelector((state: RootState) => selectHasAnyPendingNia(state));
  const authIdentity = useSelector((state: RootState) => state.auth.user?.id ?? state.auth.token);

  const exchanges = currentThread?.exchanges || [];
  const unreadCount = currentThread?.unreadCount || 0;
  const currentFileName = String(selectedFile?.filename || "").trim();
  const hasCommunityFilter = !!selectedFile?.community_filter;
  const hasActiveCommunityFilters = hasCommunityFilter && (selectedCommunities?.length || 0) > 0;
  const communityFilterSummary = hasActiveCommunityFilters
    ? selectedCommunities.join(", ")
    : "All communities";

  const {
    data: ttsData,
    error: ttsError,
    fetchData: fetchTTS,
  } = useFetch<ArrayBuffer>(apiUrl("chat/tts"), "POST");

  const [ttsPlayingExchangeId, setTtsPlayingExchangeId] = useState<string | null>(null);
  const [ttsLoadingExchangeId, setTtsLoadingExchangeId] = useState<string | null>(null);

  useEffect(() => {
    if (open && currentFileName && authIdentity) {
      dispatch(loadNiaHistory(currentFileName));
    }
  }, [open, currentFileName, authIdentity, dispatch]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT);
    el.style.height = `${next}px`;
  }, [input]);

  useEffect(() => {
    const fileName = currentFileName;
    if (!fileName || !open) return;

    dispatch(
      setThreadVisibility({
        fileName,
        isOpen: open,
        isMinimized: open ? minimized : false,
      })
    );

    return () => {
      if (!fileName) return;
      dispatch(
        setThreadVisibility({
          fileName,
          isOpen: false,
          isMinimized: false,
        })
      );
    };
  }, [currentFileName, dispatch, minimized, open, authIdentity]);

  useEffect(() => {
    if (!open || minimized || !currentFileName || unreadCount === 0) return;
    dispatch(markThreadRead({ fileName: currentFileName }));
  }, [currentFileName, dispatch, minimized, open, unreadCount]);

  useEffect(() => {
    if (!open || minimized || !messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const timer = window.setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [currentThread?.lastCompletedExchangeId, exchanges.length, minimized, open]);

  const startAudioRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.start();
    setRecordingState("recording");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser");
      setRecordingState("idle");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = preferredLangRef.current || "en-US";
    recognition.interimResults = true;

    finalTranscriptRef.current = "";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
      }

      setInput(finalTranscript + interimTranscript);
      finalTranscriptRef.current = finalTranscript + interimTranscript;
    };

    recognition.onend = () => setRecordingState("idle");
    recognition.onerror = (err: any) => {
      console.error(err);
      setRecordingState("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopAudioRecording = () => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    setRecordingState("idle");
  };

  const clearCommunityFilters = useCallback(() => {
    dispatch(setSelectedCommunities({ selected: [] }));
  }, [dispatch]);

  const stopTTS = useCallback(() => {
    const audio = audioElRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // no-op
      }
    }
    setTtsPlayingExchangeId(null);
  }, []);

  const revokeAllTtsUrls = useCallback((cache: Record<string, string>) => {
    Object.values(cache).forEach((url) => {
      if (!url) return;
      try {
        URL.revokeObjectURL(url);
      } catch {
        // no-op
      }
    });
  }, []);

  const clearTtsCache = useCallback(() => {
    revokeAllTtsUrls(ttsCacheRef.current);
    ttsCacheRef.current = {};
    setTtsCache({});
  }, [revokeAllTtsUrls]);

  const playUrl = useCallback(
    async (url: string, exchangeId: string) => {
      if (ttsPlayingExchangeId !== null && ttsPlayingExchangeId !== exchangeId) {
        stopTTS();
      }

      let audio = audioElRef.current;
      if (!audio) {
        audio = new Audio();
        audio.preload = "auto";
        audioElRef.current = audio;
      }

      if (ttsPlayingExchangeId === exchangeId && audio && !audio.paused) {
        stopTTS();
        return false;
      }

      audio.src = url;
      try {
        audio.load();
      } catch {
        // no-op
      }

      audio.onended = () => setTtsPlayingExchangeId(null);
      audio.onerror = () => setTtsPlayingExchangeId(null);

      setTtsPlayingExchangeId(exchangeId);

      try {
        await audio.play();
        return true;
      } catch (err) {
        console.warn("Audio play failed:", err);
        setTtsPlayingExchangeId(null);
        return false;
      }
    },
    [stopTTS, ttsPlayingExchangeId]
  );

  const sendMessage = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || hasPendingExchange || !currentFileName) return;

    dispatch(
      submitNiaQuestion({
        fileName: currentFileName,
        question: trimmedInput,
        selectedCommunitiesSnapshot: selectedCommunities || [],
        communityFilter: !!selectedFile?.community_filter,
      }) as any
    );

    setInput("");
  };

  const handleAudio = useCallback(
    async (answer: string, exchangeId: string) => {
      if (!answer) return;

      const cachedUrl = ttsCache[exchangeId];
      if (cachedUrl) {
        await playUrl(cachedUrl, exchangeId);
        return;
      }

      if (ttsLoadingExchangeId !== null) return;

      setTtsLoadingExchangeId(exchangeId);
      ttsRequestExchangeIdRef.current = exchangeId;

      let plain = "";
      try {
        plain = await markdownToPlainText(answer);
      } catch (err) {
        console.error("markdownToPlainText failed:", err);
        setTtsLoadingExchangeId(null);
        ttsRequestExchangeIdRef.current = null;
        return;
      }

      const fd = new FormData();
      fd.append("text", plain);
      fd.append("model", "gemini-2.5-flash-tts");
      fd.append("voice", "Albenib");
      fd.append("language", "en-US");
      fd.append("style", "empathetic and more human like");

      fetchTTS(fd, undefined, false, { responseType: "arraybuffer" });
    },
    [fetchTTS, playUrl, ttsCache, ttsLoadingExchangeId]
  );

  useEffect(() => {
    if (!ttsData) return;

    const exchangeId = ttsRequestExchangeIdRef.current;
    if (!exchangeId) return;

    if (!(ttsData instanceof ArrayBuffer) || ttsData.byteLength === 0) {
      console.warn("TTS returned empty audio buffer");
      setTtsLoadingExchangeId(null);
      ttsRequestExchangeIdRef.current = null;
      return;
    }

    const mime = detectAudioMime(ttsData);
    const blob = new Blob([ttsData], { type: mime });
    const url = URL.createObjectURL(blob);

    setTtsCache((prev) => {
      const next = { ...prev, [exchangeId]: url };
      ttsCacheRef.current = next;
      return next;
    });

    void playUrl(url, exchangeId);

    setTtsLoadingExchangeId(null);
    ttsRequestExchangeIdRef.current = null;
  }, [playUrl, ttsData]);

  useEffect(() => {
    if (!ttsError) return;
    console.error("TTS error:", ttsError);
    setTtsLoadingExchangeId(null);
    ttsRequestExchangeIdRef.current = null;
  }, [ttsError]);

  useEffect(() => {
    return () => {
      stopTTS();
      revokeAllTtsUrls(ttsCacheRef.current);
      ttsCacheRef.current = {};
    };
  }, [revokeAllTtsUrls, stopTTS]);

  const renderedMessages = useMemo(
    () =>
      exchanges.map((exchange) => {
        const showAudioControls = exchange.status === "completed" && !!exchange.answer;
        const isThisLoading = ttsLoadingExchangeId === exchange.id;
        const isThisPlaying = ttsPlayingExchangeId === exchange.id;
        const isError = exchange.status === "error";

        return (
          <div key={exchange.id} style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: "100%" }}>
            {/* You */}
            <div className="nia-bubble nia-bubble-you">
              <span className="dv-visually-hidden">You said: </span>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {exchange.question || ""}
              </ReactMarkdown>
            </div>

            {/* NIA */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "88%" }}>
              <NiaMark size={36} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start", minWidth: 0 }}>
                {exchange.status === "pending" ? (
                  <ThinkingBubble />
                ) : (
                  <div
                    role={isError ? "alert" : undefined}
                    className={`nia-bubble nia-bubble-nia${isError ? " nia-bubble-error" : ""}`}
                  >
                    <span className="dv-visually-hidden">NIA said: </span>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                      {isError
                        ? exchange.errorMessage || "Something went wrong. Please try again later!"
                        : exchange.answer || ""}
                    </ReactMarkdown>
                  </div>
                )}

                {showAudioControls &&
                  (isThisLoading ? (
                    <span className="nia-listen" style={{ cursor: "default" }}>
                      <TinySpinner />
                      Preparing audio
                    </span>
                  ) : isThisPlaying ? (
                    <button type="button" className="nia-listen" onClick={stopTTS}>
                      <PauseIcon />
                      Stop
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="nia-listen"
                      onClick={() => handleAudio(exchange.answer || "", exchange.id)}
                    >
                      <VolumeUpIcon />
                      Listen
                    </button>
                  ))}
              </div>
            </div>
          </div>
        );
      }),
    [exchanges, handleAudio, stopTTS, ttsLoadingExchangeId, ttsPlayingExchangeId]
  );

  if (!open) {
    return null;
  }

  const sendDisabled = hasPendingExchange || !input.trim() || !currentFileName;
  const closeChat = () => {
    stopTTS();
    clearTtsCache();
    setOpen(false);
  };

  return (
    <>
      <style>{NIA_CHAT_STYLES}</style>

      <div
        className="nia-panel"
        role="dialog"
        aria-label="NIA records assistant"
        style={{
          position: "fixed",
          top: minimized ? "auto" : isMobile || fullscreen ? 0 : 12,
          right: minimized ? 20 : isMobile || fullscreen ? 0 : 12,
          left: minimized ? "auto" : isMobile || fullscreen ? 0 : "auto",
          bottom: minimized ? 20 : isMobile || fullscreen ? 0 : 12,
          width: minimized ? "auto" : isMobile || fullscreen ? "100%" : "min(520px, calc(100vw - 24px))",
          height: minimized ? "auto" : "auto",
          borderRadius: isMobile || fullscreen ? 0 : 16,
          background: "#FFFFFF",
          border: `1px solid ${color_dv_border}`,
          display: "flex",
          flexDirection: "column",
          zIndex: 10000,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(16, 24, 40, 0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: minimized ? "8px 8px 8px 12px" : "16px 16px 14px 20px",
            borderBottom: minimized ? "none" : `1px solid ${color_dv_border}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <NiaMark size={minimized ? 32 : 48} />
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <h2 style={{ margin: 0, fontSize: minimized ? 16 : 18, fontWeight: 600 }}>NIA</h2>
            {!minimized && <span style={{ fontSize: 13, color: color_dv_text_muted }}>Records assistant</span>}
          </div>

          {!isMobile && !minimized && (
            <button
              type="button"
              className="nia-icon-btn"
              onClick={() => setFullscreen((prev) => !prev)}
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={fullscreen ? "Exit full screen" : "Full screen"}
            >
              {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          )}

          <button
            type="button"
            className="nia-icon-btn"
            onClick={() => setMinimized((prev) => !prev)}
            aria-label={minimized ? "Restore" : "Minimize"}
            title={minimized ? "Restore" : "Minimize"}
          >
            {minimized ? <ChevronUp size={18} /> : <Minus size={18} />}
          </button>

          <button type="button" className="nia-icon-btn" onClick={closeChat} aria-label="Close NIA" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Community filter strip */}
        {!minimized && hasCommunityFilter && (
          <div
            style={{
              padding: "10px 20px",
              borderBottom: `1px solid ${color_dv_divider}`,
              background: "#FAFBFC",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              color: color_dv_text_muted,
            }}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            <span style={{ flexShrink: 0 }}>Community filter:</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: "3px 10px",
                borderRadius: 999,
                background: color_dv_chip_bg,
                color: color_dv_primary,
                overflowWrap: "anywhere",
                minWidth: 0,
              }}
            >
              {communityFilterSummary}
            </span>
            <span style={{ flex: 1 }} />
            {hasActiveCommunityFilters && (
              <button
                type="button"
                className="nia-clear"
                aria-label="Clear community filters"
                title="Clear community filters"
                onClick={clearCommunityFilters}
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Conversation */}
        {!minimized && (
          <div
            ref={messagesContainerRef}
            style={{
              flex: 1,
              minHeight: 0,
              padding: "24px 20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              background: "#FFFFFF",
            }}
          >
            {currentThread?.historyStatus === "loading" && (
              <div role="status" style={{ fontSize: 15, color: color_dv_text_muted }}>
                Loading saved conversation...
              </div>
            )}
            {currentThread?.historyError && (
              <div role="alert" className="nia-bubble nia-bubble-nia nia-bubble-error">
                {currentThread.historyError}{" "}
                <button
                  type="button"
                  className="nia-listen"
                  onClick={() => dispatch(loadNiaHistory(currentFileName))}
                >
                  Retry
                </button>
              </div>
            )}
            {currentThread?.hasMoreHistory && (
              <div style={{ color: color_dv_text_muted, fontSize: 13, textAlign: "center" }}>
                Showing the 10 most recent questions and answers.
              </div>
            )}
            {renderedMessages.length > 0 ? (
              renderedMessages
            ) : currentThread?.historyStatus !== "loading" ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  padding: "32px 28px",
                  textAlign: "center",
                }}
              >
                <NiaMark size={isMobile ? 96 : 128} />
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Ask NIA about this file</h3>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: color_dv_text_muted }}>
                  Type a question below, or tap the microphone to speak to NIA.
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Composer */}
        {!minimized && (
          <div
            style={{
              borderTop: `1px solid ${color_dv_border}`,
              padding: "14px 16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              background: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <label htmlFor="nia-message" className="dv-visually-hidden">
                Message NIA
              </label>
              <textarea
                id="nia-message"
                ref={inputRef}
                className="nia-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={recordingState === "recording" ? "Listening..." : "Type your message here..."}
                rows={1}
                style={{ maxHeight: MAX_TEXTAREA_HEIGHT, lineHeight: `${LINE_HEIGHT_PX}px` }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              {recordingState === "idle" ? (
                <button
                  type="button"
                  className="nia-mic"
                  onClick={startAudioRecording}
                  disabled={hasPendingExchange}
                  aria-label="Start voice input"
                  title="Speak to NIA"
                >
                  <Mic size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  className="nia-mic nia-mic-recording"
                  onClick={stopAudioRecording}
                  aria-label="Stop voice input"
                  title="Stop"
                >
                  STOP
                </button>
              )}

              <button
                type="button"
                className="nia-send"
                onClick={sendMessage}
                disabled={sendDisabled}
                aria-label="Send message"
                title="Send"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: 13, color: color_dv_text_muted }}>
              {hasPendingExchange
                ? "NIA is preparing your answer. You can keep using the page."
                : "Tip: Tap the microphone to talk to NIA."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
