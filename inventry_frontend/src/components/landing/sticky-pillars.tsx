"use client";

import {
  AlertTriangleIcon,
  CheckIcon,
  PackageCheckIcon,
  ShieldCheckIcon,
  WarehouseIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import automatedShelving from "@/assets/automated-shelving.jpg";
import heroWarehouse from "@/assets/hero-warehouse.jpg";
import networkNodes from "@/assets/network-nodes.jpg";

interface PillarItem {
  id: string;
  number: string;
  tag: string;
  title: string;
  summary: string;
  badge: string;
  subheadline: string;
  image: StaticImageData;
  imageAlt: string;
  imageCaption: string;
  details: string[];
  metrics: { label: string; value: string }[];
  icon: typeof PackageCheckIcon;
  systemGuarantees: { label: string; value: string; highlight?: boolean }[];
}

const PILLARS_DATA: PillarItem[] = [
  {
    id: "accuracy",
    number: "01",
    tag: "ACCURACY & ORDER LOCKING",
    title: "Zero Double-Selling & Accurate Stock Balances",
    subheadline: "Deterministic concurrency control at the database row level",
    summary:
      "When team members or sales channels dispatch items simultaneously, Inventry locks the product record in the database during the transaction. Stock deductions are processed linearly so your available inventory never drops below zero.",
    badge: "Accurate Balances",
    image: heroWarehouse,
    imageAlt: "Organized warehouse aisles with inventory racks and forklifts",
    imageCaption: "Live Inventory Verification: Zero Negative Balances",
    icon: PackageCheckIcon,
    metrics: [
      { label: "Overselling Incidents", value: "0.00%" },
      { label: "Transaction Safety", value: "Atomic Lock" },
      { label: "Stock Accuracy", value: "99.9%" },
    ],
    systemGuarantees: [
      { label: "STOCK INTEGRITY", value: "100% Guaranteed", highlight: true },
      { label: "LOCKING PROTOCOL", value: "Row-Level Atomic" },
      { label: "RACE CONDITIONS", value: "Eliminated" },
    ],
    details: [
      "Database row-locking ensures orders are checked out one by one without race conditions.",
      "Outbound movements validate available stock before committing, blocking negative balances.",
      "Every stock movement records the authenticated user, timestamp, quantity, and optional notes.",
      "Instant stock status badges flag items as OK, Low Stock, or Out of Stock across the catalog.",
    ],
  },
  {
    id: "reordering",
    number: "02",
    tag: "SMART FORECASTING",
    title: "Low-Stock Warnings & Reorder Monitoring",
    subheadline: "Predictive threshold tracking before stockouts disrupt sales",
    summary:
      "Every product has a customizable reorder threshold. When inventory falls to or below your reorder level, it is immediately highlighted on your dashboard and low-stock analytics page so you can restock in time.",
    badge: "Stockout Prevention",
    image: automatedShelving,
    imageAlt: "Modern automated storage shelving and organized warehouse bins",
    imageCaption: "Automated Reorder Threshold Alerts Active",
    icon: AlertTriangleIcon,
    metrics: [
      { label: "Stockout Reduction", value: "98.4%" },
      { label: "Threshold Alert", value: "Immediate" },
      { label: "Stock Flow Tracking", value: "30 Days" },
    ],
    systemGuarantees: [
      { label: "ALERT DISPATCH", value: "Instant Real-Time", highlight: true },
      { label: "MONITORING WINDOW", value: "Continuous 24/7" },
      { label: "SUPPLIER REORDER", value: "1-Click Workflow" },
    ],
    details: [
      "Set custom reorder levels for every individual product based on sales frequency.",
      "Dedicated Low-Stock Analytics view filters all products needing replenishment.",
      "Link each product directly to its designated supplier for quick restock communication.",
      "Track 30-day inbound and outbound movement trends to understand seasonal demand.",
    ],
  },
  {
    id: "permissions",
    number: "03",
    tag: "ORGANIZATION SECURITY",
    title: "Company Isolation & Role-Based Team Access",
    subheadline: "Strict multi-tenant architecture with encrypted sessions",
    summary:
      "Every company's data is strictly separated in the database. Administrators have full control over company settings and user invites, while staff members can record stock in and stock out movements with user attribution.",
    badge: "Strict Multi-Tenancy",
    image: networkNodes,
    imageAlt:
      "Secure modular data cubes and isolated company tenant boundaries",
    imageCaption: "Company Multi-Tenancy: 100% Private Isolation",
    icon: ShieldCheckIcon,
    metrics: [
      { label: "Company Isolation", value: "100% Private" },
      { label: "Role Gating", value: "Admin & Staff" },
      { label: "Session Protection", value: "HTTP-Only JWT" },
    ],
    systemGuarantees: [
      { label: "DATA SCOPING", value: "Tenant-Isolated", highlight: true },
      { label: "ACCESS CONTROL", value: "Role-Restricted" },
      { label: "SESSION SECRETS", value: "Encrypted Cookies" },
    ],
    details: [
      "Database-level multi-tenant scoping ensures organizations never see each other's data.",
      "Admin role allows adding and managing staff accounts with optional mandatory password reset.",
      "Staff members can view catalogs, categories, suppliers, and log movements securely.",
      "Secure authentication uses HTTP-only SameSite cookies to safeguard company credentials.",
    ],
  },
];

function PillarCard({
  pillar,
  isActive,
  onVisible,
}: {
  pillar: PillarItem;
  isActive: boolean;
  onVisible: (id: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, {
    margin: "-25% 0px -45% 0px",
  });
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const scaleParallax = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.06, 1.0, 1.04],
  );

  useEffect(() => {
    if (isInView) {
      onVisible(pillar.id);
    }
  }, [isInView, pillar.id, onVisible]);

  return (
    <motion.div
      id={`pillar-${pillar.id}`}
      ref={cardRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`scroll-mt-28 lg:scroll-mt-32 rounded-3xl border bg-white p-6 sm:p-10 transition-all duration-500 relative ${
        isActive
          ? "border-indigo-300/80 shadow-2xl shadow-indigo-950/10 ring-1 ring-indigo-500/20 scale-[1.005] opacity-100"
          : "border-zinc-200/80 shadow-md shadow-zinc-200/40 opacity-80 hover:opacity-95 scale-[0.99]"
      }`}
    >
      {/* Top Floating Badge Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div
            className={`size-11 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-indigo-50 border border-indigo-100 text-indigo-600"
            }`}
          >
            <pillar.icon className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
              PILLAR {pillar.number} · {pillar.tag}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-0.5">
              {pillar.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50/90 border border-indigo-200/80 px-2.5 py-1 rounded-full">
              <span className="size-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Active Focus
            </span>
          )}
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-3 py-1 rounded-full">
            {pillar.badge}
          </span>
        </div>
      </div>

      {/* Subheadline & Summary */}
      <div className="mt-5 space-y-2">
        <p className="text-xs font-semibold text-indigo-900/75 uppercase tracking-wide">
          {pillar.subheadline}
        </p>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          {pillar.summary}
        </p>
      </div>

      {/* Image Asset with Scroll Parallax */}
      <div className="mt-6 rounded-2xl overflow-hidden border border-zinc-200/80 shadow-xs relative bg-zinc-50">
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { y: yParallax, scale: scaleParallax }
          }
          className="relative w-full h-56 sm:h-76 origin-center will-change-transform"
        >
          <Image
            src={pillar.image}
            alt={pillar.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 700px"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-xl border border-zinc-200/80 shadow-md text-xs font-semibold text-zinc-800 flex items-center gap-2 backdrop-blur-md">
          <WarehouseIcon className="size-4 text-indigo-600" />
          <span>{pillar.imageCaption}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#f8fafc] border border-zinc-200/70">
        {pillar.metrics.map((m) => (
          <div key={m.label} className="text-center sm:text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950">
              {m.value}
            </div>
            <div className="text-xs text-zinc-500 font-medium mt-0.5">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Points */}
      <div className="mt-6 space-y-3 pt-6 border-t border-zinc-100">
        <div className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">
          Verified Capabilities
        </div>
        {pillar.details.map((detail) => (
          <div
            key={detail}
            className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700"
          >
            <div className="size-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
              <CheckIcon className="size-3" />
            </div>
            <span className="leading-snug">{detail}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function StickyPillars() {
  const [activePillarId, setActivePillarId] = useState("accuracy");
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track overall scroll through the pillars container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 30%", "end 85%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const activeIndex = PILLARS_DATA.findIndex((p) => p.id === activePillarId);
  const activePillar = PILLARS_DATA[activeIndex] || PILLARS_DATA[0];

  const scrollToPillar = (id: string) => {
    setActivePillarId(id);
    const elem = document.getElementById(`pillar-${id}`);
    if (elem) {
      const yOffset = -110;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      id="pillars"
      ref={sectionRef}
      className="py-24 md:py-36 px-6 lg:px-8 bg-[#fafbfe] border-b border-zinc-200/80 relative"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200/60 px-3.5 py-1 text-xs font-medium text-indigo-700 mb-3">
            <PackageCheckIcon className="size-3.5" />
            <span>OPERATIONAL ACCURACY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
            Built for Total Reliability & Accuracy
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Eliminate inventory chaos. Our system ensures every product count is
            accounted for, orders are packed accurately, and stockouts are
            prevented well in advance.
          </p>
        </div>

        {/*
          Two-Column Layout:
          - Left column wrapper has full height of the grid row.
          - Inner left element has sticky positioning with top-28.
          - It remains firmly pinned to the left until all 3 pillars have scrolled by.
        */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative"
        >
          {/* Left Column: Persistent Sticky Navigator */}
          <div className="lg:col-span-5 xl:col-span-4 relative h-full">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xl shadow-zinc-200/50 relative overflow-hidden backdrop-blur-md">
                {/* Visual Scroll Track on the left edge */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-zinc-100">
                  <motion.div
                    style={
                      shouldReduceMotion
                        ? undefined
                        : { height: progressHeight }
                    }
                    className="w-full bg-gradient-to-b from-indigo-500 to-indigo-600 origin-top shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                  />
                </div>

                {/* Header row */}
                <div className="flex items-center justify-between pl-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Core Principles
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    0{activeIndex + 1} / 0{PILLARS_DATA.length}
                  </span>
                </div>

                {/* 3 Pillar Navigator Buttons */}
                <div className="space-y-2 pl-3">
                  {PILLARS_DATA.map((pillar) => {
                    const isActive = activePillarId === pillar.id;
                    return (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => scrollToPillar(pillar.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
                          isActive
                            ? "bg-indigo-50/70 border-indigo-200/90 text-zinc-950 shadow-xs ring-1 ring-indigo-500/10"
                            : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[10px] font-bold tracking-wider uppercase transition-colors ${
                              isActive
                                ? "text-indigo-600 font-semibold"
                                : "text-zinc-400 group-hover:text-zinc-600"
                            }`}
                          >
                            {pillar.number} · {pillar.tag}
                          </span>
                          {isActive && (
                            <span className="size-2 rounded-full bg-indigo-600 animate-pulse" />
                          )}
                        </div>
                        <div className="text-sm font-semibold leading-tight text-zinc-900">
                          {pillar.title.split("&")[0]}
                        </div>

                        {/* Quick preview under active item */}
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-[11px] text-indigo-700/80 font-medium mt-1.5 leading-snug line-clamp-1"
                          >
                            {pillar.badge} • Verified
                          </motion.p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Reliability Matrix: Updates with Active Pillar */}
                <div className="mt-6 pt-5 border-t border-zinc-100 pl-3">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    <span>Live Verification</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-mono">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePillar.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-2 text-xs"
                    >
                      {activePillar.systemGuarantees.map((item) => (
                        <div
                          key={item.label}
                          className="flex justify-between items-center py-1 px-2 rounded-lg bg-zinc-50/80 border border-zinc-100"
                        >
                          <span className="text-[10px] font-semibold text-zinc-500">
                            {item.label}:
                          </span>
                          <span
                            className={`font-semibold font-mono text-[11px] ${
                              item.highlight
                                ? "text-emerald-700"
                                : "text-zinc-800"
                            }`}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Direct Jump Indicator */}
                <div className="mt-4 pt-3 border-t border-zinc-100/80 pl-3 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Scroll to advance pillars</span>
                  <span className="font-mono text-indigo-600 font-semibold">
                    ↓ 3 Core Pillars
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Pillar Cards with Staggered Scroll Animations */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12 lg:space-y-16">
            {PILLARS_DATA.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                isActive={activePillarId === pillar.id}
                onVisible={setActivePillarId}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
