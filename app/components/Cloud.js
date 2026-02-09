"use client";

import { motion, useTransform } from "framer-motion";

/**
 * Cloud — An outlined cloud shape with black fill that slides in
 * from the right side of the screen after the moon has settled.
 */
export default function Cloud({ scrollProgress }) {
  const ease = (t) => t - Math.sin(t * Math.PI * 2) / (Math.PI * 2);

  // Slide from off-screen right all the way to off-screen left (0.32–0.52)
  // Starts after moon settles at 0.30
  const startX = 1400;   // off-screen right
  const endX = -2400;    // off-screen left
  const xOffset = useTransform(scrollProgress, (v) => {
    if (v <= 0.28) return startX;
    if (v >= 0.48) return endX;
    const t = (v - 0.28) / 0.20;
    return startX + (endX - startX) * ease(t);
  });

  // Stroke fades in quickly at the start
  const strokeOpacity = useTransform(scrollProgress, (v) => {
    if (v <= 0.28) return 0;
    if (v >= 0.31) return 1;
    const t = (v - 0.28) / 0.03;
    return ease(t);
  });

  const width = 110;  // vw — full screen plus extra for slide-in
  const height = 170;

  return (
    <div
      className="fixed pointer-events-none z-20"
      style={{
        right: "-10%",
        top: "38%",
        marginTop: -height / 2,
      }}
    >
      <motion.div
        style={{
          x: xOffset,
        }}
      >
        <svg
          width={`${width}vw`}
          height={height}
          viewBox="0 0 380 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d={[
              "M 12 95",
              "C -2 80 0 65 16 58",
              "C 28 34 48 20 68 16",
              "C 88 12 98 24 108 18",
              "C 125 10 138 6 155 14",
              "Q 172 6 195 12",
              "C 210 8 228 4 242 14",
              "C 258 22 268 32 280 30",
              "C 298 26 318 34 338 42",
              "C 355 50 368 58 375 68",
              "C 382 78 388 86 386 94",
              "C 384 104 374 110 362 112",
              "Q 335 118 305 114",
              "Q 245 124 205 118",
              "Q 160 126 120 118",
              "Q 75 124 48 112",
              "Q 22 104 12 95",
            ].join(" ")}
            stroke="rgb(190, 190, 190)"
            strokeWidth="1"
            strokeLinejoin="round"
            fill="black"
            style={{ strokeOpacity }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
