"use client";

import { useEffect } from "react";
import { useScroll } from "framer-motion";
import ArrowIndicator from "./ArrowIndicator";
import Star from "./Star";
import Moon from "./Moon";
import Cloud from "./Cloud";

/**
 * Star field composition data — ordered by depth layer.
 *
 * Fewer, larger, outline-only stars for a graphic look.
 *
 *   Background (3 stars): scroll 0.20–0.40, sizes 10–14px
 *   Midground  (3 stars): scroll 0.40–0.62, sizes 16–20px
 *   Foreground (3 stars): scroll 0.62–0.92, sizes 22–28px
 */
const STARS = [
  // — Background layer (first star starts at 0.18, arrow mostly gone) —
  { x: 15, y: 68, size: 12, layer: "bg", enterRange: [0.180, 0.230] },
  { x: 75, y: 20, size: 10, layer: "bg", enterRange: [0.230, 0.280] },
  { x: 42, y: 35, size: 14, layer: "bg", enterRange: [0.280, 0.340] },

  // — Midground layer —
  { x: 88, y: 55, size: 18, layer: "mid", enterRange: [0.340, 0.410] },
  { x: 8,  y: 15, size: 16, layer: "mid", enterRange: [0.410, 0.480] },
  { x: 55, y: 78, size: 20, layer: "mid", enterRange: [0.480, 0.560] },

  // — Foreground layer (slower entrance) —
  { x: 92, y: 25, size: 24, layer: "fg", enterRange: [0.560, 0.680] },
  { x: 28, y: 85, size: 22, layer: "fg", enterRange: [0.680, 0.800] },
  { x: 62, y: 45, size: 28, layer: "fg", enterRange: [0.800, 0.920] },
];

/**
 * SceneTimeline — Orchestrates the full scroll-driven animation.
 *
 * A single useScroll() progress value (0–1) drives every element
 * through four cinematic stages:
 *
 *   Stage 1 (0–20%):   Arrow draws in, pulses, black void
 *   Stage 2 (20–50%):  First wave of stars slides upward
 *   Stage 3 (50–80%):  Second wave completes the composition
 *   Stage 4 (80–100%): Scene rests with subtle ambient motion
 */
export default function SceneTimeline() {
  // Reset to the top on every fresh page load so the animation
  // always starts from Stage 1 (overrides browser scroll restoration)
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // Single scroll progress value drives the entire timeline
  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* Fixed visual layer — the scene "canvas" */}
      <div className="fixed inset-0 bg-black pointer-events-none">
        {/* Stage 1: Arrow draws in, pulses, then fades */}
        <ArrowIndicator scrollProgress={scrollYProgress} />

        {/* Stars fade in one at a time */}
        {STARS.map((star, i) => (
          <Star
            key={i}
            scrollProgress={scrollYProgress}
            x={star.x}
            y={star.y}
            size={star.size}
            enterRange={star.enterRange}
            layer={star.layer}
            index={i}
          />
        ))}

        {/* Moon rises after all stars have settled */}
        <Moon scrollProgress={scrollYProgress} />

        {/* Cloud slides in from the right after the moon */}
        <Cloud scrollProgress={scrollYProgress} />
      </div>

      {/* Scroll-height spacer — provides 500vh of room for the timeline */}
      <div className="h-[1500vh]" aria-hidden="true" />
    </>
  );
}
