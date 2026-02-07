"use client";

import { useRef, useEffect } from "react";
import { motion, useTransform, useMotionValue, animate } from "framer-motion";

/**
 * Generates an SVG path string for a pointed star polygon.
 * @param {number} numPoints - Number of outer points (e.g. 4 or 5)
 * @param {number} outerR    - Outer radius (tip of each point)
 * @param {number} innerR    - Inner radius (valley between points)
 */
function generateStarPath(numPoints, outerR, innerR) {
  const cx = outerR;
  const cy = outerR;
  const vertices = [];

  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (Math.PI / numPoints) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    vertices.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  return (
    vertices
      .map(
        ([x, y], i) =>
          `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
      )
      .join(" ") + "Z"
  );
}

/** Per-layer visual configuration */
const LAYER_CONFIG = {
  bg: {
    color: "rgb(150, 150, 150)",
    strokeWidth: 1,
    shadow: "drop-shadow(0 0 2px rgba(255,255,255,0.06))",
    zIndex: 5,
    parallaxMax: 5,
    driftRange: 1,
  },
  mid: {
    color: "rgb(190, 190, 190)",
    strokeWidth: 1,
    shadow: "drop-shadow(0 0 3px rgba(255,255,255,0.15))",
    zIndex: 10,
    parallaxMax: 15,
    driftRange: 1.5,
  },
  fg: {
    color: "rgb(220, 220, 220)",
    strokeWidth: 1.5,
    shadow: "drop-shadow(0 0 5px rgba(255,255,255,0.25))",
    zIndex: 15,
    parallaxMax: 30,
    driftRange: 2,
  },
};

/**
 * Star — Fades in from nothing with a gentle scale bloom,
 * driven by scroll progress. Layer-aware rendering with
 * parallax, twinkle, and drift micro-animations.
 */
export default function Star({
  scrollProgress,
  x,
  y,
  size,
  enterRange,
  layer = "mid",
  index = 0,
}) {
  const [enterStart, enterEnd] = enterRange;
  const config = LAYER_CONFIG[layer];

  // All stars are 5-pointed with classic proportions
  const innerR = size * 0.38;
  const starPath = generateStarPath(5, size, innerR);
  const viewBoxSize = size * 2;

  // Smooth sinusoidal ease — gentle ramp in, gentle ramp out
  const ease = (t) => t - Math.sin(t * Math.PI * 2) / (Math.PI * 2);

  // --- Scroll-driven entrance ---

  const scrollOpacity = useTransform(scrollProgress, (v) => {
    if (v <= enterStart) return 0;
    if (v >= enterEnd) return 1;
    const t = (v - enterStart) / (enterEnd - enterStart);
    return ease(t);
  });

  const scale = useTransform(scrollProgress, (v) => {
    if (v <= enterStart) return 0.6;
    if (v >= enterEnd) return 1;
    const t = (v - enterStart) / (enterEnd - enterStart);
    return 0.6 + 0.4 * ease(t);
  });

  // --- Parallax: subtle y-drift based on scroll position ---

  const parallaxY = useTransform(
    scrollProgress,
    [0, 1],
    [0, -config.parallaxMax]
  );

  // --- Micro-animations (drift) ---

  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);

  const hasEnteredRef = useRef(false);
  const animControlsRef = useRef([]);

  useEffect(() => {
    const unsubscribe = scrollOpacity.on("change", (v) => {
      if (v >= 0.99 && !hasEnteredRef.current) {
        hasEnteredRef.current = true;
        startMicroAnimations();
      }
    });
    return () => {
      unsubscribe();
      animControlsRef.current.forEach((c) => c.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function startMicroAnimations() {
    const controls = [];

    // Drift — subtle position drift for all stars
    const dr = config.driftRange;
    const dxDur = 6 + (index % 3) * 1.5;  // 6–9s
    const dyDur = 7 + (index % 4) * 1.2;  // 7–10.6s

    const ctrlX = animate(driftX, [0, dr, -dr, 0], {
      duration: dxDur,
      repeat: Infinity,
      ease: "easeInOut",
    });
    const ctrlY = animate(driftY, [0, -dr, dr, 0], {
      duration: dyDur,
      repeat: Infinity,
      ease: "easeInOut",
    });
    controls.push(ctrlX, ctrlY);

    animControlsRef.current = controls;
  }

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        marginLeft: -size,
        marginTop: -size,
        zIndex: config.zIndex,
      }}
    >
      <motion.div
        style={{
          opacity: scrollOpacity,
          scale,
          y: parallaxY,
          x: driftX,
          filter: config.shadow,
        }}
      >
        <motion.div style={{ y: driftY }}>
          <svg
            width={viewBoxSize}
            height={viewBoxSize}
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={starPath}
              stroke={config.color}
              strokeWidth={config.strokeWidth}
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
