import { act, renderHook } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { useConfigRefresh } from "./useConfigRefresh";

jest.mock("react-redux", () => ({ useDispatch: jest.fn() }));

const dispatch = jest.fn();
beforeEach(() => {
  jest.useFakeTimers();
  dispatch.mockClear();
  (useDispatch as jest.Mock).mockReturnValue(dispatch);
});
afterEach(() => jest.useRealTimers());

it("refreshes on mount, every 30 seconds, and on returning to the tab", () => {
  const { unmount } = renderHook(() => useConfigRefresh("config_master", "/api/config?file_name=master"));
  expect(dispatch).toHaveBeenCalledTimes(1);
  act(() => { jest.advanceTimersByTime(30_000); });
  expect(dispatch).toHaveBeenCalledTimes(2);
  act(() => { window.dispatchEvent(new Event("focus")); });
  expect(dispatch).toHaveBeenCalledTimes(3);
  act(() => { window.dispatchEvent(new Event("online")); });
  expect(dispatch).toHaveBeenCalledTimes(4);
  unmount();
  act(() => { jest.advanceTimersByTime(30_000); window.dispatchEvent(new Event("focus")); });
  expect(dispatch).toHaveBeenCalledTimes(4);
});

it("stops refreshing the old file after the selected file changes", () => {
  const { rerender, unmount } = renderHook(({ key }) => useConfigRefresh(key, `/api/config?file_name=${key}`), { initialProps: { key: "config_old" } });
  rerender({ key: "config_new" });
  act(() => { jest.advanceTimersByTime(30_000); });
  expect(dispatch.mock.calls.map(([action]) => action.payload.key)).toEqual(["config_old", "config_new", "config_new"]);
  unmount();
});

it("does not request config without a selected file", () => {
  const { unmount } = renderHook(() => useConfigRefresh("", ""));
  act(() => { jest.advanceTimersByTime(30_000); });
  expect(dispatch).not.toHaveBeenCalled();
  unmount();
});
