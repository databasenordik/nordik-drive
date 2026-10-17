import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { apiUrl } from "../config/api";
import { apiRequest } from "../hooks/useFetch";
import { setAuth, clearAuth } from "./auth/authSlics";

export type NiaChatExchangeStatus = "pending" | "completed" | "error";

export interface NiaChatExchange {
  id: string;
  fileName: string;
  question: string;
  answer: string;
  status: NiaChatExchangeStatus;
  askedAt: string;
  answeredAt: string | null;
  errorMessage: string | null;
  selectedCommunitiesSnapshot: string[];
  exchangeId?: string | null;
}

export interface NiaChatThread {
  fileKey: string;
  fileName: string;
  unreadCount: number;
  lastCompletedExchangeId: string | null;
  isOpen: boolean;
  isMinimized: boolean;
  exchanges: NiaChatExchange[];
  conversationId: string | null;
  fileId: number | null;
  historyStatus: "idle" | "loading" | "loaded" | "error";
  historyError: string | null;
  historyRequestId: string | null;
  hasMoreHistory: boolean;
}

export interface NiaChatState {
  threads: Record<string, NiaChatThread>;
  ownerKey?: string | null;
}

type NiaChatSelectorState = {
  niaChat?: NiaChatState;
  auth?: { user?: { id?: number } | null; token?: string | null };
};

const ownerKeyFor = (state: NiaChatSelectorState) =>
  state.auth?.user?.id != null
    ? `user:${state.auth.user.id}`
    : state.auth?.token || "session";

const belongsToCurrentUser = (state: NiaChatSelectorState) =>
  !state.auth ||
  state.niaChat?.ownerKey === undefined ||
  state.niaChat.ownerKey === ownerKeyFor(state);

interface HistoryResponse {
  conversation_id: string | null;
  file_id: number;
  has_more: boolean;
  entries: Array<{
    id: string;
    exchange_id: string;
    question: string;
    answer: string;
    created_at: string;
    answered_at?: string;
    communities?: string[];
  }>;
}

const initialState: NiaChatState = {
  threads: {},
};

export const getNiaThreadKey = (fileName?: string | null) =>
  String(fileName || "")
    .trim()
    .toLowerCase();

const ensureThread = (state: NiaChatState, fileName: string) => {
  const normalizedFileName = String(fileName || "").trim();
  const fileKey = getNiaThreadKey(normalizedFileName);

  if (!fileKey) return null;

  if (!state.threads[fileKey]) {
    state.threads[fileKey] = {
      fileKey,
      fileName: normalizedFileName,
      unreadCount: 0,
      lastCompletedExchangeId: null,
      isOpen: false,
      isMinimized: false,
      exchanges: [],
      conversationId: null,
      fileId: null,
      historyStatus: "idle",
      historyError: null,
      historyRequestId: null,
      hasMoreHistory: false,
    };
  } else if (normalizedFileName) {
    state.threads[fileKey].fileName = normalizedFileName;
  }

  return state.threads[fileKey];
};

const niaChatSlice = createSlice({
  name: "niaChat",
  initialState,
  reducers: {
    setChatOwner: (state, action: PayloadAction<string>) => {
      if (state.ownerKey !== action.payload) state.threads = {};
      state.ownerKey = action.payload;
    },
    historyStarted: (
      state,
      action: PayloadAction<{ fileName: string; requestId: string }>,
    ) => {
      const thread = ensureThread(state, action.payload.fileName);
      if (!thread) return;
      thread.historyStatus = "loading";
      thread.historyError = null;
      thread.historyRequestId = action.payload.requestId;
    },
    historyLoaded: (
      state,
      action: PayloadAction<{
        fileName: string;
        requestId: string;
        startedAt: string;
        history: HistoryResponse;
      }>,
    ) => {
      const thread = ensureThread(state, action.payload.fileName);
      if (!thread || thread.historyRequestId !== action.payload.requestId)
        return;
      const { history, startedAt } = action.payload;
      const saved = history.entries.map(
        (entry): NiaChatExchange => ({
          id: entry.exchange_id || entry.id,
          exchangeId: entry.exchange_id || entry.id,
          fileName: thread.fileName,
          question: entry.question,
          answer: entry.answer,
          status: "completed",
          askedAt: entry.created_at,
          answeredAt: entry.answered_at || entry.created_at,
          errorMessage: null,
          selectedCommunitiesSnapshot: entry.communities || [],
        }),
      );
      const savedIds = new Set(saved.map((entry) => entry.exchangeId));
      const arriving = thread.exchanges.filter(
        (entry) =>
          !savedIds.has(entry.exchangeId || entry.id) &&
          (entry.status !== "completed" ||
            (entry.answeredAt || "") >= startedAt),
      );
      thread.exchanges = [...saved, ...arriving];
      thread.conversationId = history.conversation_id || thread.conversationId;
      thread.fileId = history.file_id;
      thread.hasMoreHistory = history.has_more;
      thread.historyStatus = "loaded";
      thread.historyError = null;
      thread.lastCompletedExchangeId =
        [...thread.exchanges]
          .reverse()
          .find((entry) => entry.status === "completed")?.id || null;
    },
    historyFailed: (
      state,
      action: PayloadAction<{ fileName: string; requestId: string }>,
    ) => {
      const thread = ensureThread(state, action.payload.fileName);
      if (!thread || thread.historyRequestId !== action.payload.requestId)
        return;
      thread.historyStatus = "error";
      thread.historyError = "Could not load saved history.";
    },
    addPendingExchange: (
      state,
      action: PayloadAction<{
        id: string;
        fileName: string;
        question: string;
        askedAt: string;
        selectedCommunitiesSnapshot: string[];
      }>,
    ) => {
      const thread = ensureThread(state, action.payload.fileName);
      if (!thread) return;

      thread.exchanges.push({
        id: action.payload.id,
        fileName: thread.fileName,
        question: action.payload.question,
        answer: "",
        status: "pending",
        askedAt: action.payload.askedAt,
        answeredAt: null,
        errorMessage: null,
        selectedCommunitiesSnapshot: action.payload.selectedCommunitiesSnapshot,
      });
    },
    resolveExchange: (
      state,
      action: PayloadAction<{
        fileName: string;
        exchangeId: string;
        answer: string;
        answeredAt: string;
        conversationId?: string | null;
        serverExchangeId?: string | null;
      }>,
    ) => {
      const thread = ensureThread(state, action.payload.fileName);
      if (!thread) return;

      const exchange = thread.exchanges.find(
        (item) => item.id === action.payload.exchangeId,
      );
      if (!exchange) return;

      exchange.answer = action.payload.answer;
      exchange.status = "completed";
      exchange.answeredAt = action.payload.answeredAt;
      exchange.errorMessage = null;
      exchange.exchangeId = action.payload.serverExchangeId || null;
      if (action.payload.conversationId)
        thread.conversationId = action.payload.conversationId;

      thread.lastCompletedExchangeId = exchange.id;

      if (!thread.isOpen || thread.isMinimized) {
        thread.unreadCount += 1;
      }
    },
    failExchange: (
      state,
      action: PayloadAction<{
        fileName: string;
        exchangeId: string;
        errorMessage: string;
        answeredAt: string;
      }>,
    ) => {
      const thread = ensureThread(state, action.payload.fileName);
      if (!thread) return;

      const exchange = thread.exchanges.find(
        (item) => item.id === action.payload.exchangeId,
      );
      if (!exchange) return;

      exchange.status = "error";
      exchange.answeredAt = action.payload.answeredAt;
      exchange.errorMessage = action.payload.errorMessage;
    },
    markThreadRead: (state, action: PayloadAction<{ fileName: string }>) => {
      const thread = ensureThread(state, action.payload.fileName);
      if (!thread) return;

      thread.unreadCount = 0;
    },
    setThreadVisibility: (
      state,
      action: PayloadAction<{
        fileName: string;
        isOpen: boolean;
        isMinimized: boolean;
      }>,
    ) => {
      const thread = ensureThread(state, action.payload.fileName);
      if (!thread) return;

      thread.isOpen = action.payload.isOpen;
      thread.isMinimized = action.payload.isMinimized;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAuth, () => ({ threads: {}, ownerKey: null }));
    builder.addCase(setAuth, (state, action) => {
      const ownerKey =
        action.payload.user?.id != null
          ? `user:${action.payload.user.id}`
          : action.payload.token || "session";
      if (state.ownerKey !== ownerKey) state.threads = {};
      state.ownerKey = ownerKey;
    });
  },
});

export const {
  addPendingExchange,
  resolveExchange,
  failExchange,
  markThreadRead,
  setThreadVisibility,
  setChatOwner,
  historyStarted,
  historyLoaded,
  historyFailed,
} = niaChatSlice.actions;

export const selectNiaThreadByFileName = (
  state: NiaChatSelectorState,
  fileName?: string | null,
): NiaChatThread | null =>
  belongsToCurrentUser(state)
    ? state?.niaChat?.threads?.[getNiaThreadKey(fileName)] || null
    : null;

export const selectNiaUnreadCountForFileName = (
  state: NiaChatSelectorState,
  fileName?: string | null,
): number => selectNiaThreadByFileName(state, fileName)?.unreadCount || 0;

export const selectHasAnyPendingNia = (state: NiaChatSelectorState): boolean =>
  belongsToCurrentUser(state) &&
  Object.values(state?.niaChat?.threads || {}).some((thread) =>
    thread.exchanges.some((exchange) => exchange.status === "pending"),
  );

export const selectShouldNotifyForFileName = (
  state: NiaChatSelectorState,
  fileName?: string | null,
): boolean => {
  const thread = selectNiaThreadByFileName(state, fileName);
  if (!thread) return true;
  return !thread.isOpen || thread.isMinimized;
};

export const submitNiaQuestion =
  ({
    fileName,
    question,
    selectedCommunitiesSnapshot,
    communityFilter,
  }: {
    fileName: string;
    question: string;
    selectedCommunitiesSnapshot: string[];
    communityFilter: boolean;
  }) =>
  async (dispatch: any, getState: () => any) => {
    const ownerKey = ownerKeyFor(getState());
    dispatch(setChatOwner(ownerKey));
    const trimmedFileName = String(fileName || "").trim();
    const trimmedQuestion = String(question || "").trim();

    if (
      !trimmedFileName ||
      !trimmedQuestion ||
      selectHasAnyPendingNia(getState())
    ) {
      return null;
    }

    const exchangeId = nanoid();
    const askedAt = new Date().toISOString();

    dispatch(
      addPendingExchange({
        id: exchangeId,
        fileName: trimmedFileName,
        question: trimmedQuestion,
        askedAt,
        selectedCommunitiesSnapshot: selectedCommunitiesSnapshot || [],
      }),
    );

    const body = new FormData();
    body.append("filename", trimmedFileName);
    body.append("question", trimmedQuestion);
    const conversationId = selectNiaThreadByFileName(
      getState(),
      trimmedFileName,
    )?.conversationId;
    if (conversationId) body.append("conversation_id", conversationId);

    if (communityFilter && selectedCommunitiesSnapshot?.length) {
      body.append("communities", selectedCommunitiesSnapshot as any);
    }

    try {
      const token = getState()?.auth?.token || undefined;
      const response = await apiRequest<{
        answer?: string;
        conversation_id?: string;
        exchange_id?: string;
      }>(apiUrl("chat"), "POST", body, {}, token);
      if (
        ownerKeyFor(getState()) !== ownerKey ||
        getState().niaChat?.ownerKey !== ownerKey
      )
        return null;

      dispatch(
        resolveExchange({
          fileName: trimmedFileName,
          exchangeId,
          answer: String(response?.answer || ""),
          answeredAt: new Date().toISOString(),
          conversationId: response?.conversation_id,
          serverExchangeId: response?.exchange_id,
        }),
      );

      if (selectShouldNotifyForFileName(getState(), trimmedFileName)) {
        toast.success("NIA answer is ready.");
      }

      return exchangeId;
    } catch (err: any) {
      if (
        ownerKeyFor(getState()) !== ownerKey ||
        getState().niaChat?.ownerKey !== ownerKey
      )
        return null;
      dispatch(
        failExchange({
          fileName: trimmedFileName,
          exchangeId,
          errorMessage:
            err?.message || "Something went wrong. Please try again later!",
          answeredAt: new Date().toISOString(),
        }),
      );
      toast.error("Something went wrong. Please try again later!");
      return null;
    }
  };

export const loadNiaHistory =
  (fileName: string, limit = 10) =>
  async (dispatch: any, getState: () => any) => {
    if (!fileName.trim()) return;
    const ownerKey = ownerKeyFor(getState());
    dispatch(setChatOwner(ownerKey));
    const requestId = nanoid();
    const startedAt = new Date().toISOString();
    dispatch(historyStarted({ fileName, requestId }));
    try {
      const params = new URLSearchParams({
        filename: fileName,
        limit: String(limit),
      });
      const history = await apiRequest<HistoryResponse>(
        `${apiUrl("chat/history")}?${params}`,
        "GET",
        undefined,
        {},
        getState().auth?.token || undefined,
      );
      if (
        ownerKeyFor(getState()) !== ownerKey ||
        getState().niaChat?.ownerKey !== ownerKey
      )
        return;
      if (!history || !Array.isArray(history.entries))
        throw new Error("Invalid history response");
      dispatch(historyLoaded({ fileName, requestId, startedAt, history }));
    } catch {
      if (
        ownerKeyFor(getState()) !== ownerKey ||
        getState().niaChat?.ownerKey !== ownerKey
      )
        return;
      dispatch(historyFailed({ fileName, requestId }));
    }
  };

export default niaChatSlice.reducer;
