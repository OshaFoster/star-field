"use client";

import { useEffect } from "react";
import { motion, useTransform, useMotionValue, animate } from "framer-motion";

/**
 * ArrowIndicator — A centered downward-pointing arrow that draws itself
 * in three staged strokes on page load:
 *
 *   1. Vertical shaft draws downward
 *   2. Left side of arrowhead sweeps out
 *   3. Right side of arrowhead sweeps out
 *
 * When the user scrolls, the arrow slides off the bottom of the viewport.
 */
export default function ArrowIndicator({ scrollProgress }) {
  const shaftLength = useMotionValue(0);
  const headLeftLength = useMotionValue(0);
  const headRightLength = useMotionValue(0);

  useEffect(() => {
    // Stage 1: Shaft draws downward after a black-screen pause
    const t1 = setTimeout(() => {
      animate(shaftLength, 1, { duration: 1.8, ease: "easeInOut" });
    }, 1000);

    // Stage 2: Left arrowhead sweeps out after shaft lands
    const t2 = setTimeout(() => {
      animate(headLeftLength, 1, { duration: 0.6, ease: "easeOut" });
    }, 3000);

    // Stage 3: Right arrowhead follows shortly after
    const t3 = setTimeout(() => {
      animate(headRightLength, 1, { duration: 0.6, ease: "easeOut" });
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [shaftLength, headLeftLength, headRightLength]);

  // Scrolling pushes the arrow off the bottom of the viewport
  const yPosition = useTransform(scrollProgress, [0, 0.13, 1], [0, 800, 800]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-20"
      style={{ y: yPosition }}
    >
      <svg
        width="60"
        height="160"
        viewBox="0 0 60 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shaft — draws top to bottom */}
        <motion.path
          d="M 30 14 L 30 128"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength: shaftLength }}
        />
        {/* Left arrowhead */}
        <motion.path
          d="M 30 128 L 14 112"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength: headLeftLength }}
        />
        {/* Right arrowhead */}
        <motion.path
          d="M 30 128 L 46 112"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength: headRightLength }}
        />
      </svg>
    </motion.div>
  );
}
