"use client";

import {
  AlertTriangleIcon,
  BarChart3Icon,
  BoxesIcon,
  CheckCircle2Icon,
  LayersIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  TruckIcon,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

const ANALYTICS_MODULES = [
  {
    id: "stock-flow",
    name: "30-Day Stock Flow Trends",
    role: "Daily Inbound vs Outbound Flow",
    stat: "30-Day History",
    badge: "Real-time Chart",
    description:
      "Visualizes daily incoming shipments against outgoing sales dispatches, giving you a clear picture of stock momentum over time.",
    icon: BarChart3Icon,
  },
  {
    id: "low-stock",
    name: "Low-Stock Alert Tracking",
    role: "Threshold-Based Alerts",
    stat: "Zero-Stock Warning",
    badge: "Reorder Trigger",
    description:
      "Automatically highlights products whose quantity has dropped to or below their reorder level, so you can replenish before you run out.",
    icon: AlertTriangleIcon,
  },
  {
    id: "turnover",
    name: "Stock Turnover Rate",
    role: "Sales Velocity vs Stock on Hand",
    stat: "Capital Efficiency",
    badge: "Velocity Analysis",
    description:
      "Calculates how fast inventory moves compared to your on-hand balance. Spot fast-moving bestsellers and reduce slow-moving dead stock.",
    icon: TrendingUpIcon,
  },
  {
    id: "categories",
    name: "Category & Movement Summaries",
    role: "Aggregate Valuation & Volume",
    stat: "Net Balance Demos",
    badge: "Valuation Insights",
    description:
      "Review total products, total stock units, and average unit prices organized neatly across all your product categories and suppliers.",
    icon: LayersIcon,
  },
];

export function NetworkShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section
      id="analytics"
      ref={sectionRef}
      className="py-24 md:py-36 px-6 lg:px-8 bg-[#f8fafc] border-b border-zinc-200/80 relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[40rem] rounded-full bg-indigo-100/40 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-indigo-200/70 px-3.5 py-1 text-xs font-medium text-indigo-700 shadow-2xs mb-4">
            <BarChart3Icon className="size-3.5 text-indigo-600" />
            <span>BUSINESS INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
            Built-In Analytics & Stock Intelligence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Gain immediate visibility into your inventory health without complicated spreadsheets. Inventry tracks daily stock movements, flags low-stock items, and calculates turnover rates automatically.
          </p>
        </div>

        {/* Analytics Showcase Bento Card */}
        <motion.div
          style={shouldReduceMotion ? undefined : { scale }}
          className="relative rounded-3xl border border-zinc-200/90 bg-white shadow-2xl shadow-zinc-200/60 overflow-hidden"
        >
          {/* Top Status Bar */}
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 text-zinc-700 font-medium">
              <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Reporting Suite</span>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-500">Instant Activity Insights</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-emerald-700 font-semibold">
              <span>● 100% In-App Transparency</span>
            </div>
          </div>

          {/* Interactive Simulated Chart Preview */}
          <div className="p-6 sm:p-10 bg-gradient-to-b from-white to-[#fafafc] border-b border-zinc-100">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Stock Flow Trends (Last 30 Days)
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 mt-1">
                  Daily Inbound Restocks vs Outbound Dispatches
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2 text-indigo-700">
                  <span className="size-3 rounded-full bg-indigo-600 inline-block" />
                  <span>Stock In (Purchases)</span>
                </div>
                <div className="flex items-center gap-2 text-rose-600">
                  <span className="size-3 rounded-full bg-rose-500 inline-block" />
                  <span>Stock Out (Sales)</span>
                </div>
              </div>
            </div>

            {/* Simplified Visual Bars Mocking Real 30-Day Flow */}
            <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 pt-4 px-2 border-b border-zinc-200/80">
              {[
                { in: 65, out: 40 },
                { in: 30, out: 55 },
                { in: 85, out: 60 },
                { in: 45, out: 70 },
                { in: 95, out: 45 },
                { in: 20, out: 80 },
                { in: 75, out: 65 },
                { in: 60, out: 90 },
                { in: 110, out: 75 },
                { in: 50, out: 60 },
                { in: 80, out: 85 },
                { in: 90, out: 50 },
                { in: 70, out: 95 },
                { in: 120, out: 80 },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex items-end justify-center gap-0.5 h-full group relative">
                  <div
                    style={{ height: `${(bar.in / 130) * 100}%` }}
                    className="w-full rounded-t-sm bg-indigo-500/80 group-hover:bg-indigo-600 transition-colors"
                  />
                  <div
                    style={{ height: `${(bar.out / 130) * 100}%` }}
                    className="w-full rounded-t-sm bg-rose-400/80 group-hover:bg-rose-500 transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400 pt-2 font-medium">
              <span>30 Days Ago</span>
              <span>15 Days Ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* 4 Analytics Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 bg-white p-6">
            {ANALYTICS_MODULES.map((mod) => (
              <div key={mod.id} className="p-4 space-y-2 hover:bg-zinc-50/60 rounded-2xl transition-colors">
                <div className="flex items-center justify-between">
                  <div className="size-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <mod.icon className="size-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                    {mod.badge}
                  </span>
                </div>
                <div className="pt-2">
                  <h4 className="text-sm font-bold text-zinc-950">{mod.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{mod.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
