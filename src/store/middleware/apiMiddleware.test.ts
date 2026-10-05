// apiMiddleware.test.ts
import { apiMiddleware } from "./apiMiddleware";
import { apiEnsure, fetchStart, fetchSuccess, fetchError } from "../api/apiSlice";
import { apiRequest } from "../../hooks/useFetch";
import { idbGetConfig, idbSetConfig } from "../index_db/configcache";

jest.mock("../../hooks/useFetch", () => ({
  apiRequest: jest.fn(),
}));

jest.mock("../index_db/configcache", () => ({
  idbGetConfig: jest.fn(),
  idbSetConfig: jest.fn(),
}));

const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockIdbGetConfig = idbGetConfig as jest.MockedFunction<typeof idbGetConfig>;
const mockIdbSetConfig = idbSetConfig as jest.MockedFunction<typeof idbSetConfig>;

describe("apiMiddleware", () => {
  const baseState = {
    api: {
      entries: {},
    },
    auth: {
      token: "token-123",
    },
  };

  const makeStore = (state: any = baseState) => ({
    getState: jest.fn(() => state),
    dispatch: jest.fn(),
  });

  const run = async (action: any, state: any = baseState) => {
    const store = makeStore(state);
    const next = jest.fn((a) => a);

    const result = await (apiMiddleware as any)(store)(next)(action);

    return { store, next, result };
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("passes through non-apiEnsure actions", async () => {
    const action = { type: "OTHER_ACTION", payload: { x: 1 } };

    const { store, next, result } = await run(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(result).toBe(action);
  });

  it("dedupes when entry is already loading", async () => {
    const action = apiEnsure({ key: "users", url: "/users" });

    const state = {
      ...baseState,
      api: {
        entries: {
          users: { loading: true },
        },
      },
    };

    const { store, next, result } = await run(action, state);

    expect(next).toHaveBeenCalledWith(action);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockApiRequest).not.toHaveBeenCalled();
    expect(result).toBe(action);
  });

  it("returns early on redux cache hit when ttl is not provided", async () => {
    const action = apiEnsure({ key: "users", url: "/users" });

    const state = {
      ...baseState,
      api: {
        entries: {
          users: { loading: false, data: { ok: true }, lastFetchedAt: 1000 },
        },
      },
    };

    const { store } = await run(action, state);

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockApiRequest).not.toHaveBeenCalled();
  });

  it("returns early on redux cache hit when ttl is still valid", async () => {
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(10_000);

    const action = apiEnsure({
      key: "users",
      url: "/users",
      ttlMs: 5_000,
    });

    const state = {
      ...baseState,
      api: {
        entries: {
          users: { loading: false, data: { ok: true }, lastFetchedAt: 7_000 },
        },
      },
    };

    const { store } = await run(action, state);

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockApiRequest).not.toHaveBeenCalled();

    nowSpy.mockRestore();
  });

  it("calls normal API and dispatches success for non-config keys", async () => {
    const action = apiEnsure({
      key: "users",
      url: "/users",
      method: "POST",
      body: { a: 1 },
      headers: { "x-test": "1" },
    });

    const apiData = { ok: true };
    mockApiRequest.mockResolvedValueOnce(apiData as any);

    const { store } = await run(action);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, fetchStart({ key: "users" }));
    expect(mockApiRequest).toHaveBeenCalledWith(
      "/users",
      "POST",
      { a: 1 },
      { "x-test": "1" },
      "token-123"
    );
    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      fetchSuccess({ key: "users", data: apiData })
    );
  });

  it("dispatches fetchError for normal API failures", async () => {
    const action = apiEnsure({ key: "users", url: "/users" });

    mockApiRequest.mockRejectedValueOnce(new Error("boom"));

    const { store } = await run(action);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, fetchStart({ key: "users" }));
    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      fetchError({ key: "users", error: "boom" })
    );
  });

  it("for config keys, keeps config and persists metadata when backend says not_modified", async () => {
    const cached = {
      key: "config_boarding",
      file_name: "boarding.json",
      updated_at: "2026-02-26T12:00:00.000Z",
      checksum: "abc",
      version: 3,
      config: { a: 1 },
    };

    const action = apiEnsure({
      key: "config_boarding",
      url: "/config/boarding",
    });

    mockIdbGetConfig.mockResolvedValueOnce(cached as any);
    mockApiRequest.mockResolvedValueOnce({
      not_modified: true,
      file_name: "boarding.json",
      updated_at: "2026-02-26T12:00:00.000Z",
      checksum: "abc",
      version: 3,
    } as any);

    const { store } = await run(action);

    expect(store.dispatch).toHaveBeenNthCalledWith(
      1,
      fetchStart({ key: "config_boarding" })
    );

    expect(mockApiRequest).toHaveBeenCalledWith(
      `/config/boarding?checksum=${cached.checksum}`,
      "GET",
      undefined,
      {},
      "token-123"
    );

    // backend says unchanged -> keep cached
    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      fetchSuccess({ key: "config_boarding", data: cached })
    );

    expect(mockIdbSetConfig).toHaveBeenCalledWith(cached);
  });

  it("retries a not-modified response without local config and rejects an empty full response", async () => {
    mockIdbGetConfig.mockResolvedValueOnce(null);
    mockApiRequest.mockResolvedValue({ not_modified: true });
    const { store } = await run(apiEnsure({ key: "config_boarding", url: "/config/boarding" }));
    expect(mockApiRequest).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenLastCalledWith(fetchError({ key: "config_boarding", error: "Configuration API returned no configuration for a full refresh request." }));
    expect(mockIdbSetConfig).not.toHaveBeenCalled();
  });

  it("for config keys, saves modified config to IDB and redux", async () => {
    const action = apiEnsure({
      key: "config_boarding",
      url: "/config/boarding",
      method: "GET",
    });

    mockIdbGetConfig.mockResolvedValueOnce(null as any);

    mockApiRequest.mockResolvedValueOnce({
      not_modified: false,
      file_name: "boarding.json",
      updated_at: new Date("2026-02-26T12:34:56.000Z"),
      checksum: "new-checksum",
      version: 7,
      config: { x: 1, y: 2 },
    } as any);

    const { store } = await run(action);

    const expectedCache = {
      key: "config_boarding",
      file_name: "boarding.json",
      updated_at: "2026-02-26T12:34:56.000Z",
      checksum: "new-checksum",
      version: 7,
      config: { x: 1, y: 2 },
    };

    expect(store.dispatch).toHaveBeenNthCalledWith(
      1,
      fetchStart({ key: "config_boarding" })
    );
    expect(mockIdbSetConfig).toHaveBeenCalledWith(expectedCache);
    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      fetchSuccess({ key: "config_boarding", data: expectedCache })
    );
  });

  it("falls back to IDB cache if config API fails", async () => {
    const cached = {
      key: "config_boarding",
      file_name: "boarding.json",
      updated_at: "2026-02-26T12:00:00.000Z",
      checksum: "abc",
      version: 3,
      config: { a: 1 },
    };

    const action = apiEnsure({
      key: "config_boarding",
      url: "/config/boarding",
    });

    mockIdbGetConfig
      .mockResolvedValueOnce(cached as any) // initial fast read
      .mockResolvedValueOnce(cached as any); // catch fallback

    mockApiRequest.mockRejectedValueOnce(new Error("network down"));

    const { store } = await run(action);

    expect(store.dispatch).toHaveBeenNthCalledWith(
      1,
      fetchStart({ key: "config_boarding" })
    );

    // fallback from catch
    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      fetchSuccess({ key: "config_boarding", data: cached })
    );

    expect(store.dispatch).toHaveBeenLastCalledWith(
      fetchError({ key: "config_boarding", error: "network down" })
    );
  });

  it("dispatches fetchError if config API fails and no IDB cache exists", async () => {
    const action = apiEnsure({
      key: "config_boarding",
      url: "/config/boarding",
    });

    mockIdbGetConfig
      .mockResolvedValueOnce(null as any)
      .mockResolvedValueOnce(null as any);

    mockApiRequest.mockRejectedValueOnce(new Error("network down"));

    const { store } = await run(action);

    expect(store.dispatch).toHaveBeenNthCalledWith(
      1,
      fetchStart({ key: "config_boarding" })
    );

    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      fetchError({ key: "config_boarding", error: "network down" })
    );
  });

  it("uses force=true to bypass redux cache", async () => {
    const action = apiEnsure({
      key: "users",
      url: "/users",
      force: true,
    });

    const state = {
      ...baseState,
      api: {
        entries: {
          users: { loading: false, data: { cached: true }, lastFetchedAt: 1000 },
        },
      },
    };

    mockApiRequest.mockResolvedValueOnce({ fresh: true } as any);

    const { store } = await run(action, state);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, fetchStart({ key: "users" }));
    expect(mockApiRequest).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      fetchSuccess({ key: "users", data: { fresh: true } })
    );
  });
  it("revalidates old Redux config and removes duplicate timestamp parameters", async () => {
    const state = { ...baseState, api: { entries: { config_boarding: {
      loading: false, data: { config: { old: true } }, lastFetchedAt: 0,
    } } } };
    mockIdbGetConfig.mockResolvedValueOnce({ config: { old: true }, checksum: "old-content" } as any);
    mockApiRequest.mockResolvedValueOnce({ config: { updated: true }, checksum: "new-content" });
    await run(apiEnsure({ key: "config_boarding", url: "/config?file_name=boarding&last_modified=old&last_modified=older" }), state);
    expect(mockApiRequest).toHaveBeenCalledWith("/config?file_name=boarding&checksum=old-content", "GET", undefined, {}, "token-123");
    expect(mockIdbSetConfig).toHaveBeenCalledWith(expect.objectContaining({ config: { updated: true } }));
  });

  it("forces a full config response without sending a cached checksum", async () => {
    mockIdbGetConfig.mockResolvedValueOnce({ config: { old: true }, checksum: "old-content" } as any);
    mockApiRequest.mockResolvedValueOnce({ config: { updated: true } });
    await run(apiEnsure({ key: "config_boarding", url: "/config?file_name=boarding", force: true }));
    expect(mockApiRequest).toHaveBeenCalledWith("/config?file_name=boarding", "GET", undefined, {}, "token-123");
  });

  it("revalidates config even when Redux was just populated", async () => {
    const state = { ...baseState, api: { entries: { config_boarding: {
      loading: false, data: { config: { old: true } }, lastFetchedAt: Date.now(),
    } } } };
    mockIdbGetConfig.mockResolvedValueOnce({ config: { old: true }, checksum: "old" } as any);
    mockApiRequest.mockResolvedValueOnce({ config: { validation: true }, updated_at: "2026-10-05T14:08:29.955708Z" });
    await run(apiEnsure({ key: "config_boarding", url: "/config" }), state);
    expect(mockIdbSetConfig).toHaveBeenCalledWith(expect.objectContaining({ config: { validation: true } }));
  });

  it("fetches the body when a not-modified response has a newer timestamp", async () => {
    mockIdbGetConfig.mockResolvedValueOnce({ config: { old: true }, checksum: "old", updated_at: "2026-09-14T12:16:36Z" } as any);
    mockApiRequest.mockResolvedValueOnce({ not_modified: true, updated_at: "2026-10-05T14:08:29Z" })
      .mockResolvedValueOnce({ config: { validation: true }, updated_at: "2026-10-05T14:08:29Z", checksum: "new" });
    await run(apiEnsure({ key: "config_boarding", url: "/config" }));
    expect(mockApiRequest).toHaveBeenNthCalledWith(2, "/config", "GET", undefined, {}, "token-123");
    expect(mockIdbSetConfig).toHaveBeenCalledWith(expect.objectContaining({ config: { validation: true }, updated_at: "2026-10-05T14:08:29Z" }));
  });

  it("preserves form config identity when only response metadata changed", async () => {
    const config = { validation: true };
    const state = { ...baseState, api: { entries: { config_boarding: {
      loading: false, data: { config, checksum: "same" }, lastFetchedAt: 0,
    } } } };
    mockIdbGetConfig.mockResolvedValueOnce({ config: { validation: true }, checksum: "same", updated_at: "2026-10-05T14:08:29Z" } as any);
    mockApiRequest.mockResolvedValueOnce({ not_modified: true, version: 4, checksum: "same", updated_at: "2026-10-05T14:08:29Z" });
    await run(apiEnsure({ key: "config_boarding", url: "/config" }), state);
    expect(mockIdbSetConfig.mock.calls[0][0].config).toBe(config);
    expect(mockIdbSetConfig.mock.calls[0][0].version).toBe(4);
  });

  it("does not discard fresh config when IndexedDB writes fail", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockIdbGetConfig.mockResolvedValueOnce({ config: { old: true } } as any);
    mockApiRequest.mockResolvedValueOnce({ config: { validation: true } });
    mockIdbSetConfig.mockRejectedValueOnce(new Error("storage failed"));
    const { store } = await run(apiEnsure({ key: "config_boarding", url: "/config" }));
    expect(store.dispatch).toHaveBeenLastCalledWith(fetchSuccess({ key: "config_boarding", data: expect.objectContaining({ config: { validation: true } }) }));
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("uses full API content even if an older server returns a stale stored checksum", async () => {
    const state = { ...baseState, api: { entries: { config_boarding: { loading: false, data: { config: { old: true }, checksum: "unchanged" }, lastFetchedAt: 0 } } } };
    mockIdbGetConfig.mockResolvedValueOnce({ config: { old: true }, checksum: "unchanged" } as any);
    mockApiRequest.mockResolvedValueOnce({ config: { validation: true }, checksum: "unchanged" });
    await run(apiEnsure({ key: "config_boarding", url: "/config", force: true }), state);
    expect(mockIdbSetConfig).toHaveBeenCalledWith(expect.objectContaining({ config: { validation: true } }));
  });

});