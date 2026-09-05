"use client";

import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

const HEADLINE_WORDS = [
  { id: "w-atomic", text: "Atomic" },
  { id: "w-inventory", text: "inventory" },
  { id: "w-precision", text: "precision.", italic: true },
  { id: "w-zero", text: "Zero", subtle: true },
  { id: "w-desyncs", text: "desyncs.", subtle: true },
];

export function MinimalHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-between pt-24 pb-12 px-6 lg:px-8 overflow-hidden">
      {/* Ambient background light refraction */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[42rem] rounded-full bg-gradient-to-tr from-indigo-950/30 via-indigo-900/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero content vertically centered in viewport */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
        {/* 1. Eyebrow */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-8"
        >
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span>Continuous Row-Locked Control</span>
        </motion.div>

        {/* 2. Headline with kinetic word stagger */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.08] max-w-3xl">
          {HEADLINE_WORDS.map((item, i) => (
            <motion.span
              key={item.id}
              className="inline-block mr-[0.28em] last:mr-0"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {item.italic ? (
                <span className="text-zinc-100 italic">{item.text}</span>
              ) : item.subtle ? (
                <span className="text-zinc-400">{item.text}</span>
              ) : (
                item.text
              )}
            </motion.span>
          ))}
        </h1>

        {/* 3. Subtext - 14 words */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed"
        >
          Eliminate stockouts, blind transfers, and race conditions with
          continuous row-locked ledger control.
        </motion.p>

        {/* 4. CTAs */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-white/5 transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#engine"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-5 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition"
          >
            <span>Explore Engine</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom anchor cue */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mx-auto flex flex-col items-center gap-1.5 text-[11px] font-mono text-zinc-500"
      >
        <a
          href="#engine"
          className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Scroll to engine section"
        >
          <span>Scroll to uncover</span>
          <ChevronDownIcon className="size-3" />
        </a>
      </motion.div>
    </section>
  );
}
