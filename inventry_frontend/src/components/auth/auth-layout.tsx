"use client";

import { ArrowLeftIcon, CheckCircle2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  maxWidthClass?: string;
}

export function AuthLayout({
  children,
  maxWidthClass = "max-w-md",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-radial from-indigo-50/50 via-white to-[#fafafc] text-zinc-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between p-6 sm:p-10">
      {/* 1. Subtle Dot Grid Background with vignette */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)] opacity-40"
        style={{
          backgroundImage: "radial-gradient(#94a3b8 1.15px, transparent 1.15px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 2. Ambient soft light gradients matching Landing Hero */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[46rem] rounded-full bg-gradient-to-tr from-indigo-200/40 via-sky-100/30 to-purple-100/30 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-24 size-96 rounded-full bg-indigo-100/30 blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
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

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-800 shadow-xs hover:border-zinc-400 hover:bg-zinc-50 transition"
        >
          <ArrowLeftIcon className="size-3.5" />
          <span>Back to website</span>
        </Link>
      </header>

      {/* Main Centered Content */}
      <main className="my-auto py-10 w-full z-10 flex flex-col items-center">
        <div className={`w-full ${maxWidthClass}`}>
          {children}
        </div>

        {/* Operational Highlights matching Landing Page */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
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
        </div>
      </main>

      {/* Sleek Light Theme Footer matching MinimalClosing */}
      <footer className="pt-8 border-t border-zinc-200/80 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 z-10">
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
    </div>
  );
}
