"use client";

import { motion, useTransform } from "framer-motion";

/**
 * Cloud — An outlined cloud shape with black fill that slides in
 * from the right side of the screen after the moon has settled.
 */
export default function Cloud({ scrollProgress }) {
  const ease = (t) => t - Math.sin(t * Math.PI * 2) / (Math.PI * 2);

  // Slide in from right (starts off-screen, ends at resting position)
  const xOffset = useTransform(scrollProgress, (v) => {
    if (v <= 0.88) return 400;
    if (v >= 1.0) return 0;
    const t = (v - 0.88) / 0.12;
    return 400 * (1 - ease(t));
  });

  // Fade in only the stroke so black fill stays opaque
  const strokeOpacity = useTransform(scrollProgress, (v) => {
    if (v <= 0.88) return 0;
    if (v >= 1.0) return 1;
    const t = (v - 0.88) / 0.12;
    return ease(t);
  });

  const width = 320;
  const height = 140;

  return (
    <div
      className="fixed pointer-events-none z-20"
      style={{
        right: "8%",
        top: "55%",
        marginTop: -height / 2,
      }}
    >
      <motion.div
        style={{
          x: xOffset,
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 260 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d={[
              "M 10 68",
              "Q -2 52 14 40",
              "Q 10 22 36 16",
              "Q 62 10 78 28",
              "Q 88 6 118 14",
              "Q 145 20 148 38",
              "Q 168 22 190 28",
              "Q 208 36 210 52",
              "Q 222 50 232 62",
              "Q 238 74 220 82",
              "Q 200 90 168 84",
              "Q 130 92 98 86",
              "Q 55 90 35 80",
              "Q 18 74 10 68",
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
