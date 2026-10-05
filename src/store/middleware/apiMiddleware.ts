import type { Middleware } from "@reduxjs/toolkit";
import { apiEnsure, fetchStart, fetchSuccess, fetchError } from "../api/apiSlice";
import { apiRequest } from "../../hooks/useFetch"; // <-- must be a plain function, not hook
import { idbGetConfig, idbSetConfig } from "../index_db/configcache";

function isConfigKey(key: string) {
  return key.startsWith("config_");
}

function toIsoString(v: any): string | undefined {
  if (!v) return undefined;
  if (typeof v === "string") return v;
  try {
    return new Date(v).toISOString();
  } catch {
    return undefined;
  }
}

export const apiMiddleware: Middleware = (storeAPI) => (next) => async (action) => {
  const result = next(action);

  if (!apiEnsure.match(action)) return result;

  const { key, url, method = "GET", body, headers = {}, force = false, ttlMs } = action.payload;

  const state = storeAPI.getState() as any;
  const entry = state?.api?.entries?.[key];

  // dedupe
  if (entry?.loading) return result;

  // cache hit (redux)
  if (!isConfigKey(key) && !force && entry?.data != null) {
    const effectiveTtl = ttlMs;
    if (!effectiveTtl) return result;
    const last = entry?.lastFetchedAt ?? 0;
    if (Date.now() - last <= effectiveTtl) return result;
  }

  storeAPI.dispatch(fetchStart({ key }));
  let fallbackConfig = entry?.data;

  try {
    // ---- Special handling for configs ----
    if (isConfigKey(key)) {
      let cached: Awaited<ReturnType<typeof idbGetConfig>> = null;
      try {
        cached = await idbGetConfig(key);
      } catch (error: any) {
        console.warn("Unable to read configuration cache", { key, message: error?.message });
      }
      if (!fallbackConfig?.config) fallbackConfig = cached;
      const requestUrl = new URL(url, window.location.origin);
      requestUrl.searchParams.delete("last_modified");
      requestUrl.searchParams.delete("checksum");
      if (!force && cached?.config && cached?.checksum) {
        requestUrl.searchParams.set("checksum", cached.checksum);
      }
      const token = state?.auth?.token || undefined;
      const finalUrl = () => /^https?:\/\//i.test(url)
        ? requestUrl.toString()
        : `${requestUrl.pathname}${requestUrl.search}${requestUrl.hash}`;
      let requestedFullConfig = !requestUrl.searchParams.has("checksum");
      let apiRes = await apiRequest<any>(finalUrl(), method, body, headers, token);
      const cachedTime = Date.parse(cached?.updated_at || "");
      const responseTime = Date.parse(apiRes?.updated_at || "");
      // A newer timestamp without a body can come from an older API using a
      // stale stored checksum. Obtain the full configuration before caching it.
      if (apiRes?.not_modified === true && (
        !cached?.config || !requestUrl.searchParams.has("checksum") ||
        (Number.isFinite(responseTime) && (!Number.isFinite(cachedTime) || responseTime > cachedTime))
      )) {
        requestUrl.searchParams.delete("checksum");
        requestedFullConfig = true;
        apiRes = await apiRequest<any>(finalUrl(), method, body, headers, token);
      }
      if (apiRes?.not_modified === true && (!cached?.config || requestedFullConfig)) {
        throw new Error("Configuration API returned no configuration for a full refresh request.");
      }
      if (apiRes?.not_modified !== true && !apiRes?.config) {
        throw new Error("Configuration API response is missing its configuration.");
      }
      const sameContent = apiRes?.not_modified === true ||
        JSON.stringify(apiRes?.config) === JSON.stringify(entry?.data?.config);
      const nextCache = {
        key,
        file_name: apiRes.file_name ?? cached?.file_name,
        updated_at: toIsoString(apiRes.updated_at) ?? cached?.updated_at,
        checksum: apiRes.checksum ?? cached?.checksum,
        version: apiRes.version ?? cached?.version,
        config: sameContent && entry?.data?.config
          ? entry.data.config
          : apiRes.config ?? cached?.config,
      };
      // Always persist response metadata, even when the configuration is unchanged.
      // A storage failure must not replace fresh API data with the stale cache.
      try {
        await idbSetConfig(nextCache);
      } catch (error: any) {
        console.warn("Unable to persist refreshed configuration", { key, message: error?.message });
      }
      storeAPI.dispatch(fetchSuccess({ key, data: nextCache }));
      return result;
    }

    // ---- Normal API behavior (non-config) ----
    const token = state?.auth?.token || undefined;
    const data = await apiRequest<any>(url, method, body, headers, token);
    storeAPI.dispatch(fetchSuccess({ key, data }));
  } catch (e: any) {
    if (isConfigKey(key) && fallbackConfig?.config) {
      storeAPI.dispatch(fetchSuccess({ key, data: fallbackConfig }));
    }
    storeAPI.dispatch(fetchError({ key, error: e?.message || "Request failed" }));
  }

  return result;
};