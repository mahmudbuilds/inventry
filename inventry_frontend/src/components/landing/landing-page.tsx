"use client";

import { MinimalClosing } from "./minimal-closing";
import { MinimalHero } from "./minimal-hero";
import { MinimalMetrics } from "./minimal-metrics";
import { MinimalNavbar } from "./minimal-navbar";
import { ScrollCanvas } from "./scroll-canvas";
import { StickyPillars } from "./sticky-pillars";

interface LandingPageProps {
  user: {
    name?: string;
    email?: string;
    role?: string;
    company?: { name: string };
  } | null;
}

export function LandingPage({ user }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white antialiased overflow-x-hidden">
      <MinimalNavbar user={user} />
      <main>
        <MinimalHero />
        <ScrollCanvas />
        <StickyPillars />
        <MinimalMetrics />
        <MinimalClosing />
      </main>
    </div>
  );
}
