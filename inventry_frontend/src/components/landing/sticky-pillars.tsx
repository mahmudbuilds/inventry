"use client";

import {
  CheckIcon,
  CpuIcon,
  DatabaseIcon,
  ShieldCheckIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useRef, useState } from "react";

interface Pillar {
  id: string;
  tag: string;
  title: string;
  summary: string;
  detail: string[];
  metric: string;
  metricLabel: string;
  icon: typeof DatabaseIcon;
}

const PILLARS: Pillar[] = [
  {
    id: "ledger",
    tag: "01 / ATOMICITY",
    title: "Row-level mutex locking",
    summary:
      "Every mutation is wrapped in an exclusive database lock before balance deductions occur, making negative inventory impossible.",
    detail: [
      "Zero race conditions during peak fulfillment",
      "Immutable transaction audit trail",
      "Sub-15ms execution latency on PostgreSQL 16",
    ],
    metric: "0.00%",
    metricLabel: "Concurrency Desyncs",
    icon: DatabaseIcon,
  },
  {
    id: "sentinel",
    tag: "02 / PREDICTION",
    title: "Autonomous replenishment sentinels",
    summary:
      "Continuous velocity tracking watches burn rates and flags reorders before stockouts disrupt operations.",
    detail: [
      "Dynamic runway calculations based on rolling demand",
      "Granular reorder thresholds per SKU",
      "Automated supplier purchase requisition generation",
    ],
    metric: "< 1 day",
    metricLabel: "Runway Warning Window",
    icon: CpuIcon,
  },
  {
    id: "isolation",
    tag: "03 / SECURITY",
    title: "Cryptographic multi-tenant silos",
    summary:
      "TenantMixin scoping enforces strict company boundaries at query level, preventing data leakage across organizations.",
    detail: [
      "Isolated SKU namespace per organization",
      "HTTP-only SameSite auth cookie security",
      "Role-based permission gating for Admin and Staff",
    ],
    metric: "100%",
    metricLabel: "Tenant Boundary Isolation",
    icon: ShieldCheckIcon,
  },
];

export function StickyPillars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      setActiveIndex(0);
    } else if (latest < 0.66) {
      setActiveIndex(1);
    } else {
      setActiveIndex(2);
    }
  });

  const activePillar = PILLARS[activeIndex];

  return (
    <section
      id="pillars"
      ref={containerRef}
      className="relative min-h-[220vh] px-6 lg:px-8 py-16"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-24 max-w-5xl mx-auto py-12">
        <div className="mb-12">
          <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
            System Tenets
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
            Architecture Designed for Reliability
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Minimal Pillar Selectors */}
          <div className="md:col-span-5 space-y-3">
            {PILLARS.map((pillar, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "border-zinc-700 bg-zinc-900/80 shadow-lg text-white"
                      : "border-transparent bg-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="text-[10px] font-mono tracking-wider text-zinc-400 mb-1">
                    {pillar.tag}
                  </div>
                  <div className="text-base font-medium">{pillar.title}</div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Pillar Presentation */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-md"
              >
                <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
                      <activePillar.icon className="size-4" />
                    </div>
                    <span className="font-mono text-xs text-zinc-400">
                      {activePillar.tag}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-semibold font-mono text-white">
                      {activePillar.metric}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      {activePillar.metricLabel}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">
                    {activePillar.title}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                    {activePillar.summary}
                  </p>
                </div>

                <div className="mt-6 space-y-2.5 pt-6 border-t border-zinc-800/60 text-xs">
                  {activePillar.detail.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 text-zinc-300"
                    >
                      <div className="size-4 rounded-full bg-zinc-900 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckIcon className="size-2.5" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
