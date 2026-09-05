"use client";

import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  PackageCheckIcon,
  SparklesIcon,
  TruckIcon,
  WarehouseIcon,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import warehouseRobotics from "@/assets/warehouse-robotics.jpg";

export function MinimalHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scroll-driven transforms
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const scaleVisual = useTransform(scrollYProgress, [0, 0.8], [0.95, 1.02]);
  const rotateXVisual = useTransform(scrollYProgress, [0, 0.6], [5, 0]);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 lg:px-8 overflow-hidden bg-radial from-indigo-50/50 via-white to-[#fafafc]"
    >
      {/* 1. Subtle Dot Grid Background with vignette */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)] opacity-40"
        style={{
          backgroundImage: "radial-gradient(#94a3b8 1.15px, transparent 1.15px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 2. Ambient soft light gradients */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[46rem] rounded-full bg-gradient-to-tr from-indigo-200/40 via-sky-100/30 to-purple-100/30 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-24 size-96 rounded-full bg-indigo-100/30 blur-3xl pointer-events-none -z-10" />

      {/* Hero Content Header */}
      <motion.div
        style={shouldReduceMotion ? undefined : { y: yContent }}
        className="max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        {/* Eyebrow Pill */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-4 py-1.5 text-xs font-medium text-indigo-900 shadow-xs backdrop-blur-md mb-6"
        >
          <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-Time Inventory & SKU Stock Management</span>
          <SparklesIcon className="size-3.5 text-indigo-500 ml-0.5" />
        </motion.div>

        {/* Clear Headline without Jargon */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.1] max-w-3xl">
          Never run out of stock. <br />
          <span className="text-indigo-600 font-serif italic">Never oversell.</span>
        </h1>

        {/* Clear Subtext */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed"
        >
          Inventry keeps your entire stock count synchronized in real time across every product, category, and order dispatch—so your team always knows exactly what is available.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2.5 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            <span>Sign Up</span>
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#engine"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3.5 text-sm font-medium text-zinc-800 shadow-xs hover:border-zinc-400 hover:bg-zinc-50 transition"
          >
            <span>See Live Stock Demo</span>
          </a>
        </motion.div>

        {/* Operational Highlights */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-4 text-emerald-600" />
            <span>Zero Double-Selling</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-4 text-indigo-600" />
            <span>Complete Movement Audit Trail</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-4 text-emerald-600" />
            <span>Instant Reorder Alerts</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll-Driven Visual Showcase - AI Generated Robotics Fulfillment Facility */}
      <motion.div
        style={
          shouldReduceMotion
            ? undefined
            : {
                y: yVisual,
                scale: scaleVisual,
                rotateX: rotateXVisual,
                transformPerspective: 1200,
              }
        }
        className="mt-14 max-w-5xl mx-auto relative group"
      >
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200/90 bg-white shadow-2xl shadow-indigo-950/10 backdrop-blur-xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-50/80 border-b border-zinc-200/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-400 inline-block" />
              <span className="size-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="size-2.5 rounded-full bg-emerald-400 inline-block" />
              <span className="ml-3 font-semibold text-zinc-700">
                Inventry Command Center - Live Stock Overview
              </span>
            </div>
            <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
                All Systems Normal
              </span>
            </div>
          </div>

          {/* AI Generated High-Detail Warehouse Robotics Visual - Static Import */}
          <div className="relative w-full overflow-hidden bg-zinc-100">
            <Image
              src={warehouseRobotics}
              alt="Automated fulfillment center with smart robotics and inventory shelves"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-103"
              priority
            />

            {/* Floating Live Card 1 */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute top-6 left-6 hidden sm:flex items-center gap-3 rounded-2xl bg-white/95 border border-zinc-200/90 px-4 py-3 shadow-lg backdrop-blur-md"
            >
              <div className="size-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <PackageCheckIcon className="size-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                  Daily Stock Movements
                </div>
                <div className="text-sm font-bold text-zinc-900">
                  184 Dispatches Logged
                </div>
              </div>
            </motion.div>

            {/* Floating Live Card 2 */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute bottom-6 right-6 hidden sm:flex items-center gap-3 rounded-2xl bg-white/95 border border-zinc-200/90 px-4 py-3 shadow-lg backdrop-blur-md"
            >
              <div className="size-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <TruckIcon className="size-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                  Inbound Deliveries
                </div>
                <div className="text-sm font-bold text-zinc-900">
                  1,250 Units Received
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-200/80 bg-white p-4">
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-zinc-950 font-mono">
                99.9%
              </div>
              <div className="text-xs text-zinc-500 font-medium">
                Inventory Accuracy
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600 font-mono">
                Instant
              </div>
              <div className="text-xs text-zinc-500 font-medium">
                Live Stock Updates
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600 font-mono">
                Zero
              </div>
              <div className="text-xs text-zinc-500 font-medium">
                Double-Selling Incidents
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-zinc-950 font-mono">
                24/7
              </div>
              <div className="text-xs text-zinc-500 font-medium">
                Low-Stock Warning Sentinels
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Down Cue */}
      <div className="mt-14 flex justify-center">
        <a
          href="#engine"
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-indigo-600 transition-colors"
        >
          <span>Scroll down to see live stock management</span>
          <ChevronDownIcon className="size-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
