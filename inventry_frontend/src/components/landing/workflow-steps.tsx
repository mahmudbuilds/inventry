"use client";

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  LayersIcon,
  PackageCheckIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  TrendingUpIcon,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

const STEPS = [
  {
    step: "01",
    tag: "SETUP & CATALOG",
    title: "Create Organization & Add Products",
    description:
      "Register your company and start building your catalog. Add product categories, supplier contact info, unit prices, and minimum reorder thresholds for each SKU.",
    icon: PlusCircleIcon,
    features: [
      "Custom product SKU, category, and supplier assignment",
      "Set individual reorder levels to trigger low-stock alerts",
      "Automatic initial stock movement recorded upon product creation",
    ],
  },
  {
    step: "02",
    tag: "MOVEMENTS & AUDIT",
    title: "Log Stock In & Stock Out Movements",
    description:
      "Record stock arrivals (purchases/restocks) and stock dispatches (sales). The system validates available inventory and logs who made each change with a full timestamp.",
    icon: RefreshCwIcon,
    features: [
      "Atomic stock validation blocks negative inventory balances",
      "User attribution logs exactly which team member recorded each movement",
      "Optional movement notes capture batch details or shipment context",
    ],
  },
  {
    step: "03",
    tag: "ANALYTICS & ALERTS",
    title: "Monitor Trends & Low-Stock Alerts",
    description:
      "Review 30-day stock flow charts, low-stock warnings, and turnover rates from the live dashboard. Know exactly when to reorder and which products sell fastest.",
    icon: TrendingUpIcon,
    features: [
      "Visual 30-day timeline of daily inbound vs outbound volume",
      "Instant low-stock alerts when counts drop to or below reorder levels",
      "Stock turnover ratios identify fast movers and stagnant capital",
    ],
  },
];

export function WorkflowSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="workflow"
      ref={containerRef}
      className="py-24 md:py-36 px-6 lg:px-8 bg-white border-b border-zinc-200/80 relative"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200/60 px-3.5 py-1 text-xs font-medium text-indigo-700 mb-3">
            <LayersIcon className="size-3.5" />
            <span>OPERATIONAL WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
            How Inventry Works in Practice
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            From initial product setup to recording daily movements and reviewing business analytics.
          </p>
        </div>

        {/* Vertical Connected Timeline */}
        <div className="relative pl-8 sm:pl-16 space-y-16">
          {/* Background Track Line */}
          <div className="absolute left-3 sm:left-7 top-4 bottom-4 w-0.5 bg-zinc-200" />
          {/* Scroll-driven Active Fill Line */}
          <motion.div
            style={shouldReduceMotion ? undefined : { height: progressHeight }}
            className="absolute left-3 sm:left-7 top-4 w-0.5 bg-gradient-to-b from-indigo-600 via-indigo-500 to-emerald-500 origin-top"
          />

          {STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative rounded-3xl border border-zinc-200/90 bg-[#fafafc] p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Step Circle Node on Track */}
              <div className="absolute -left-8 sm:-left-16 top-8 -translate-x-1/2 size-7 sm:size-8 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-[11px] font-bold text-indigo-700">
                  {step.step}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <step.icon className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                      STEP {step.step} // {step.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-950">
                      {step.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
                {step.description}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-200/60">
                {step.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-zinc-700">
                    <CheckCircle2Icon className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
