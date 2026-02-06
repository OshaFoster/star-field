"use client";

import { motion, useTransform } from "framer-motion";

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

/**
 * Star — An individual pointed star shape that drifts upward into
 * a fixed viewport position, driven by scroll progress.
 */
export default function Star({
  scrollProgress,
  x,
  y,
  size,
  points = 4,
  enterRange,
  index = 0,
}) {
  const [enterStart, enterEnd] = enterRange;

  // Inner radius ratio: 4-pointed stars are sharper, 5-pointed are classic
  const innerR = points === 4 ? size * 0.25 : size * 0.38;
  const starPath = generateStarPath(points, size, innerR);
  const viewBoxSize = size * 2;

  // Linear drift upward from 300px below — constant speed, no snap
  const yOffset = useTransform(scrollProgress, (v) => {
    if (v <= enterStart) return 300;
    if (v >= enterEnd) return 0;
    const t = (v - enterStart) / (enterEnd - enterStart);
    return 300 * (1 - t);
  });

  // Slow, even fade across the full entrance duration
  const opacity = useTransform(scrollProgress, (v) => {
    if (v <= enterStart) return 0;
    if (v >= enterEnd) return 1;
    return (v - enterStart) / (enterEnd - enterStart);
  });

  return (
    <div
      className="fixed pointer-events-none z-10"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        marginLeft: -size,
        marginTop: -size,
      }}
    >
      <motion.div style={{ y: yOffset, opacity }}>
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={starPath}
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
}
