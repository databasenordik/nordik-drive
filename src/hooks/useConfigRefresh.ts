import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { apiEnsure } from "../store/api/apiSlice";
import type { AppDispatch } from "../store/store";

// Revalidate the selected file while it is visible and when the user returns.
export function useConfigRefresh(key: string, url: string) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!key || !url) return;
    const refresh = () => {
      if (document.visibilityState === "hidden") return;
      dispatch(apiEnsure({ key, url, method: "GET" }));
    };
    refresh();
    const interval = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [dispatch, key, url]);
}
