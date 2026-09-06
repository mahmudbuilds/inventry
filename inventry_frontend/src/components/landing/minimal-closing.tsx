"use client";

import { ArrowRightIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

export function MinimalClosing() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-28 md:py-36 px-6 lg:px-8 text-center relative overflow-hidden bg-white">
      {/* Radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[36rem] rounded-full bg-indigo-50/80 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200/60 px-3.5 py-1 text-xs font-mono font-medium text-indigo-700">
          <span>GET STARTED IN SECONDS</span>
        </div>

        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 leading-tight"
        >
          Ready for simple, reliable inventory control?
        </motion.h2>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed"
        >
          Set up your organization in minutes, invite your team, and keep your inventory accurate across every channel with zero stress.
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-4 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2.5 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            <span>Sign Up</span>
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-7 py-3.5 text-sm font-medium text-zinc-800 shadow-xs hover:border-zinc-400 hover:bg-zinc-50 transition"
          >
            <span>Sign In to Dashboard</span>
          </Link>
        </motion.div>
      </div>

      {/* Sleek Light Theme Footer */}
      <footer className="mt-28 pt-8 border-t border-zinc-200/80 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        {/* Brand matching dashboard sidebar */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-white border border-zinc-200 shadow-2xs p-1">
            <Image
              src={logo}
              alt="Inventry Logo"
              width={24}
              height={24}
              className="h-5 w-5 object-contain"
            />
          </div>
          <span className="font-bold text-zinc-900 text-sm font-sans">Inventry</span>
          <span className="text-zinc-400">|</span>
          <span>&copy; {new Date().getFullYear()} Inventry Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-500 font-medium">
          <span>REAL-TIME SYNC</span>
          <span>BANK-GRADE SECURITY</span>
          <span>99.99% UPTIME</span>
        </div>
      </footer>
    </section>
  );
}

