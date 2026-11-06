import React, { useState, useEffect, useRef } from 'react';
import { authApi, User } from '../../services/authApi';

interface AuthScreenProps {
  onAuthenticated: (user: User) => void;
}

/* ---------- kit helpers ---------- */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const hash = (x: number, y: number, s: number) => { 
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 1274126177); 
  h = Math.imul(h ^ (h >>> 13), 1274126177); 
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295; 
};
const noise2 = (x: number, y: number, s = 0) => { 
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); 
  return lerp(lerp(hash(xi, yi, s), hash(xi + 1, yi, s), u), lerp(hash(xi, yi + 1, s), hash(xi + 1, yi + 1, s), u), v); 
};
const fbm = (x: number, y: number, o = 3, s = 0) => { 
  let a = .5, f = 1, sum = 0, n = 0; 
  for (let i = 0; i < o; i++) { 
    sum += a * noise2(x * f, y * f, s + i); 
    n += a; 
    a /= 2; 
    f *= 2; 
  } 
  return sum / n; 
};

/* ---------- scene: cliff-lighthouse-night ---------- */
const W = 192, H = 108;
const HX = new Map<string, number[]>();
const hex = (h: string) => { 
  let v = HX.get(h); 
  if (!v) { 
    v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); 
    HX.set(h, v); 
  } 
  return v; 
};
const mix = (a: number[], b: number[], t: number) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const ramp = (stops: [number, string][], t: number) => {
  t = clamp(t);
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      return mix(hex(stops[i - 1][1]), hex(stops[i][1]), (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0] || 1));
    }
  }
  return hex(stops[stops.length - 1][1]);
};
const toHex = (c: number[]) => "#" + c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("");

function buildPalette(anchors: Array<any>) {
  const pal: number[][] = [];
  for (const a of anchors) {
    const n = a[a.length - 1], cs = a.slice(0, -1).map(hex);
    for (let i = 0; i < n; i++) { 
      const t = (i / Math.max(1, n - 1)) * (cs.length - 1), k = Math.min(cs.length - 2, Math.floor(t)); 
      pal.push(cs.length === 1 ? cs[0] : mix(cs[k], cs[k + 1], t - k)); 
    }
  }
  return pal;
}

const LEVELS = "▁▂▃▄▅▆▇█";

function makeCanvas() {
  const rgb = new Float32Array(W * H * 3), layer = new Uint8Array(W * H);
  const put = (x: number, y: number, c: number[], L: number) => { 
    x = Math.round(x); y = Math.round(y); 
    if (x < 0 || y < 0 || x >= W || y >= H) return; 
    const i = y * W + x; 
    rgb[i * 3] = c[0]; rgb[i * 3 + 1] = c[1]; rgb[i * 3 + 2] = c[2]; 
    layer[i] = L; 
  };
  return { rgb, layer, put };
}

function makeFrame(rgb: Float32Array, layer: Uint8Array, PAL: number[][]) {
  const out = new Float32Array(W * H * 3), cache = new Map<number, number>();
  const LUM = PAL.map((c) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255);
  const nearest = (r: number, g: number, b: number) => {
    const k = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    let hit = cache.get(k);
    if (hit !== undefined) return hit;
    let best = 0, bd = 1e9;
    for (let i = 0; i < PAL.length; i++) { 
      const p = PAL[i], d = (p[0] - r) ** 2 * 0.3 + (p[1] - g) ** 2 * 0.59 + (p[2] - b) ** 2 * 0.11; 
      if (d < bd) { bd = d; best = i; } 
    }
    cache.set(k, best);
    return best;
  };
  const add = (x: number, y: number, c: number[], a: number, upTo = 255) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = y * W + x;
    if (layer[i] > upTo) return;
    out[i * 3] = lerp(out[i * 3], c[0], a); 
    out[i * 3 + 1] = lerp(out[i * 3 + 1], c[1], a); 
    out[i * 3 + 2] = lerp(out[i * 3 + 2], c[2], a);
  };
  const begin = () => out.set(rgb);
  const finish = () => {
    const text: string[] = [], color: string[] = [];
    for (let y = 0; y < H; y++) {
      let tr = "", cr = "";
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 3, r = clamp(out[i], 0, 255), g = clamp(out[i + 1], 0, 255), b = clamp(out[i + 2], 0, 255);
        const k = nearest(r, g, b), Y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const lv = Y > 0.86 ? 7 : clamp(Math.round(5 + (Y - LUM[k]) * 12), 3, 6);
        tr += LEVELS[lv]; cr += KEYS[k];
      }
      text.push(tr); color.push(cr);
    }
    return { text: text.join("\n"), color: color.join("\n") };
  };
  return { out, add, begin, finish };
}

const ANCHORS: Array<any> = [
  ["#0c1430", "#16224a", "#22325e", "#2e4272", "#3c5484", "#4a6898", "#5a7aa8", "#7a96c0", 13],
  ["#fffbe8", "#fff0b8", "#ffe08a", "#f8c868", 4],
  ["#c8d4f0", "#e8eeff", 2],
  ["#0a0e1a", "#141a2a", "#1e2638", "#2a3448", "#3a4660", 6],
  ["#16242a", "#22343a", 2],
  ["#6a7898", "#8a98b8", "#aab6d0", "#c8d2e6", 5],
  ["#5a2232", "#7a3040", 2],
  ["#0a1428", "#0e1a36", "#14244a", "#1a2c52", "#24396a", 6],
  ["#3a5488", "#5a72a4", "#8aa0c8", 3],
  ["#a8b8d8", "#d0dcf0", 2],
  ["#ffb860", "#e89048", 2],
  ["#1c2a50", "#2a3a66", "#3a4c7a", 3],
  ["#8a8a7a", "#b8b090", "#e0d4a0", 3],
];
const PAL = buildPalette(ANCHORS);
const meta = { cols: W, rows: H, fps: 15, palette: Object.fromEntries(PAL.map((c, i) => [KEYS[i], toHex(c)])) };

const SKY = 0, FAR = 1, SEA = 2, CLIFF = 3, TOWER = 4;
const HOR = 70, LX = 150, LY = 16;

function createScene() {
  const { rgb, layer, put } = makeCanvas();
  for (let y = 0; y < HOR; y++) {
    for (let x = 0; x < W; x++) {
      const c = ramp([[0, "#16224a"], [0.3, "#22325e"], [0.55, "#2e4272"], [0.75, "#3c5484"], [0.9, "#5a7aa8"], [1, "#7a96c0"]], y / HOR);
      put(x, y, c, SKY);
    }
  }
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 120; i++) {
    const x = Math.floor(r() * W), y = Math.floor(Math.pow(r(), 1.4) * (HOR - 14)), big = r() > 0.85;
    put(x, y, big ? hex("#e8eeff") : hex("#c8d4f0"), SKY);
    if (big) { 
      put(x + 1, y, hex("#8aa0c8"), SKY); 
      put(x - 1, y, hex("#8aa0c8"), SKY); 
      put(x, y - 1, hex("#8aa0c8"), SKY); 
      put(x, y + 1, hex("#8aa0c8"), SKY); 
    }
  }
  const far = (x: number) => HOR - 7 * clamp(1 - x / 70) - 2 * fbm(x / 8, 2, 3, 3) * clamp(1 - x / 80);
  for (let x = 0; x < 80; x++) {
    for (let y = Math.floor(far(x)); y < HOR; y++) put(x, y, hex("#2a3a66"), FAR);
  }
  for (let y = HOR; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = (y - HOR) / (H - HOR);
      put(x, y, ramp([[0, "#5a7aa8"], [0.15, "#3c5484"], [0.5, "#2e4272"], [1, "#22325e"]], k), SEA);
    }
  }
  const topY = (x: number) => 52 - (x - 104) * 0.02 + 1.5 * fbm(x / 6, 1, 3, 17);
  const faceX = (y: number) => 104 - (y - 52) * 0.35 + 5 * (fbm(y / 4, 3, 3, 19) - 0.5) - (y > 84 ? (y - 84) * 1.2 : 0);
  for (let y = 46; y < H; y++) {
    for (let x = 60; x < W; x++) {
      if (y < topY(x) || x < faceX(y)) continue;
      const strata = Math.sin(y * 0.9 + x * 0.15 + fbm(x / 8, y / 8, 2, 5) * 4), n = fbm(x / 5, y / 5, 3, 23);
      let c = n > 0.6 ? hex("#141a2a") : strata > 0.7 ? hex("#141a2a") : hex("#0a0e1a");
      if (y < topY(x) + 2) c = hex("#16242a");
      if (x < faceX(y) + 1) c = hex("#1e2638");
      put(x, y, c, CLIFF);
    }
  }
  for (let y = LY + 6; y <= 54; y++) {
    const hw = 3.2 + (y - LY - 6) * 0.075, band = (y > 30 && y < 34) || (y > 42 && y < 46);
    for (let x = Math.round(LX - hw); x <= Math.round(LX + hw); x++) {
      const lit = clamp(0.75 - (x - LX + hw) / (2 * hw) * 0.6);
      put(x, y, band ? mix(hex("#5a2232"), hex("#7a3040"), lit) : mix(hex("#6a7898"), hex("#aab6d0"), lit), TOWER);
    }
  }
  for (let x = LX - 6; x <= LX + 6; x++) { 
    put(x, LY + 5, hex("#0a0e1a"), TOWER); 
    put(x, LY + 4, (x - LX) % 2 ? hex("#0a0e1a") : hex("#1e2638"), TOWER); 
  }
  for (let y = LY - 3; y <= LY + 3; y++) {
    for (let x = LX - 4; x <= LX + 4; x++) {
      put(x, y, Math.abs(x - LX) === 4 || Math.abs(x - LX) === 2 ? hex("#141a2a") : hex("#fff0b8"), TOWER);
    }
  }
  for (let y = LY - 7; y <= LY - 4; y++) { 
    const hw = (y - (LY - 8)) * 1.3; 
    for (let x = Math.round(LX - hw); x <= Math.round(LX + hw); x++) put(x, y, hex("#0a0e1a"), TOWER); 
  }
  put(LX, LY - 8, hex("#0a0e1a"), TOWER); 
  put(LX, LY - 9, hex("#0a0e1a"), TOWER);
  for (let y = 46; y <= 54; y++) {
    for (let x = 162; x <= 184; x++) {
      put(x, y, mix(hex("#6a7898"), hex("#8a98b8"), x < 170 ? 0.6 : 0.2), TOWER);
    }
  }
  for (let y = 40; y <= 45; y++) {
    for (let x = 160 + (y - 40); x <= 186 - (y - 40) * 0.2; x++) put(x, y, hex("#0a0e1a"), TOWER);
  }
  for (let y = 36; y <= 41; y++) { 
    put(180, y, hex("#141a2a"), TOWER); 
    put(181, y, hex("#141a2a"), TOWER); 
  }
  const windows = [[166, 48], [176, 48]];

  const F = makeFrame(rgb, layer, PAL);
  const { add } = F;
  const clouds = [[0.15, 0.35, 12, 3, 0.9], [0.6, 0.42, 22, 2.5, 0.6], [0.9, 0.3, 6, 2, 1.2], [0.35, 0.28, 34, 2, 0.8], [0.8, 0.5, 44, 3, 0.5]];
  const ripples = Array.from({ length: 26 }, (_, i) => ({ u: ((i * 61) % 89) / 89, ph: ((i * 29) % 41) / 41 }));
  const CL = hex("#2a3a66"), CL2 = hex("#3a4c7a"), INK = hex("#0a0e1a"), WARM = hex("#ffb860"), BEAM = hex("#fff0b8");

  return (t: number) => {
    F.begin();
    for (const [u, len, v, th, sp] of clouds) {
      const L = len * W, cx = ((((u * W + t * sp * 1.5) % (W + L)) + W + L) % (W + L)) - L / 2;
      for (let y = Math.floor(v - th * 3); y <= v + th * 3; y++) {
        for (let x = Math.max(0, Math.floor(cx - L / 2)); x < Math.min(W, cx + L / 2); x++) {
          const along = 1 - Math.abs((x - cx) / (L / 2)), n = noise2(x / 7, y / 3 + v, 4);
          const a = clamp(along * 2.5) * clamp(1.2 - Math.abs(y - v - (n - 0.5) * 3) / (th * (0.6 + along)));
          if (a > 0.05) add(x, y, y < v ? CL2 : CL, a * 0.9, SKY);
        }
      }
    }
    const sx = Math.round(lerp(-40, 120, ((t + 26) % 64) / 64)), sy = HOR - 1;
    for (let x = -13; x <= 13; x++) { 
      add(sx + x, sy, INK, 1, SEA); 
      if (Math.abs(x) < 12) add(sx + x, sy - 1, INK, 1, SEA); 
    }
    for (let x = -4; x <= 6; x++) for (let y = 2; y <= 4; y++) add(sx + x, sy - y, INK, 1, SEA);
    for (let y = 5; y <= 9; y++) add(sx + 3, sy - y, INK, 1, SEA);
    for (let y = 2; y <= 8; y++) add(sx - 9, sy - y, INK, 1, SEA);
    add(sx + 4, sy - 7, INK, 1, SEA); 
    add(sx + 2, sy - 6, INK, 1, SEA);
    for (const px of [-8, -5, -2, 1, 4, 7, 10]) add(sx + px, sy - 1, WARM, 0.9, SEA);
    add(sx - 9, sy - 9, hex("#ffe08a"), 1, SEA);
    for (const rp of ripples) {
      const p = (rp.ph + t * 0.03) % 1, y = Math.round(HOR + 2 + (H - HOR - 3) * Math.pow(p, 1.4));
      const len = 3 + 16 * p, x0 = rp.u * (W + 20) - 10;
      for (let x = Math.round(x0 - len / 2); x < x0 + len / 2; x++) { 
        add(x, y, hex("#8aa0c8"), 0.55, SEA); 
        add(x, y + 1, hex("#1a2c52"), 0.5, SEA); 
      }
    }
    for (let y = HOR + 6; y < H; y++) {
      let fx = -1;
      for (let x = 60; x < W; x++) if (layer[y * W + x] === CLIFF) { fx = x; break; }
      if (fx < 0) continue;
      const p = (t * 0.6 + y * 0.07) % 1, reach = Math.round(2 + p * 8);
      for (let x = fx - reach; x < fx; x++) add(x, y, hex("#a8b8d8"), (1 - p) * 0.75 * (x === fx - reach ? 1 : 0.5), SEA);
    }
    windows.forEach(([x, y], i) => {
      const f = 0.85 + 0.15 * Math.sin(t * 5.3 + i * 2) * Math.sin(t * 1.7 + i);
      for (let yy = y; yy < y + 3; yy++) for (let xx = x; xx < x + 3; xx++) add(xx, yy, mix(hex("#e89048"), hex("#ffb860"), f), 1);
    });
    const th = t * 0.8, cs = Math.cos(th), sn = Math.sin(th), dir = cs >= 0 ? 1 : -1, L = 8 + 150 * Math.abs(cs);
    for (let dx = 4; dx < L; dx++) {
      const x = LX + dir * dx, hh = 1.5 + dx * 0.19, k = Math.pow(1 - dx / L, 0.6) * (0.45 + 0.35 * Math.abs(cs));
      if (x < 0 || x >= W) break;
      for (let y = Math.floor(LY - hh); y <= Math.ceil(LY + hh); y++) {
        const e = 1 - Math.abs(y - LY) / hh;
        if (e > 0) { 
          const i = y * W + Math.round(x); 
          if (layer[i] !== TOWER) add(x, y, BEAM, k * Math.min(1, e * 1.6)); 
        }
      }
    }
    const fr = 3 + 7 * clamp(sn), fa = 0.3 + 0.55 * clamp(sn);
    for (let y = LY - 12; y <= LY + 12; y++) {
      for (let x = LX - 14; x <= LX + 14; x++) {
        const d = Math.hypot(x - LX, y - LY);
        if (d < fr + 4) add(x, y, BEAM, clamp(1 - d / (fr + 4)) * fa);
      }
    }
    for (let y = LY - 2; y <= LY + 2; y++) for (let x = LX - 2; x <= LX + 2; x++) add(x, y, hex("#fffbe8"), 1);
    return F.finish();
  };
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<'in' | 'up'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'signup' || window.location.hash === '#signup') return 'up';
    }
    return 'in';
  });

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex@apexlogistics.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forgot password sub-view
  const [isForgot, setIsForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Canvas animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = createScene();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = 0, t0 = performance.now();
    let animId: number;

    const resize = () => { 
      canvas.width = window.innerWidth * dpr; 
      canvas.height = window.innerHeight * dpr; 
    };
    window.addEventListener("resize", resize); 
    resize();

    function draw(now: number) {
      if (!ctx || !canvas) return;
      const { text, color } = frame((now - t0) / 1000);
      const T = text.split("\n"), C = color.split("\n");
      const cell = Math.max(canvas.width / meta.cols, canvas.height / meta.rows);
      const ox = (canvas.width - cell * meta.cols) / 2, oy = (canvas.height - cell * meta.rows) / 2;
      ctx.fillStyle = "#0c1430";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let cur = "";
      for (let y = 0; y < meta.rows; y++) {
        for (let x = 0; x < meta.cols; x++) {
          const lv = LEVELS.indexOf(T[y][x]), col = meta.palette[C[y][x]];
          if (col !== cur) { ctx.fillStyle = col; cur = col; }
          ctx.beginPath();
          ctx.arc(ox + (x + 0.5) * cell, oy + (y + 0.5) * cell, cell * (0.18 + 0.36 * lv / 7), 0, 6.2832);
          ctx.fill();
        }
      }
    }

    function loop(now: number) {
      animId = requestAnimationFrame(loop);
      if (document.hidden || now - last < 1000 / meta.fps) return;
      last = now; 
      draw(now);
    }

    if (reduce) {
      draw(t0 + 4000);
    } else {
      animId = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isForgot) {
      if (!forgotEmail) {
        setError('Please enter your email.');
        return;
      }
      setLoading(true);
      try {
        await authApi.forgotPassword(forgotEmail);
        setForgotSent(true);
      } catch (err: any) {
        setError(err?.message || 'Password reset failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'up') {
      if (!name) {
        setError('Name is required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      setLoading(true);
      try {
        const res = await authApi.register({
          fullName: name,
          email,
          password,
          confirmPassword,
        });
        if (res.success && res.user) {
          setSuccess('Account created! Entering Operations Room...');
          setTimeout(() => onAuthenticated(res.user), 600);
        }
      } catch (err: any) {
        setError(err?.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const res = await authApi.login({ email, password });
        if (res.success && res.user) {
          setSuccess(`Welcome back, ${res.user.fullName}!`);
          setTimeout(() => onAuthenticated(res.user), 500);
        }
      } catch (err: any) {
        setError(err?.message || 'Authentication failed. Please verify credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  const setTab = (m: 'in' | 'up') => {
    setMode(m);
    setIsForgot(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#0c1430] text-[#e8eeff] font-sans antialiased">
      {/* Halftone canvas background */}
      <canvas
        ref={canvasRef}
        id="bg"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full block z-0"
      />

      {/* Main Container */}
      <main className="relative min-h-screen flex items-center justify-center p-6 z-10">
        <form
          id="login"
          onSubmit={handleSubmit}
          autoComplete="on"
          className="w-full max-w-[360px] p-7 rounded-[14px] bg-[rgba(10,14,26,0.74)] border border-[rgba(170,182,208,0.28)] backdrop-blur-[10px] grid gap-3.5 shadow-2xl transition-all duration-200"
        >
          {/* Tabs */}
          <div
            className="grid grid-cols-2 p-1 gap-1 rounded-[10px] bg-[rgba(5,8,20,0.6)] border border-[rgba(170,182,208,0.28)]"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              id="tab-in"
              aria-selected={mode === 'in' && !isForgot}
              onClick={() => setTab('in')}
              className={`p-[9px] text-[14px] rounded-[7px] cursor-pointer transition-colors ${
                mode === 'in' && !isForgot
                  ? 'bg-[#ffd98a] text-[#14182a] font-semibold'
                  : 'bg-transparent text-[#9fb0d4] font-medium hover:bg-white/5'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              id="tab-up"
              aria-selected={mode === 'up' && !isForgot}
              onClick={() => setTab('up')}
              className={`p-[9px] text-[14px] rounded-[7px] cursor-pointer transition-colors ${
                mode === 'up' && !isForgot
                  ? 'bg-[#ffd98a] text-[#14182a] font-semibold'
                  : 'bg-transparent text-[#9fb0d4] font-medium hover:bg-white/5'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Heading and Subtitle */}
          <div>
            <h1
              id="title"
              className="m-0 mb-0.5 font-semibold text-[28px] leading-[1.15] font-serif text-[#e8eeff]"
            >
              {isForgot ? 'Reset password' : mode === 'up' ? 'Create your account' : 'Sign in'}
            </h1>
            <p id="sub" className="m-0 text-[#9fb0d4] text-[14px]">
              {isForgot
                ? 'Enter your email to receive a password reset link.'
                : mode === 'up'
                ? 'It takes less than a minute.'
                : 'Welcome back. Enter your details to continue.'}
            </p>
          </div>

          {/* Error / Success Notifications */}
          {error && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="p-2.5 rounded-lg bg-[#ffd98a]/20 border border-[#ffd98a]/50 text-[#ffd98a] text-xs font-medium">
              {success}
            </div>
          )}

          {/* Forgot Password View */}
          {isForgot ? (
            <>
              {forgotSent ? (
                <div className="text-center py-2 space-y-3">
                  <p className="text-xs text-[#ffd98a]">
                    Reset link sent! Please check your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(false);
                      setForgotSent(false);
                      setMode('in');
                    }}
                    className="text-xs text-[#9fb0d4] underline cursor-pointer hover:text-[#e8eeff]"
                  >
                    Back to Sign in
                  </button>
                </div>
              ) : (
                <>
                  <label className="grid gap-1.5 text-[13px] text-[#9fb0d4]">
                    Email
                    <input
                      type="email"
                      name="forgotEmail"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="alex@apexlogistics.com"
                      required
                      className="font-inherit text-[#e8eeff] bg-[rgba(5,8,20,0.6)] border border-[rgba(170,182,208,0.28)] rounded-lg p-[11px_12px] focus:outline-none focus:ring-2 focus:ring-[#ffd98a] focus:ring-offset-2 focus:ring-offset-[#0c1430]"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-semibold text-[15px] p-3 border-0 rounded-lg bg-[#ffd98a] text-[#14182a] cursor-pointer hover:bg-[#ffe7ab] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send reset link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(false);
                      setError(null);
                    }}
                    className="text-xs text-[#9fb0d4] underline text-center cursor-pointer hover:text-[#e8eeff] bg-transparent border-0"
                  >
                    Back to Sign in
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {/* Form Fields: Up only (Name) */}
              {mode === 'up' && (
                <label className="grid gap-1.5 text-[13px] text-[#9fb0d4]">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required={mode === 'up'}
                    className="font-inherit text-[#e8eeff] bg-[rgba(5,8,20,0.6)] border border-[rgba(170,182,208,0.28)] rounded-lg p-[11px_12px] focus:outline-none focus:ring-2 focus:ring-[#ffd98a] focus:ring-offset-2 focus:ring-offset-[#0c1430]"
                  />
                </label>
              )}

              {/* Email */}
              <label className="grid gap-1.5 text-[13px] text-[#9fb0d4]">
                Email
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="font-inherit text-[#e8eeff] bg-[rgba(5,8,20,0.6)] border border-[rgba(170,182,208,0.28)] rounded-lg p-[11px_12px] focus:outline-none focus:ring-2 focus:ring-[#ffd98a] focus:ring-offset-2 focus:ring-offset-[#0c1430]"
                />
              </label>

              {/* Password */}
              <label className="grid gap-1.5 text-[13px] text-[#9fb0d4]">
                Password
                <input
                  type="password"
                  name="password"
                  id="pw"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'up' ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                  className="font-inherit text-[#e8eeff] bg-[rgba(5,8,20,0.6)] border border-[rgba(170,182,208,0.28)] rounded-lg p-[11px_12px] focus:outline-none focus:ring-2 focus:ring-[#ffd98a] focus:ring-offset-2 focus:ring-offset-[#0c1430]"
                />
              </label>

              {/* Confirm Password: Up only */}
              {mode === 'up' && (
                <label className="grid gap-1.5 text-[13px] text-[#9fb0d4]">
                  Confirm password
                  <input
                    type="password"
                    name="confirm"
                    id="pw2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required={mode === 'up'}
                    className="font-inherit text-[#e8eeff] bg-[rgba(5,8,20,0.6)] border border-[rgba(170,182,208,0.28)] rounded-lg p-[11px_12px] focus:outline-none focus:ring-2 focus:ring-[#ffd98a] focus:ring-offset-2 focus:ring-offset-[#0c1430]"
                  />
                </label>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="go"
                disabled={loading}
                className="font-semibold text-[15px] p-3 border-0 rounded-lg bg-[#ffd98a] text-[#14182a] cursor-pointer hover:bg-[#ffe7ab] transition-colors disabled:opacity-50 mt-1"
              >
                {loading
                  ? 'Processing...'
                  : mode === 'up'
                  ? 'Sign up'
                  : 'Sign in'}
              </button>

              {/* Forgot password link */}
              {mode === 'in' && (
                <div className="flex items-center justify-between pt-1">
                  <a
                    href="#forgot"
                    id="forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsForgot(true);
                      setForgotEmail(email);
                      setError(null);
                    }}
                    className="text-[#9fb0d4] text-[13px] hover:text-[#e8eeff] transition-colors"
                  >
                    Forgot your password?
                  </a>

                  {/* Discrete demo credentials helper */}
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('alex@apexlogistics.com');
                      setPassword('password123');
                    }}
                    className="text-[11px] font-mono text-[#9fb0d4]/70 hover:text-[#ffd98a] bg-transparent border-0 cursor-pointer p-0"
                    title="Fill demo account"
                  >
                    Demo fill
                  </button>
                </div>
              )}
            </>
          )}
        </form>
      </main>
    </div>
  );
};
