"use client";

import { motion, useTransform } from "framer-motion";

/**
 * Moon — An outlined circle with black fill that rises slowly from below
 * into the upper-left third of the viewport after all stars settle.
 */
export default function Moon({ scrollProgress }) {
  // Smooth sinusoidal ease — matches star easing
  const ease = (t) => t - Math.sin(t * Math.PI * 2) / (Math.PI * 2);

  // Slow rise over 30% of scroll (0.70–1.0)
  const yOffset = useTransform(scrollProgress, (v) => {
    if (v <= 0.70) return 600;
    if (v >= 1.0) return 0;
    const t = (v - 0.70) / 0.30;
    return 600 * (1 - ease(t));
  });

  // Fade in only the stroke (not the whole element, so black fill stays opaque)
  const strokeOpacity = useTransform(scrollProgress, (v) => {
    if (v <= 0.70) return 0;
    if (v >= 1.0) return 1;
    const t = (v - 0.70) / 0.30;
    return ease(t);
  });

  const size = 140;

  return (
    <div
      className="fixed pointer-events-none z-20"
      style={{
        left: "33%",
        top: "33%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
    >
      <motion.div
        style={{
          y: yOffset,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 1}
            stroke="rgb(190, 190, 190)"
            strokeWidth="1"
            fill="black"
            style={{ strokeOpacity }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
