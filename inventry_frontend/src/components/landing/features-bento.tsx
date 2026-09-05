"use client";

import {
  AlertTriangleIcon,
  BoxesIcon,
  CheckCircle2Icon,
  LayersIcon,
  PackageSearchIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const FEATURES = [
  {
    id: "products",
    tag: "CATALOG",
    title: "Product & SKU Management",
    description:
      "Organize your products with custom SKUs, assigned categories, supplier associations, unit prices, and configurable reorder thresholds.",
    badge: "Catalog Control",
    icon: PackageSearchIcon,
    accent: "from-indigo-500/10 to-transparent",
    borderAccent: "group-hover:border-indigo-400/50",
    stats: "Unique Per-Company SKUs",
  },
  {
    id: "movements",
    tag: "TRANSACTIONS",
    title: "Stock In & Stock Out Movements",
    description:
      "Log inventory receipts (Stock In) and customer dispatches (Stock Out) with exact quantities, employee attribution, and audit notes.",
    badge: "Movement Trail",
    icon: RefreshCwIcon,
    accent: "from-emerald-500/10 to-transparent",
    borderAccent: "group-hover:border-emerald-400/50",
    stats: "Audit Attribution",
  },
  {
    id: "low-stock",
    tag: "ALERTS",
    title: "Low-Stock Alert Monitoring",
    description:
      "Stay ahead of stockouts. Whenever a product's on-hand count drops to or below its reorder level, it is immediately highlighted across the app.",
    badge: "Reorder Trigger",
    icon: AlertTriangleIcon,
    accent: "from-amber-500/10 to-transparent",
    borderAccent: "group-hover:border-amber-400/50",
    stats: "Threshold Alerts",
  },
  {
    id: "turnover",
    tag: "VELOCITY",
    title: "Stock Turnover Analytics",
    description:
      "Calculate sales velocity against current inventory on hand. Identify your highest-velocity bestsellers and address slow-moving dead stock.",
    badge: "Velocity Metrics",
    icon: TrendingUpIcon,
    accent: "from-blue-500/10 to-transparent",
    borderAccent: "group-hover:border-blue-400/50",
    stats: "Turnover Ratios",
  },
  {
    id: "suppliers",
    tag: "VENDORS",
    title: "Supplier Directory & Contacts",
    description:
      "Maintain vendor contact information, emails, and phone numbers. Easily see every product associated with each supplier for restock outreach.",
    badge: "Vendor Management",
    icon: TruckIcon,
    accent: "from-rose-500/10 to-transparent",
    borderAccent: "group-hover:border-rose-400/50",
    stats: "Contact Directory",
  },
  {
    id: "users",
    tag: "SECURITY",
    title: "Team Roles & User Management",
    description:
      "Invite team members to your organization. Administrators can manage accounts and roles, with mandatory password change enforcement on first sign-in.",
    badge: "Admin & Staff",
    icon: UsersIcon,
    accent: "from-purple-500/10 to-transparent",
    borderAccent: "group-hover:border-purple-400/50",
    stats: "Role-Based Access",
  },
];

export function FeaturesBento() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="features" className="py-24 md:py-36 px-6 lg:px-8 bg-[#fafafc] border-b border-zinc-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-indigo-200/60 px-3.5 py-1 text-xs font-medium text-indigo-700 shadow-2xs mb-3">
            <BoxesIcon className="size-3.5 text-indigo-600" />
            <span>PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
            Real Features, Built for Real Inventory
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Every feature on this page is built and ready in your dashboard—from catalog setup to movement logging, supplier records, and turnover analytics.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => (
            <motion.div
              key={feat.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={`group relative rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${feat.borderAccent}`}
            >
              {/* Top Accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.accent}`} />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-11 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-center text-zinc-900 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                    <feat.icon className="size-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {feat.badge}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  {feat.tag}
                </div>
                <h3 className="text-xl font-bold text-zinc-950 tracking-tight mb-2.5">
                  {feat.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <span className="font-medium">FEATURE HIGHLIGHT:</span>
                <span className="font-semibold text-zinc-900">{feat.stats}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
