"use client";

import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "@/assets/logo.png";

interface MinimalNavbarProps {
  user: {
    name?: string;
    email?: string;
    role?: string;
    company?: { name: string };
  } | null;
}

export function MinimalNavbar({ user }: MinimalNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 30);
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900/80 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 p-1.5 transition-transform group-hover:scale-105">
            <Image
              src={logo}
              alt="Inventry"
              width={20}
              height={20}
              className="invert"
            />
          </div>
          <span className="text-base font-semibold tracking-tight text-white font-sans">
            Inventry
          </span>
        </Link>

        {/* Quiet Anchor Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#engine" className="transition-colors hover:text-white">
            Engine
          </a>
          <a href="#pillars" className="transition-colors hover:text-white">
            Pillars
          </a>
          <a href="#metrics" className="transition-colors hover:text-white">
            Metrics
          </a>
        </nav>

        {/* Actions / Session */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                {user.name}
              </span>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98]"
              >
                <span>Console</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-zinc-400 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-2xl px-6 py-6 space-y-4"
        >
          <div className="flex flex-col space-y-3 text-sm">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                document
                  .getElementById("engine")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-left text-zinc-300 hover:text-white py-1"
            >
              Engine
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                document
                  .getElementById("pillars")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-left text-zinc-300 hover:text-white py-1"
            >
              Pillars
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                document
                  .getElementById("metrics")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-left text-zinc-300 hover:text-white py-1"
            >
              Metrics
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-900 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-full bg-white py-2.5 text-xs font-semibold text-zinc-950"
              >
                <span>Open Console</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-full border border-zinc-800 py-2.5 text-xs font-semibold text-zinc-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-1.5 rounded-full bg-white py-2.5 text-xs font-semibold text-zinc-950"
                >
                  <span>Get Started</span>
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
