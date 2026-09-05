"use client";

import { ArrowRightIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

export function MinimalClosing() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-28 md:py-36 px-6 lg:px-8 text-center relative overflow-hidden">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-indigo-950/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto space-y-6">
        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight"
        >
          Ready for atomic precision?
        </motion.h2>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto"
        >
          Set up your multi-tenant organization in under sixty seconds.
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-2 flex items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-950 shadow-xl shadow-white/5 transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-6 py-3.5 text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition"
          >
            <span>Sign In</span>
          </Link>
        </motion.div>
      </div>

      {/* Sleek Minimalist Footer */}
      <footer className="mt-28 pt-8 border-t border-zinc-900 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2.5">
          <div className="flex size-6 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 p-1">
            <Image
              src={logo}
              alt="Inventry"
              width={14}
              height={14}
              className="invert"
            />
          </div>
          <span className="font-semibold text-zinc-300">Inventry</span>
          <span>(c) {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px] text-zinc-400">
          <span>POSTGRESQL 16</span>
          <span>DJANGO 6.1</span>
          <span>NEXT.JS 16</span>
        </div>
      </footer>
    </section>
  );
}
