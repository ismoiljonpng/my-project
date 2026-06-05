"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Мягкий анимированный фон героя: тёплые «блобы» в палитре бренда.
 * Уважает prefers-reduced-motion (§16) и не перехватывает клики.
 */
export function HeroAurora() {
  const reduce = useReducedMotion();

  const loop = (duration: number) =>
    reduce
      ? undefined
      : ({
          duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        } as const);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
      <div className="pattern-east absolute inset-0 opacity-60" />

      <motion.div
        className="absolute -top-24 -left-24 size-[28rem] rounded-full bg-primary/25 blur-[90px] dark:bg-primary/20"
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.1, 1] }}
        transition={loop(16)}
      />
      <motion.div
        className="absolute -right-24 top-8 size-[24rem] rounded-full bg-teal/25 blur-[90px] dark:bg-teal/15"
        animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={loop(20)}
      />
      <motion.div
        className="absolute -bottom-28 left-1/3 size-[22rem] rounded-full bg-chart-3/20 blur-[90px]"
        animate={reduce ? undefined : { x: [0, 26, 0], y: [0, -20, 0], scale: [1, 1.12, 1] }}
        transition={loop(18)}
      />
    </div>
  );
}
