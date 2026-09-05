"use client";

import { motion, useReducedMotion } from "motion/react";

interface Metric {
  value: string;
  label: string;
  description: string;
}

const METRICS: Metric[] = [
  {
    value: "< 14ms",
    label: "Mutation Latency",
    description: "PostgreSQL row-level lock commit speed.",
  },
  {
    value: "0.00%",
    label: "Desync Faults",
    description: "Negative stock states prevented at database level.",
  },
  {
    value: "99.99%",
    label: "Operational Uptime",
    description: "Continuous availability for multi-tenant logistics.",
  },
];

export function MinimalMetrics() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="metrics"
      className="py-24 md:py-32 px-6 lg:px-8 border-y border-zinc-900/80"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {METRICS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col space-y-2"
            >
              <div className="text-4xl sm:text-5xl font-semibold font-mono tracking-tight text-white">
                {item.value}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                {item.label}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
