import { act, renderHook } from "@testing-library/react";
import axios from "axios";
import useSignupVerification from "./useSignupVerification";
jest.mock("axios");
Object.defineProperty(globalThis, "crypto", { value: require("crypto").webcrypto, configurable: true });
const post = axios.post as jest.Mock;
const challenge = () => ({ data: { challenge_id: "challenge-1", expires_at: new Date(Date.now() + 600000).toISOString(), resend_after: new Date(Date.now() + 60000).toISOString() } });
const proof = () => ({ data: { signup_verification_token: "synthetic-proof-value-with-32-random-characters", expires_at: new Date(Date.now() + 600000).toISOString() } });
beforeEach(() => { post.mockReset(); jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); });

test("requests only an email and preserves leading zeroes during verification", async () => {
  post.mockResolvedValueOnce(challenge()).mockResolvedValueOnce(proof());
  const { result } = renderHook(() => useSignupVerification(" person@example.test "));
  await act(async () => { await result.current.requestCode(); });
  expect(post.mock.calls[0][1]).toEqual({ email: "person@example.test" });
  expect(post.mock.calls[0][2].headers["Idempotency-Key"].length).toBeGreaterThanOrEqual(16);
  act(() => result.current.setCode("012345"));
  await act(async () => { await result.current.verifyCode(); });
  expect(post.mock.calls[1][1]).toEqual({ email: "person@example.test", challenge_id: "challenge-1", otp: "012345" });
  expect(result.current.verified).toBe(true);
  act(() => jest.advanceTimersByTime(601000));
  expect(result.current.verified).toBe(false);
  expect(result.current.token).toBeNull();
});
test("retries a lost response with the same key and clears verification on email edits", async () => {
  post.mockRejectedValueOnce(new Error("network")).mockResolvedValueOnce(challenge()).mockResolvedValueOnce(proof());
  const { result, rerender } = renderHook(({ email }) => useSignupVerification(email), { initialProps: { email: "person@example.test" } });
  await act(async () => { await result.current.requestCode(); });
  await act(async () => { await result.current.requestCode(); });
  expect(post.mock.calls[0][2].headers).toEqual(post.mock.calls[1][2].headers);
  act(() => result.current.setCode("012345"));
  await act(async () => { await result.current.verifyCode(); });
  expect(result.current.verified).toBe(true);
  rerender({ email: "other@example.test" });
  expect(result.current.verified).toBe(false); expect(result.current.token).toBeNull(); expect(result.current.challenge).toBeNull();
});
test("honours Retry-After and prevents duplicate clicks", async () => {
  post.mockRejectedValueOnce({ response: { status: 429, headers: { "retry-after": "60" }, data: { error: "Please wait" } } }).mockResolvedValueOnce(challenge());
  const { result } = renderHook(() => useSignupVerification("person@example.test"));
  await act(async () => { await result.current.requestCode(); });
  expect(result.current.secondsUntilResend).toBe(60);
  await act(async () => { await result.current.requestCode(); });
  expect(post).toHaveBeenCalledTimes(1);
  act(() => jest.advanceTimersByTime(61000));
  await act(async () => { await result.current.requestCode(); });
  expect(post).toHaveBeenCalledTimes(2);
});
test("ignores responses from a request for an earlier email", async () => {
  let resolve: (value: any) => void = () => {};
  post.mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
  const { result, rerender } = renderHook(({ email }) => useSignupVerification(email), { initialProps: { email: "person@example.test" } });
  let pending: Promise<void> = Promise.resolve();
  act(() => { pending = result.current.requestCode(); });
  rerender({ email: "other@example.test" });
  await act(async () => { resolve(challenge()); await pending; });
  expect(result.current.challenge).toBeNull(); expect(result.current.verified).toBe(false);
});
