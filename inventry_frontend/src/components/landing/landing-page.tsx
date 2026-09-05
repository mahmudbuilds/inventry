"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { FaqSection } from "./faq-section";
import { FeaturesBento } from "./features-bento";
import { MinimalClosing } from "./minimal-closing";
import { MinimalHero } from "./minimal-hero";
import { MinimalMetrics } from "./minimal-metrics";
import { MinimalNavbar } from "./minimal-navbar";
import { NetworkShowcase } from "./network-showcase";
import { ScrollCanvas } from "./scroll-canvas";
import { StickyPillars } from "./sticky-pillars";
import { WorkflowSteps } from "./workflow-steps";

interface LandingPageProps {
  user: {
    name?: string;
    email?: string;
    role?: string;
    company?: { name: string };
  } | null;
}

export function LandingPage({ user }: LandingPageProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-[#fafafc] text-zinc-900 font-sans selection:bg-indigo-500 selection:text-white antialiased overflow-x-clip relative">
      {/* Top Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 origin-left z-60"
      />

      <MinimalNavbar user={user} />

      <main>
        <MinimalHero />
        <ScrollCanvas />
        <NetworkShowcase />
        <StickyPillars />
        <FeaturesBento />
        <WorkflowSteps />
        <MinimalMetrics />
        <FaqSection />
        <MinimalClosing />
      </main>
    </div>
  );
}
