"use client";

import { motion, useReducedMotion } from "motion/react";

interface Metric {
  value: string;
  label: string;
  description: string;
}

const METRICS: Metric[] = [
  {
    value: "< 1 sec",
    label: "Sync Speed",
    description: "Stock deductions and barcode receipts update everywhere in real time.",
  },
  {
    value: "0.00%",
    label: "Double-Selling",
    description: "Zero instances of accidentally promising items that are already out of stock.",
  },
  {
    value: "99.99%",
    label: "System Uptime",
    description: "Continuous 24/7 availability so warehouse floor operations never stall.",
  },
  {
    value: "100%",
    label: "Data Privacy",
    description: "Your product catalog, wholesale costs, and company numbers remain strictly private.",
  },
];

export function MinimalMetrics() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="metrics"
      className="py-24 md:py-32 px-6 lg:px-8 border-b border-zinc-200/80 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {METRICS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col space-y-2 p-6 rounded-3xl bg-[#fafafc] border border-zinc-200/80 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-zinc-950">
                {item.value}
              </div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-600">
                {item.label}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

