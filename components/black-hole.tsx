"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight black hole + 3D starfield background.
 *
 * Single full-screen fragment shader (WebGL1, no dependencies). Performance guards:
 * - renders at a reduced, adaptive resolution and upscales with CSS
 * - caps the frame rate (30fps on low-end hardware) and drops resolution if frames run long
 * - pauses when off-screen or when the tab is hidden
 * - renders a single still frame when the user prefers reduced motion
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uIntensity;
uniform vec2 uPointer;
uniform float uPointerAmt;
uniform float uFlow;
uniform float uAppear;

#define TAU 6.28318530718

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Value noise that tiles every "period" cells along y. Used with y = turns * period so the
// texture wraps around the disk with no seam where atan() jumps from +pi to -pi.
float noiseP(vec2 p, float period) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float y0 = mod(i.y, period);
  float y1 = mod(i.y + 1.0, period);
  float a = hash21(vec2(i.x, y0));
  float b = hash21(vec2(i.x + 1.0, y0));
  float c = hash21(vec2(i.x, y1));
  float d = hash21(vec2(i.x + 1.0, y1));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbmP(vec2 p, float period) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 3; i++) {
    v += a * noiseP(p, period);
    p = p * 2.0 + vec2(11.7, 5.0);
    period *= 2.0;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

// Streaky gas texture in polar coordinates: r in units of R, turns = angle / TAU (any real),
// N = integer number of features per revolution. Seamless around the full circle.
float streaks(float r, float turns, float N) {
  float n = fbmP(vec2(r * 2.2, turns * N), N);
  float fine = noiseP(vec2(r * 4.0, turns * N * 4.0), N * 4.0);
  return n * 0.8 + fine * 0.25;
}

// Angular velocity of the gas in turns per unit of flow time (inner rings orbit faster).
float orbit(float rd) {
  return 0.5 / TAU * pow(1.45 / rd, 1.3);
}

// One layer of orbiting gas: the texture is advected by "phase" units of flow time.
float gasLayer(float rd, float turns, float phase, float seed) {
  float t = turns + orbit(rd) * phase;
  // Turbulence rides along with the gas so lanes wobble without drifting off-orbit.
  float wobble = (noiseP(vec2(rd * 1.4 + seed, t * 6.0), 6.0) - 0.5) * 0.5;
  return streaks(rd + wobble + seed, t, 22.0);
}

// Differential rotation winds any texture into ever-tighter spirals, which reads as jitter
// after a while. Two layers advected over a short cycle and cross-faded keep the shear
// bounded, so the disk flows smoothly and steadily forever.
#define FLOW_CYCLE 6.0
float disk(vec2 D, float time) {
  float rd = length(D);
  float rin = 1.45;
  float rout = 7.5;
  if (rd < rin * 0.75 || rd > rout) return 0.0;
  float edge = smoothstep(rin * 0.85, rin * 1.15, rd) * (1.0 - smoothstep(rout * 0.3, rout, rd));
  float profile = pow(rin / rd, 1.35) * (1.0 + 1.3 * exp(-(rd - rin) * 1.6));
  float turns = atan(D.y, D.x) / TAU;

  float cyc = time / FLOW_CYCLE;
  float a = fract(cyc);
  float b = fract(cyc + 0.5);
  float wa = 1.0 - abs(2.0 * a - 1.0);
  float nA = gasLayer(rd, turns, a * FLOW_CYCLE, 0.0);
  float nB = gasLayer(rd, turns, b * FLOW_CYCLE, 4.7);
  // Blend, then restore the contrast that averaging two textures washes out.
  float n = mix(nB, nA, wa);
  n = 0.5 + (n - 0.5) / sqrt(wa * wa + (1.0 - wa) * (1.0 - wa));

  float lanes = 0.45 + 0.95 * n * n;
  // Relativistic beaming: the approaching (left) side glows brighter.
  float doppler = 1.0 - 0.3 * (D.x / rd);
  return edge * profile * max(lanes, 0.0) * doppler;
}

// Smooth, noise-free glow of a puffier disk; stands in for bloom.
float diskGlow(vec2 D) {
  float rd = length(D);
  return smoothstep(0.9, 1.5, rd) * exp(-(rd - 1.4) * 0.75);
}

vec3 heat(float i) {
  vec3 ember = vec3(1.0, 0.3, 0.04);
  vec3 amber = vec3(1.0, 0.52, 0.14);
  vec3 white = vec3(1.0, 0.8, 0.55);
  vec3 c = mix(ember, amber, smoothstep(0.08, 0.6, i));
  c = mix(c, white, smoothstep(0.75, 1.8, i));
  return c * i;
}

// Fine dust orbiting in the disk. Each ring of the disk (in disk-plane space) is split into
// cells that rotate with the ring; a cell may hold one particle. The particle is drawn at its
// true projected position, so it stays round on screen at any inclination.
// qs: disk-frame position in units of R. Returns brightness.
float particles(vec2 qs, float incl, float t, float R) {
  vec2 D = vec2(qs.x, qs.y / incl);
  float rd = length(D);
  float ringW = 0.085;
  float ri = floor(rd / ringW);
  float rc = (ri + 0.5) * ringW;
  if (rc < 1.35 || rc > 6.0) return 0.0;
  float h0 = hash21(vec2(ri, 7.13));
  float cells = floor(TAU * rc / 0.16);
  // Same orbital speed as the gas, so dust and lanes move together.
  float spin = t * orbit(rc) + h0;
  float turns = fract(atan(D.y, D.x) / TAU + spin);
  float cell = floor(turns * cells);
  float h = hash21(vec2(ri, cell));
  if (h < 0.62) return 0.0;
  float h2 = hash21(vec2(cell, ri + 3.1));
  float ca = (cell + 0.5 + (h2 - 0.5) * 0.5) / cells;
  float pr = rc + (hash21(vec2(ri + 5.3, cell)) - 0.5) * ringW * 0.5;
  float th = (ca - spin) * TAU;
  vec2 pp = vec2(cos(th), sin(th) * incl) * pr;
  float d = length(qs - pp) * R;
  float size = (0.6 + 0.9 * h2) / uRes.y;
  float g = exp(-(d * d) / (size * size));
  float tw = 0.55 + 0.45 * sin(t * (1.5 + 3.0 * h) + h * 50.0);
  return g * tw * pow(1.45 / rc, 0.8) * (h - 0.62) * 2.6;
}

vec3 starfield(vec2 uv, float time) {
  vec3 col = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    // Each layer drifts toward the viewer and recycles, giving continuous depth.
    float z = fract(fi * 0.25 + time * 0.008);
    float scale = mix(34.0, 7.0, z);
    float fade = smoothstep(0.0, 0.3, z) * (1.0 - smoothstep(0.8, 1.0, z));
    vec2 par = uMouse * (0.015 + z * 0.07);
    vec2 g = (uv + par) * scale + fi * 19.7;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash21(id);
    vec2 o = vec2(hash21(id + 3.7), hash21(id + 9.1)) - 0.5;
    float d = length(f - o * 0.75);
    float px = scale / uRes.y;
    float size = px * (0.45 + 1.1 * h * z);
    float s = exp(-(d * d) / (size * size));
    float tw = 0.7 + 0.3 * sin(time * (1.0 + 2.0 * h) + h * 40.0);
    float on = step(0.66, h);
    vec3 tint = mix(vec3(0.75, 0.83, 1.0), vec3(1.0, 0.86, 0.72), hash21(id + 1.3));
    col += tint * s * fade * tw * on * (0.35 + 0.9 * h);
  }
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float appear = uAppear;
  // Intro: the hole settles in from slightly larger while everything ignites.
  float R = uRadius * (1.0 + 0.12 * (1.0 - appear));
  vec2 p = uv - uCenter - uMouse * vec2(0.012, 0.008);
  float r = length(p);

  // Gravitational lensing of the background: pull the sky outward around the hole.
  float bend = (R * R * 1.15) / max(r * r, 1e-4);
  vec2 lensed = p * (1.0 - min(bend, 1.8));
  vec3 sky = starfield(lensed, uTime) * smoothstep(0.0, 0.6, appear);

  // Pointer: a soft repulsion field that gently parts the dust (and barely nudges the gas).
  vec2 dm = uv - uPointer;
  float d2 = dot(dm, dm);
  float field = exp(-d2 / 0.01) * uPointerAmt;
  vec2 push = dm * inversesqrt(d2 + 1e-4) * field * 0.028;

  // Disk frame: slight tilt that follows the pointer, viewed nearly edge-on.
  float tilt = -0.2 + uMouse.x * 0.025;
  mat2 frame = rot(tilt);
  vec2 q0 = frame * p / R;                   // geometry: the shadow stays perfectly round
  vec2 q = frame * (p - push * 0.3) / R;     // gas
  vec2 qd = frame * (p - push) / R;          // dust
  float incl = 0.19 + uMouse.y * 0.015;
  vec2 D = vec2(q.x, q.y / incl);
  float qr = length(q);
  float qr0 = length(q0);
  float qInv = 1.0 / max(qr, 1e-4);

  float shadow = smoothstep(0.985, 1.01, qr0);
  // Dim anything in front of the shadow so text on top stays readable.
  float overShadow = mix(0.2, 1.0, shadow);

  // Intro reveal: the disk lights up from the inner edge outward.
  float reach = mix(1.2, 9.0, appear * appear);
  float reveal = 1.0 - smoothstep(reach - 1.2, reach, length(D));

  // Flat disk: the far half is hidden by the shadow, the near half crosses in front of it.
  float dI = disk(D, uFlow);
  float glow = diskGlow(vec2(q.x, q.y / (incl * 1.9)));
  float behind = smoothstep(-0.03, 0.03, q.y);
  // Where the near side crosses the shadow it reads thicker and hotter.
  float near = (1.0 - behind) * exp(-max(length(D) - 1.45, 0.0) * 0.9) * exp(-max(qr - 1.0, 0.0) * 2.5);
  vec3 diskCol = heat((dI * (1.0 + 0.3 * near) + glow * (0.35 + 0.55 * near)) * 1.2) * reveal;
  vec3 back = diskCol * behind;
  vec3 front = diskCol * (1.0 - behind) * overShadow;

  // Orbiting dust.
  float dust = particles(qd, incl, uFlow, R) * reveal;
  float dustBehind = step(0.0, qd.y);
  vec3 dustCol = vec3(1.0, 0.66, 0.36) * dust * 1.3;

  // Lensed image of the far side: a ring wrapped around the shadow, thick on top, thin below.
  float s = q.y * qInv;
  float width = mix(0.2, 0.75, smoothstep(-0.8, 0.9, s));
  float h = (qr - 1.015) / width;
  float ring = h > 0.0 ? exp(-h * 1.7) * smoothstep(0.0, 0.08, h) : 0.0;
  float angle = atan(q.y, q.x);
  // Rigid rotation (no shear), so a single seamless sample is enough.
  float hn = streaks(1.45 + h * 2.2, angle / TAU + uFlow * 0.3 / TAU, 11.0);
  float haloI = ring * (0.45 + 1.0 * hn) * mix(0.6, 1.2, smoothstep(-0.6, 0.8, s));
  haloI *= 1.0 - 0.25 * (q.x * qInv);
  haloI *= smoothstep(0.0, 1.0, appear * 4.0 - h);
  vec3 halo = heat(haloI * 1.5);

  // Photon ring and soft corona (cheap bloom around the shadow).
  float ignite = smoothstep(0.0, 0.35, appear);
  float photon = exp(-pow((qr0 - 1.012) / 0.02, 2.0)) * 1.1 * ignite;
  float corona = qr0 > 1.0 ? exp(-(qr0 - 1.0) * 2.2) * 0.24 * ignite : 0.0;

  vec3 col = (sky + back + halo + dustCol * dustBehind) * shadow;
  col += front + dustCol * (1.0 - dustBehind) * overShadow;
  col += heat(photon + corona * shadow);

  // Keep it in the background: soften highlights, dim overall, fade at the edges.
  col = 1.0 - exp(-col * 1.25);
  // Fade the far ends of the disk and the screen edges.
  float vig = 1.0 - smoothstep(2.2, 5.5, length(q0 * vec2(0.5, 1.0)));
  float edge = 1.0 - smoothstep(0.55, 1.1, length(uv * vec2(0.62, 1.0)));
  col *= uIntensity * mix(0.4, 1.0, vig * edge);

  // Dither to avoid banding in the dark gradients.
  col += (hash21(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  className?: string;
  intensity?: number;
  /** Element whose text the shadow should sit behind; the hole is sized and centred to cover it. */
  coverRef?: RefObject<HTMLElement | null>;
};

// Breathing room (CSS px) between the covered text and the edge of the shadow.
const COVER_PADDING = 28;

export function BlackHole({ className, intensity = 0.55, coverRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      center: gl.getUniformLocation(prog, "uCenter"),
      radius: gl.getUniformLocation(prog, "uRadius"),
      intensity: gl.getUniformLocation(prog, "uIntensity"),
      pointer: gl.getUniformLocation(prog, "uPointer"),
      pointerAmt: gl.getUniformLocation(prog, "uPointerAmt"),
      flow: gl.getUniformLocation(prog, "uFlow"),
      appear: gl.getUniformLocation(prog, "uAppear"),
    };

    const nav = navigator as Navigator & { deviceMemory?: number };
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const lowEnd = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Render scale in device pixels per CSS pixel. The scene is soft, so it rarely needs
    // full resolution: 0.75 on standard screens and phones, 1.0 on retina desktops,
    // 0.55 on low-end devices.
    const dpr = window.devicePixelRatio || 1;
    const baseScale = lowEnd ? 0.55 : coarsePointer ? 0.75 : Math.min(1, 0.75 * Math.max(1, dpr * 0.75));
    const MIN_Q = 0.45;
    const maxQ = 1;
    let quality = maxQ;
    const frameInterval = lowEnd ? 1000 / 30 : 1000 / 60;

    let width = 0;
    let height = 0;
    let cssW = 1;
    let cssH = 1;

    // Hole placement in shader units (uv: y-up, 1 unit = canvas height). Eased toward target.
    const hole = { x: 0, y: 0.05, r: 0.155, tx: 0, ty: 0.05, tr: 0.155 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = baseScale * quality;
      width = Math.max(1, Math.round(rect.width * scale));
      height = Math.max(1, Math.round(rect.height * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      cssW = Math.max(rect.width, 1);
      cssH = Math.max(rect.height, 1);
      gl.uniform2f(u.res, width, height);
      measure(true);
    };

    const toUv = (x: number, y: number) => ({ x: (x - cssW / 2) / cssH, y: (cssH / 2 - y) / cssH });

    // Size and centre the shadow so it covers every line of the covered content.
    const measure = (snap = false) => {
      const target = coverRef?.current;
      const cr = canvas.getBoundingClientRect();
      if (!target) {
        const aspect = cssW / cssH;
        hole.tx = 0;
        hole.ty = aspect < 1 ? 0.07 : 0.05;
        hole.tr = 0.155 * Math.min(1, Math.max(0.7, aspect * 0.75));
      } else {
        const range = document.createRange();
        const boxes: DOMRect[] = [];
        for (const child of Array.from(target.children)) {
          range.selectNodeContents(child);
          const b = range.getBoundingClientRect();
          if (b.width && b.height) boxes.push(b);
        }
        if (!boxes.length) return;
        const left = Math.min(...boxes.map((b) => b.left));
        const right = Math.max(...boxes.map((b) => b.right));
        const top = Math.min(...boxes.map((b) => b.top));
        const bottom = Math.max(...boxes.map((b) => b.bottom));
        const cx = (left + right) / 2;
        const cy = (top + bottom) / 2;
        let reach = 0;
        for (const b of boxes) {
          for (const [x, y] of [
            [b.left, b.top],
            [b.right, b.top],
            [b.left, b.bottom],
            [b.right, b.bottom],
          ]) {
            reach = Math.max(reach, Math.hypot(x - cx, y - cy));
          }
        }
        const c = toUv(cx - cr.left, cy - cr.top);
        hole.tx = c.x;
        hole.ty = c.y;
        hole.tr = (reach + COVER_PADDING) / cssH;
      }
      if (snap || !running) {
        hole.x = hole.tx;
        hole.y = hole.ty;
        hole.r = hole.tr;
      }
    };

    const applyHole = () => {
      gl.uniform2f(u.center, hole.x, hole.y);
      gl.uniform1f(u.radius, hole.r);
    };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    // Pointer in shader units for the dust interaction. `amt` rises with pointer speed and
    // relaxes when it rests, so the dust only parts while you move.
    const flowPtr = { x: 0, y: -10, tx: 0, ty: -10, px: 0, py: -10, amt: 0, active: false };
    let flow = 0;
    let appear = reducedMotion ? 1 : 0;
    let appearStart = -1;
    const onPointer = (e: PointerEvent) => {
      if (!coarsePointer || e.pointerType !== "touch") {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      }
      const cr = canvas.getBoundingClientRect();
      const p = toUv(e.clientX - cr.left, e.clientY - cr.top);
      flowPtr.tx = p.x;
      flowPtr.ty = p.y;
      if (!flowPtr.active) {
        flowPtr.active = true;
        flowPtr.x = flowPtr.px = p.x;
        flowPtr.y = flowPtr.py = p.y;
      }
    };

    gl.uniform1f(u.intensity, intensity);

    let raf = 0;
    let disposed = false;
    let visible = true;
    let running = false;
    let last = 0;
    let elapsed = 0;
    let slowFrames = 0;
    let fastFrames = 0;
    let firstFrame = true;

    const draw = () => {
      if (disposed) return;
      // The context is shared if the component remounts (e.g. React strict mode), so always
      // bind our own program before setting uniforms.
      gl.useProgram(prog);
      applyHole();
      gl.uniform1f(u.time, elapsed);
      gl.uniform1f(u.flow, flow);
      gl.uniform1f(u.appear, appear);
      gl.uniform1f(u.pointerAmt, flowPtr.amt);
      gl.uniform2f(u.pointer, flowPtr.x, flowPtr.y);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = now - last;
      if (dt < frameInterval - 1) return;
      last = now;
      // Clamp so the animation doesn't jump after a pause.
      const step = Math.min(dt, 100) / 1000;
      const k = step * 60; // frame-rate independent easing factor
      elapsed += step;

      // Ease the hole toward its measured placement (fonts/layout can shift it slightly).
      hole.x += (hole.tx - hole.x) * Math.min(1, 0.08 * k);
      hole.y += (hole.ty - hole.y) * Math.min(1, 0.08 * k);
      hole.r += (hole.tr - hole.r) * Math.min(1, 0.08 * k);

      // Intro: ease out over ~2.6s once the first frame is on screen.
      if (appearStart < 0) appearStart = now;
      const ta = Math.min(1, Math.max(0, (now - appearStart - 100) / 2600));
      appear = 1 - Math.pow(1 - ta, 3);

      // Dust interaction: pointer speed drives a gentle, short-lived repulsion.
      if (flowPtr.active) {
        const speed = Math.hypot(flowPtr.tx - flowPtr.px, flowPtr.ty - flowPtr.py);
        flowPtr.px = flowPtr.tx;
        flowPtr.py = flowPtr.ty;
        const target = Math.min(1, speed * 60);
        const rate = target > flowPtr.amt ? 0.12 : 0.03;
        flowPtr.amt += (target - flowPtr.amt) * Math.min(1, rate * k);
        flowPtr.x += (flowPtr.tx - flowPtr.x) * Math.min(1, 0.15 * k);
        flowPtr.y += (flowPtr.ty - flowPtr.y) * Math.min(1, 0.15 * k);
      }
      // The disk spins in quickly during the intro, then settles to its steady rotation.
      flow += step * (1 + 3 * (1 - appear) * (1 - appear));

      // Pointer easing; idle drift on touch devices.
      if (coarsePointer) {
        mouse.tx = Math.sin(elapsed * 0.15) * 0.35;
        mouse.ty = Math.cos(elapsed * 0.11) * 0.25;
      }
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      draw();

      // Adaptive resolution: step down when frames take too long, recover slowly.
      if (dt > frameInterval * 1.6 && dt < 250) {
        slowFrames++;
        fastFrames = 0;
      } else {
        fastFrames++;
        slowFrames = Math.max(0, slowFrames - 1);
      }
      if (slowFrames > 20 && quality > MIN_Q) {
        quality = Math.max(MIN_Q, quality * 0.8);
        slowFrames = 0;
        resize();
      } else if (fastFrames > 600 && quality < maxQ) {
        quality = Math.min(maxQ, quality * 1.1);
        fastFrames = 0;
        resize();
      }
    };

    const start = () => {
      if (running || reducedMotion || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    elapsed = 12; // start mid-rotation so the disk already has structure
    flow = 12;
    draw();
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(canvas);
    if (coverRef?.current) ro.observe(coverRef.current);

    // Re-measure once web fonts load and entrance animations settle.
    const remeasure = () => {
      if (disposed) return;
      measure();
      if (!running) draw();
    };
    document.fonts?.ready.then(remeasure);
    const timers = [600, 1200].map((t) => window.setTimeout(remeasure, t));

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      disposed = true;
      stop();
      timers.forEach(clearTimeout);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [intensity, coverRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block size-full transition-opacity duration-700 ease-out", ready ? "opacity-100" : "opacity-0", className)}
    />
  );
}
