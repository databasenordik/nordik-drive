import React, { useMemo } from "react";

/*
 * NIA logo mark: the Great Lakes / thunderbird mark inside a slowly turning
 * rainbow ring with "pins" around the edge (matches the design canvas).
 * Decorative only (aria-hidden); the animation stops for users who prefer reduced motion.
 */

type Pin = { cls: string; l: number; t: number; w: number; h: number; o: string; a: number };

const r2 = (n: number) => Math.round(n * 100) / 100;

function buildGeometry(S: number) {
  const o = 0.112 * S;
  const t = Math.max(1.5, 0.041 * S);
  const pw = Math.max(1.5, 0.036 * S);
  const r = 0.1 * S;
  const len = o + t / 2;
  const pins: Pin[] = [];

  const mk = (cls: string, l: number, tp: number, w: number, h: number, org: string, x: number, y: number) => {
    let a = (Math.atan2(x - S / 2, S / 2 - y) * 180) / Math.PI;
    if (a < 0) a += 360;
    pins.push({ cls: `nia-pin ${cls}`, l: r2(l), t: r2(tp), w: r2(w), h: r2(h), o: org, a: r2(a) });
  };

  [0.265, 0.415, 0.585, 0.735].forEach((k) => {
    const c = k * S;
    mk("nia-pv", c - pw / 2, 0, pw, len, "50% 100%", c, 0);
    mk("nia-pv", c - pw / 2, S - len, pw, len, "50% 0%", c, S);
    mk("nia-ph", 0, c - pw / 2, len, pw, "100% 50%", 0, c);
    mk("nia-ph", S - len, c - pw / 2, len, pw, "0% 50%", S, c);
  });

  return {
    pins,
    ringOffset: r2(o),
    ringSize: r2(S - 2 * o),
    ringRadius: r2(r),
    coreInset: r2(o + t),
    coreSize: r2(S - 2 * (o + t)),
    coreRadius: r2(Math.max(2, r - t)),
  };
}

export const NIA_MARK_STYLES = `
@property --nia-rot { syntax: '<angle>'; inherits: true; initial-value: 0deg; }
@keyframes niaMarkSpin { to { --nia-rot: 360deg; } }
.nia-mark { position: relative; display: inline-block; flex-shrink: 0; animation: niaMarkSpin 5s linear infinite; }
.nia-mark .nia-pin { position: absolute; border-radius: 999px; background: hsl(calc(var(--pa) - var(--nia-rot)) 90% 52%); }
.nia-mark .nia-pv { transform: scaleY(calc(0.45 + 0.55 * pow(0.5 + 0.5 * cos(var(--pa) - var(--nia-rot)), 3))); }
.nia-mark .nia-ph { transform: scaleX(calc(0.45 + 0.55 * pow(0.5 + 0.5 * cos(var(--pa) - var(--nia-rot)), 3))); }
.nia-mark .nia-ring { position: absolute; background: conic-gradient(from var(--nia-rot), hsl(0 90% 52%) 0deg, hsl(60 90% 52%) 60deg, hsl(120 90% 52%) 120deg, hsl(180 90% 52%) 180deg, hsl(240 90% 52%) 240deg, hsl(300 90% 52%) 300deg, hsl(360 90% 52%) 360deg); }
.nia-mark .nia-core { position: absolute; background: #ffffff; overflow: hidden; }
.nia-mark .nia-core img { width: 100%; height: 100%; display: block; object-fit: contain; }
@media (prefers-reduced-motion: reduce) { .nia-mark { animation: none; } }
`;

export default function NiaMark({ size = 36 }: { size?: number }) {
  const g = useMemo(() => buildGeometry(size), [size]);

  return (
    <span className="nia-mark" aria-hidden="true" data-testid="nia-mark" style={{ width: size, height: size }}>
      <style>{NIA_MARK_STYLES}</style>
      {g.pins.map((p, i) => (
        <span
          key={i}
          className={p.cls}
          style={
            {
              left: p.l,
              top: p.t,
              width: p.w,
              height: p.h,
              transformOrigin: p.o,
              "--pa": `${p.a}deg`,
            } as React.CSSProperties
          }
        />
      ))}
      <span
        className="nia-ring"
        style={{ left: g.ringOffset, top: g.ringOffset, width: g.ringSize, height: g.ringSize, borderRadius: g.ringRadius }}
      />
      <span
        className="nia-core"
        style={{ left: g.coreInset, top: g.coreInset, width: g.coreSize, height: g.coreSize, borderRadius: g.coreRadius }}
      >
        <img src={`${process.env.PUBLIC_URL || ""}/nia-mark.png`} alt="" />
      </span>
    </span>
  );
}
