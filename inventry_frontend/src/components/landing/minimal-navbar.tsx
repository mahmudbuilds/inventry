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
          ? "bg-white/85 backdrop-blur-xl border-b border-zinc-200/80 shadow-xs py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        {/* Brand - Exactly matches dashboard sidebar */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white border border-zinc-200/90 shadow-xs p-1 transition-transform group-hover:scale-105">
            <Image
              src={logo}
              alt="Inventry Logo"
              width={26}
              height={26}
              className="h-6 w-6 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-zinc-900 font-sans">
              Inventry
            </span>
          </div>
        </Link>

        {/* Anchor Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-600">
          <a href="#engine" className="transition-colors hover:text-indigo-600">
            Simulator
          </a>
          <a href="#analytics" className="transition-colors hover:text-indigo-600">
            Analytics
          </a>
          <a href="#pillars" className="transition-colors hover:text-indigo-600">
            Reliability
          </a>
          <a href="#features" className="transition-colors hover:text-indigo-600">
            Features
          </a>
          <a href="#workflow" className="transition-colors hover:text-indigo-600">
            How It Works
          </a>
          <a href="#faq" className="transition-colors hover:text-indigo-600">
            FAQ
          </a>
        </nav>

        {/* Actions / Session */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 font-mono">
                {user.name}
              </span>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                <span>Dashboard</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors px-2.5 py-1"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                <span>Sign Up</span>
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
            className="p-2 text-zinc-600 hover:text-zinc-950"
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
          className="md:hidden border-b border-zinc-200 bg-white/95 backdrop-blur-2xl px-6 py-6 space-y-4 shadow-xl"
        >
          <div className="flex flex-col space-y-3 text-sm">
            {["engine", "analytics", "pillars", "features", "workflow", "faq"].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  document
                    .getElementById(sec)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left capitalize text-zinc-700 hover:text-indigo-600 py-1 font-medium"
              >
                {sec === "pillars" ? "Reliability" : sec}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 py-2.5 text-xs font-semibold text-white"
              >
                <span>Open Dashboard</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-full border border-zinc-200 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-1.5 rounded-full bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20"
                >
                  <span>Sign Up</span>
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
