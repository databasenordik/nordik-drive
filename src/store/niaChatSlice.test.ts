import reducer, {
  addPendingExchange,
  failExchange,
  getNiaThreadKey,
  markThreadRead,
  resolveExchange,
  setThreadVisibility,
  loadNiaHistory,
  submitNiaQuestion,
} from "./niaChatSlice";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setAuth, clearAuth } from "./auth/authSlics";
import { apiRequest } from "../hooks/useFetch";

jest.mock("../hooks/useFetch", () => ({ apiRequest: jest.fn() }));
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

describe("niaChatSlice", () => {
  test("returns the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({ threads: {} });
  });

  test("creates a pending exchange for a file thread", () => {
    const next = reducer(
      undefined,
      addPendingExchange({
        id: "q1",
        fileName: "Students.csv",
        question: "What changed?",
        askedAt: "2026-05-04T10:00:00.000Z",
        selectedCommunitiesSnapshot: ["Shingwauk"],
      }),
    );

    const thread = next.threads[getNiaThreadKey("Students.csv")];
    expect(thread.fileName).toBe("Students.csv");
    expect(thread.exchanges).toHaveLength(1);
    expect(thread.exchanges[0]).toMatchObject({
      id: "q1",
      question: "What changed?",
      status: "pending",
      answer: "",
      errorMessage: null,
      selectedCommunitiesSnapshot: ["Shingwauk"],
    });
  });

  test("resolves a pending exchange, sets last completed id, and increments unread when hidden", () => {
    const started = reducer(
      undefined,
      addPendingExchange({
        id: "q1",
        fileName: "Students.csv",
        question: "What changed?",
        askedAt: "2026-05-04T10:00:00.000Z",
        selectedCommunitiesSnapshot: [],
      }),
    );

    const next = reducer(
      started,
      resolveExchange({
        fileName: "Students.csv",
        exchangeId: "q1",
        answer: "A new row was added.",
        answeredAt: "2026-05-04T10:01:00.000Z",
      }),
    );

    const thread = next.threads[getNiaThreadKey("Students.csv")];
    expect(thread.unreadCount).toBe(1);
    expect(thread.lastCompletedExchangeId).toBe("q1");
    expect(thread.exchanges[0]).toMatchObject({
      status: "completed",
      answer: "A new row was added.",
      answeredAt: "2026-05-04T10:01:00.000Z",
    });
  });

  test("does not increment unread when the thread is open and not minimized", () => {
    const started = reducer(
      undefined,
      addPendingExchange({
        id: "q1",
        fileName: "Students.csv",
        question: "What changed?",
        askedAt: "2026-05-04T10:00:00.000Z",
        selectedCommunitiesSnapshot: [],
      }),
    );

    const visible = reducer(
      started,
      setThreadVisibility({
        fileName: "Students.csv",
        isOpen: true,
        isMinimized: false,
      }),
    );

    const next = reducer(
      visible,
      resolveExchange({
        fileName: "Students.csv",
        exchangeId: "q1",
        answer: "A new row was added.",
        answeredAt: "2026-05-04T10:01:00.000Z",
      }),
    );

    expect(next.threads[getNiaThreadKey("Students.csv")].unreadCount).toBe(0);
  });

  test("marks a pending exchange as error and keeps the question in history", () => {
    const started = reducer(
      undefined,
      addPendingExchange({
        id: "q1",
        fileName: "Students.csv",
        question: "What changed?",
        askedAt: "2026-05-04T10:00:00.000Z",
        selectedCommunitiesSnapshot: [],
      }),
    );

    const next = reducer(
      started,
      failExchange({
        fileName: "Students.csv",
        exchangeId: "q1",
        errorMessage: "Request failed",
        answeredAt: "2026-05-04T10:01:00.000Z",
      }),
    );

    expect(
      next.threads[getNiaThreadKey("Students.csv")].exchanges[0],
    ).toMatchObject({
      question: "What changed?",
      status: "error",
      errorMessage: "Request failed",
      answeredAt: "2026-05-04T10:01:00.000Z",
    });
  });

  test("markThreadRead clears unread count for a thread", () => {
    const started = reducer(
      undefined,
      addPendingExchange({
        id: "q1",
        fileName: "Students.csv",
        question: "What changed?",
        askedAt: "2026-05-04T10:00:00.000Z",
        selectedCommunitiesSnapshot: [],
      }),
    );

    const answered = reducer(
      started,
      resolveExchange({
        fileName: "Students.csv",
        exchangeId: "q1",
        answer: "A new row was added.",
        answeredAt: "2026-05-04T10:01:00.000Z",
      }),
    );

    const next = reducer(
      answered,
      markThreadRead({ fileName: "Students.csv" }),
    );
    expect(next.threads[getNiaThreadKey("Students.csv")].unreadCount).toBe(0);
  });

  test("keeps threads separated per file", () => {
    const first = reducer(
      undefined,
      addPendingExchange({
        id: "q1",
        fileName: "Students.csv",
        question: "Question A",
        askedAt: "2026-05-04T10:00:00.000Z",
        selectedCommunitiesSnapshot: [],
      }),
    );

    const second = reducer(
      first,
      addPendingExchange({
        id: "q2",
        fileName: "Survivors.csv",
        question: "Question B",
        askedAt: "2026-05-04T10:02:00.000Z",
        selectedCommunitiesSnapshot: ["Batchewana"],
      }),
    );

    expect(
      second.threads[getNiaThreadKey("Students.csv")].exchanges,
    ).toHaveLength(1);
    expect(
      second.threads[getNiaThreadKey("Survivors.csv")].exchanges,
    ).toHaveLength(1);
    expect(
      second.threads[getNiaThreadKey("Students.csv")].exchanges[0].question,
    ).toBe("Question A");
    expect(
      second.threads[getNiaThreadKey("Survivors.csv")].exchanges[0].question,
    ).toBe("Question B");
  });
});

describe("persistent NIA history", () => {
  const request = apiRequest as jest.Mock;
  const makeStore = () => {
    const store = configureStore({
      reducer: { auth: authReducer, niaChat: reducer },
    });
    store.dispatch(
      setAuth({
        token: "token",
        user: { id: 1, firstname: "One", lastname: "User" },
      }),
    );
    return store;
  };
  const question = {
    fileName: "Students.csv",
    question: "Next question",
    communityFilter: false,
    selectedCommunitiesSnapshot: [],
  };
  beforeEach(() => request.mockReset());

  test("reloads saved history and keeps the conversation ID on later requests", async () => {
    const store = makeStore();
    request.mockResolvedValueOnce({
      conversation_id: "conversation-a",
      file_id: 49,
      has_more: false,
      entries: [
        {
          id: "pair-a",
          exchange_id: "pair-a",
          question: "Earlier",
          answer: "Saved",
          created_at: "2026-10-15T10:00:00Z",
        },
      ],
    });
    await store.dispatch(loadNiaHistory("Students.csv"));
    request.mockResolvedValueOnce({
      conversation_id: "conversation-a",
      exchange_id: "pair-b",
      answer: "New answer",
    });
    await store.dispatch(submitNiaQuestion(question));
    expect((request.mock.calls[1][2] as FormData).get("conversation_id")).toBe(
      "conversation-a",
    );
    const thread =
      store.getState().niaChat.threads[getNiaThreadKey(question.fileName)];
    expect(thread.exchanges.map((entry) => entry.exchangeId)).toEqual([
      "pair-a",
      "pair-b",
    ]);
    expect(thread.conversationId).toBe("conversation-a");
  });

  test("keeps conversation IDs separate between files", async () => {
    const store = makeStore();
    request.mockResolvedValueOnce({
      conversation_id: "file-a",
      exchange_id: "a",
      answer: "A",
    });
    await store.dispatch(submitNiaQuestion(question));
    request.mockResolvedValueOnce({
      conversation_id: "file-b",
      exchange_id: "b",
      answer: "B",
    });
    await store.dispatch(
      submitNiaQuestion({ ...question, fileName: "Other.csv" }),
    );
    expect((request.mock.calls[1][2] as FormData).has("conversation_id")).toBe(
      false,
    );
    request.mockResolvedValueOnce({
      conversation_id: "file-a",
      exchange_id: "a2",
      answer: "A2",
    });
    await store.dispatch(submitNiaQuestion(question));
    expect((request.mock.calls[2][2] as FormData).get("conversation_id")).toBe(
      "file-a",
    );
  });

  test("ignores previous user's delayed history after an account change", async () => {
    const store = makeStore();
    let complete!: (value: any) => void;
    request.mockReturnValueOnce(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const pending = store.dispatch(loadNiaHistory("Students.csv"));
    store.dispatch(clearAuth());
    store.dispatch(
      setAuth({
        token: "two",
        user: { id: 2, firstname: "Two", lastname: "User" },
      }),
    );
    complete({
      conversation_id: "private",
      file_id: 49,
      entries: [],
      has_more: false,
    });
    await pending;
    expect(store.getState().niaChat.threads).toEqual({});
  });
});
