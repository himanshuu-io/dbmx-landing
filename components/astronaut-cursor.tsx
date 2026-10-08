"use client";

import { useEffect, useRef } from "react";
import { blackHoleGeometry } from "@/components/black-hole";

/** Rendered size in CSS px; the artwork is drawn on a 32-unit grid. */
const SIZE = 46;
const UNIT = SIZE / 32;
/** Helmet centre: the click hotspot, and the point the astronaut turns and stretches around. */
const HOTSPOT = { x: 16 * UNIT, y: 9 * UNIT };

// Tidal effects, as multiples of the event-horizon radius R. Stretching starts at
// SPAG_START * R and is fully developed by SPAG_FULL * R; red shift builds from R to the centre.
const SPAG_START = 2.4;
const SPAG_FULL = 0.55;
const MAX_STRETCH = 2.4;

// Idle drift toward the hero install button (marked `data-astronaut-target`): it starts
// after IDLE_DELAY ms without movement and accelerates like a slow fall up to DRIFT_MAX px/s.
const IDLE_DELAY = 1500;
const DRIFT_ACCEL = 45;
const DRIFT_MAX = 130;

// Literal colours: Tailwind only emits theme variables that utilities use, so var() lookups
// from inline SVG attributes are not guaranteed to resolve. These match the site tokens.
const C = { suit: "#f4eee2", coral: "#e85d4a", pack: "#a1a1a1", ink: "#0a0a0a" };

const INTERACTIVE = "a, button, [role='button'], [role='tab'], [role='radio'], summary, label";
const TEXT_ENTRY = "input, textarea, select, [contenteditable='true']";

/**
 * Replaces the mouse pointer with an astronaut that always turns its helmet toward the
 * black hole, is stretched thin (spaghettified) as it nears the event horizon and red-shifts
 * inside it. Left idle, it drifts toward the hero install button. Only mounts its behaviour on fine, hovering pointers; touch devices and text
 * fields keep their native cursor.
 */
export function AstronautCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("astronaut-cursor");

    // `pointer` is where the real mouse is; `pos` is where the astronaut is drawn. They only
    // differ while the astronaut drifts on its own, and it rejoins the pointer as soon as you
    // move or click, so clicks always land where you expect.
    const pointer = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let seen = false;
    let lastMove = 0;
    let lastFrame = 0;
    let angle = 0;
    let scale = 1;
    let tidal = 0;
    let redshift = 0;
    let hovering = false;
    let pressed = false;
    let visible = false;
    let frame = 0;

    const render = (now: number) => {
      const dt = Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0);
      lastFrame = now;

      let drifting = false;
      let atTarget = false;
      const idle = now - lastMove;
      if (seen && visible && !reducedMotion && idle > IDLE_DELAY) {
        const b = document.querySelector<HTMLElement>("[data-astronaut-target]")?.getBoundingClientRect();
        if (b && b.bottom > 0 && b.top < window.innerHeight && b.right > 0 && b.left < window.innerWidth) {
          const tx = b.left + b.width / 2 - pos.x;
          const ty = b.top + b.height / 2 - pos.y;
          const d = Math.hypot(tx, ty);
          const step = Math.min(DRIFT_MAX, (DRIFT_ACCEL * (idle - IDLE_DELAY)) / 1000) * dt;
          if (d > step) {
            pos.x += (tx / d) * step;
            pos.y += (ty / d) * step;
          } else {
            pos.x += tx;
            pos.y += ty;
          }
          drifting = true;
          atTarget = d < b.height / 2;
        }
      }
      if (!drifting) {
        // Catch back up with the real pointer quickly after a drift.
        pos.x += (pointer.x - pos.x) * 0.35;
        pos.y += (pointer.y - pos.y) * 0.35;
        if (Math.abs(pointer.x - pos.x) < 0.5 && Math.abs(pointer.y - pos.y) < 0.5) {
          pos.x = pointer.x;
          pos.y = pointer.y;
        }
      }

      // Prefer the shader's own geometry; fall back to the hero content it is centred on.
      let hole: { x: number; y: number; r: number } | null = null;
      const g = blackHoleGeometry;
      if (g.canvas?.isConnected && g.r > 0) {
        const cr = g.canvas.getBoundingClientRect();
        hole = { x: cr.left + g.x, y: cr.top + g.y, r: g.r };
      } else {
        const b = document.querySelector<HTMLElement>("[data-blackhole-center]")?.getBoundingClientRect();
        if (b) hole = { x: b.left + b.width / 2, y: b.top + b.height / 2, r: 0 };
      }

      let targetTidal = 0;
      let targetRedshift = 0;
      if (hole) {
        const dx = hole.x - pos.x;
        const dy = hole.y - pos.y;
        const dist = Math.hypot(dx, dy);
        if (hole.r > 0) {
          const t = Math.min(1, Math.max(0, (SPAG_START * hole.r - dist) / ((SPAG_START - SPAG_FULL) * hole.r)));
          targetTidal = t * t;
          targetRedshift = Math.min(1, Math.max(0, 1 - dist / hole.r)) ** 0.7;
        }
        // Right on top of the hole there is no meaningful direction, so hold the last one.
        if (dist > 24) {
          // The artwork points up, so add 90deg to turn atan2's +x direction into "head first".
          const target = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
          const diff = ((((target - angle) % 360) + 540) % 360) - 180;
          angle += reducedMotion ? diff : diff * 0.18;
        }
      }
      const targetScale = ((drifting ? atTarget : hovering) ? 1.2 : 1) * (pressed ? 0.85 : 1);
      scale += reducedMotion ? targetScale - scale : (targetScale - scale) * 0.25;
      tidal += reducedMotion ? targetTidal - tidal : (targetTidal - tidal) * 0.15;
      redshift += reducedMotion ? targetRedshift - redshift : (targetRedshift - redshift) * 0.15;

      // Spaghettification: after rotate() the local y axis points along the line to the
      // singularity, so stretch along y and squeeze x (keeping the area roughly constant).
      const stretch = 1 + (MAX_STRETCH - 1) * tidal;
      const sy = scale * stretch;
      const sx = scale / Math.sqrt(stretch);
      el.style.opacity = visible ? String(1 - 0.3 * redshift) : "0";
      el.style.transform = `translate3d(${pos.x - HOTSPOT.x}px, ${pos.y - HOTSPOT.y}px, 0) rotate(${angle}deg) scale(${sx}, ${sy})`;
      // Red shift: light climbing out of the well loses energy, so the suit reddens and dims.
      el.style.filter =
        redshift > 0.01
          ? `sepia(${redshift}) saturate(${1 + 4 * redshift}) hue-rotate(${-38 * redshift}deg) brightness(${1 - 0.45 * redshift})`
          : "";
      frame = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!seen) {
        pos.x = pointer.x;
        pos.y = pointer.y;
        seen = true;
      }
      lastMove = e.timeStamp;
      const target = e.target instanceof Element ? e.target : null;
      visible = !target?.closest(TEXT_ENTRY);
      hovering = !!target?.closest(INTERACTIVE);
    };
    const onDown = (e: PointerEvent) => {
      pressed = true;
      lastMove = e.timeStamp;
      pos.x = pointer.x;
      pos.y = pointer.y;
    };
    const onUp = () => (pressed = false);
    const onLeave = () => (visible = false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("astronaut-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] opacity-0 will-change-transform"
      style={{ width: SIZE, height: SIZE, transformOrigin: `${HOTSPOT.x}px ${HOTSPOT.y}px` }}
    >
      <svg viewBox="0 0 32 32" width={SIZE} height={SIZE} className="drop-shadow-[0_2px_6px_rgb(10_10_10/0.8)]">
        <g stroke={C.ink} strokeWidth="1" strokeLinejoin="round">
          {/* Backpack, legs and arms sit behind the suit. */}
          <rect x="9.5" y="12.5" width="13" height="10" rx="2.5" fill={C.pack} />
          <rect x="12" y="21" width="3.6" height="8" rx="1.8" fill={C.suit} />
          <rect x="16.4" y="21" width="3.6" height="8" rx="1.8" fill={C.suit} />
          <rect x="6.5" y="13" width="3.4" height="8.5" rx="1.7" fill={C.suit} transform="rotate(22 8.2 13.5)" />
          <rect x="22.1" y="13" width="3.4" height="8.5" rx="1.7" fill={C.suit} transform="rotate(-22 23.8 13.5)" />
          <rect x="11" y="12" width="10" height="11.5" rx="3" fill={C.suit} />
          <circle cx="16" cy="9" r="6.2" fill={C.suit} />
          <rect x="12" y="6.4" width="8" height="5" rx="2.5" fill={C.ink} />
        </g>
        {/* Visor glint and chest light pick up the brand coral. */}
        <rect x="13.4" y="7.4" width="2.6" height="1.3" rx="0.65" fill={C.coral} opacity="0.9" />
        <rect x="14.5" y="15" width="3" height="2.2" rx="0.6" fill={C.coral} />
      </svg>
    </div>
  );
}
