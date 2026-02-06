"use client";

import { useEffect } from "react";
import { useScroll } from "framer-motion";
import ArrowIndicator from "./ArrowIndicator";
import Star from "./Star";

/**
 * Star field composition data.
 *
 * Each entry defines a star's final viewport position (x%, y%),
 * visual size (outer radius in px), point count, and the scroll
 * range [start, end] that controls its entrance animation.
 *
 * Positions are hand-placed for a balanced, intentional composition —
 * no randomness. Stars are grouped into two waves:
 *
 *   Stage 2 (scroll 0.20–0.50): First wave — sparse arrangement
 *   Stage 3 (scroll 0.50–0.80): Second wave — completes the field
 */
const STARS = [
  // Each star enters one at a time — 5% of scroll each, no overlap.
  // Scroll 0.20–0.75 covers all 11 entrances, leaving 0.75–1.0 for ambient.
  { x: 5,  y: 8,  size: 20, points: 4, enterRange: [0.20, 0.25] },
  { x: 92, y: 25, size: 28, points: 4, enterRange: [0.25, 0.30] },
  { x: 8,  y: 50, size: 16, points: 5, enterRange: [0.30, 0.35] },
  { x: 70, y: 6,  size: 24, points: 4, enterRange: [0.35, 0.40] },
  { x: 35, y: 88, size: 18, points: 5, enterRange: [0.40, 0.45] },
  { x: 50, y: 42, size: 34, points: 4, enterRange: [0.45, 0.50] },
  { x: 93, y: 72, size: 14, points: 5, enterRange: [0.50, 0.55] },
  { x: 28, y: 5,  size: 20, points: 4, enterRange: [0.55, 0.60] },
  { x: 88, y: 90, size: 22, points: 5, enterRange: [0.60, 0.65] },
  { x: 4,  y: 82, size: 12, points: 4, enterRange: [0.65, 0.70] },
  { x: 62, y: 65, size: 18, points: 5, enterRange: [0.70, 0.75] },
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

        {/* Stages 2–4: Stars enter and settle into the field */}
        {STARS.map((star, i) => (
          <Star
            key={i}
            scrollProgress={scrollYProgress}
            x={star.x}
            y={star.y}
            size={star.size}
            points={star.points}
            enterRange={star.enterRange}
            index={i}
          />
        ))}
      </div>

      {/* Scroll-height spacer — provides 500vh of room for the timeline */}
      <div className="h-[900vh]" aria-hidden="true" />
    </>
  );
}
