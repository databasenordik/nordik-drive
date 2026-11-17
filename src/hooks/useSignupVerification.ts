import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";

export function signupRequestKey(): string {
  const random = globalThis.crypto;
  if (!random?.getRandomValues) throw new Error("Secure random generator unavailable");
  if (typeof random.randomUUID === "function") return random.randomUUID();
  const bytes = new Uint8Array(16);
  random.getRandomValues(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}
type Challenge = { id: string; email: string; expiresAt: number; resendAfter: number };
type Proof = { token: string; email: string; expiresAt: number };
type Pending = { fingerprint: string; key: string };

export default function useSignupVerification(email: string) {
  const normalized = email.trim();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);
  const [code, setCodeValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [blockedUntil, setBlockedUntil] = useState(0);
  const epoch = useRef(0);
  const active = useRef(false);
  const pendingSend = useRef<Pending | null>(null);
  const pendingVerify = useRef<Pending | null>(null);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    epoch.current += 1;
    active.current = false;
    setChallenge(null); setProof(null); setCodeValue(""); setError(null);
    setLoading(false); setBlockedUntil(0); setNow(Date.now());
    pendingSend.current = null; pendingVerify.current = null;
    return () => { epoch.current += 1; controller.current?.abort(); };
  }, [normalized]);

  useEffect(() => {
    if (!challenge && !proof && !blockedUntil) return;
    const timer = window.setInterval(() => {
      const current = Date.now(); setNow(current);
      if (current >= Math.max(challenge?.expiresAt || 0, proof?.expiresAt || 0, blockedUntil)) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [challenge, proof, blockedUntil]);

  const run = useCallback(async (operation: "request" | "verify") => {
    if (active.current) return;
    if (!normalized) { setError("Enter your email address first."); return; }
    if (operation === "request" && Date.now() < Math.max(blockedUntil, challenge?.resendAfter || 0)) return;
    if (operation === "verify" && (!challenge || challenge.email !== normalized || challenge.expiresAt <= Date.now() || !/^[0-9]{6}$/.test(code))) {
      setError("Enter the six-digit code, or request a new code if it expired."); return;
    }
    active.current = true; setLoading(true); setError(null);
    const generation = epoch.current;
    const body = operation === "request" ? { email: normalized } : { email: normalized, challenge_id: challenge!.id, otp: code };
    const fingerprint = JSON.stringify(body);
    const pending = operation === "request" ? pendingSend : pendingVerify;
    const abort = new AbortController(); controller.current = abort;
    if (operation === "request") setProof(null);
    try {
      let result: true | Proof;
      if (!pending.current || pending.current.fingerprint !== fingerprint) pending.current = { fingerprint, key: signupRequestKey() };
      const response = await axios.post(apiUrl(`user/signup/otp/${operation}`), body, {
        withCredentials: true, timeout: 15000, signal: abort.signal,
        headers: { "Idempotency-Key": pending.current.key },
      });
      if (epoch.current !== generation) return;
      const data = response.data;
      const expiresAt = Date.parse(data.expires_at);
      if (!Number.isFinite(expiresAt)) throw new Error("Invalid verification response");
      if (operation === "request") {
        const resendAfter = Date.parse(data.resend_after);
        if (typeof data.challenge_id !== "string" || !Number.isFinite(resendAfter)) throw new Error("Invalid challenge response");
        setChallenge({ id: data.challenge_id, email: normalized, expiresAt, resendAfter });
        setCodeValue(""); pendingVerify.current = null;
        result = true;
      } else {
        if (typeof data.signup_verification_token !== "string" || data.signup_verification_token.length < 32) throw new Error("Invalid proof response");
        result = { token: data.signup_verification_token, email: normalized, expiresAt };
        setProof(result);
      }
      pending.current = null; setNow(Date.now());
      return result;
    } catch (failure: any) {
      if (epoch.current !== generation || abort.signal.aborted) return;
      // Retain the request key after an uncertain network/5xx result. A retry
      // can recover the committed challenge/proof instead of creating another.
      if (failure.response?.status >= 400 && failure.response.status < 500) pending.current = null;
      const retryAfter = Number(failure.response?.headers?.["retry-after"]);
      if (failure.response?.status === 429 && Number.isFinite(retryAfter) && retryAfter > 0) {
        setBlockedUntil(Date.now() + retryAfter * 1000); setNow(Date.now());
      }
      setError(typeof failure.response?.data?.error === "string" ? failure.response.data.error : "Email verification is temporarily unavailable. Please try again.");
    } finally {
      if (epoch.current === generation) { active.current = false; setLoading(false); }
    }
  }, [normalized, challenge, code, blockedUntil]);

  const verified = Boolean(proof && proof.email === normalized && proof.expiresAt > now);
  return {
    challenge, code, loading, error, verified,
    token: verified ? proof!.token : null,
    expiresAt: proof?.expiresAt || 0,
    codeExpired: Boolean(challenge && challenge.expiresAt <= now),
    secondsUntilResend: Math.max(0, Math.ceil((Math.max(blockedUntil, challenge?.resendAfter || 0) - now) / 1000)),
    setCode: (value: string) => setCodeValue(value.replace(/\D/g, "").slice(0, 6)),
    requestCode: async () => (await run("request")) === true,
    verifyCode: async () => {
      const result = await run("verify");
      return result && result !== true ? result : undefined;
    },
  };
}
