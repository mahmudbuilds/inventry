"use client";

import { ArrowLeftIcon } from "lucide-react";
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
    <div className="min-h-screen relative overflow-hidden bg-[#fafafc] text-zinc-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between p-6 sm:p-10">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[38rem] rounded-full bg-indigo-50/60 blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white border border-zinc-200/90 shadow-2xs p-1 transition-transform group-hover:scale-105">
            <Image
              src={logo}
              alt="Inventry Logo"
              width={26}
              height={26}
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="text-base font-semibold tracking-tight text-zinc-900 font-sans">
            Inventry
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-1.5 px-3 rounded-full hover:bg-zinc-100"
        >
          <ArrowLeftIcon className="size-3.5" />
          <span>Back to website</span>
        </Link>
      </header>

      {/* Main Form Area */}
      <main className="my-auto py-8 w-full z-10 flex flex-col items-center">
        <div className={`w-full ${maxWidthClass}`}>
          {children}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-4xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 z-10">
        <p>&copy; {new Date().getFullYear()} Inventry, Inc. All rights reserved.</p>
        <div className="flex items-center gap-4 text-zinc-400">
          <Link href="/" className="hover:text-zinc-600 transition-colors">
            Privacy Policy
          </Link>
          <span>&bull;</span>
          <Link href="/" className="hover:text-zinc-600 transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
