"use client";

import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

interface Transaction {
  id: string;
  sku: string;
  name: string;
  change: number;
  type: "IN" | "OUT";
  time: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    sku: "SKU-9021",
    name: "Industrial Sensor Hub",
    change: 48,
    type: "IN",
    time: "0.2s ago",
  },
  {
    id: "tx-2",
    sku: "SKU-4820",
    name: "Optic Cable Harness",
    change: -12,
    type: "OUT",
    time: "1.4s ago",
  },
  {
    id: "tx-3",
    sku: "SKU-3199",
    name: "Thermal Interface Pad",
    change: 120,
    type: "IN",
    time: "3.8s ago",
  },
];

export function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [stockTotal, setStockTotal] = useState(8742);
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [pulse, setPulse] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.45], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.45], [10, 0]);

  const handleSimulateIntake = () => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "Modular Servo Unit",
      change: 32,
      type: "IN",
      time: "Just now",
    };
    setStockTotal((prev) => prev + 32);
    setTransactions((prev) => [newTx, ...prev.slice(0, 3)]);
    setPulse(true);
    setTimeout(() => setPulse(false), 800);
  };

  const handleSimulateDispatch = () => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "Precision Stepper Motor",
      change: -16,
      type: "OUT",
      time: "Just now",
    };
    setStockTotal((prev) => prev - 16);
    setTransactions((prev) => [newTx, ...prev.slice(0, 3)]);
    setPulse(true);
    setTimeout(() => setPulse(false), 800);
  };

  return (
    <section
      id="engine"
      ref={containerRef}
      className="relative py-24 md:py-36 px-6 lg:px-8 perspective-1000"
    >
      <div className="max-w-5xl mx-auto">
        {/* Minimal Section Sub-Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
            The Execution Engine
          </h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto">
            Row-level isolation locks every SKU record before mutation occurs.
          </p>
        </div>

        {/* Scroll-Driven Viewport Canvas */}
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  scale,
                  opacity,
                  rotateX,
                  transformPerspective: 1200,
                }
          }
          className="rounded-3xl border border-zinc-800/90 bg-zinc-950/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl transition-shadow hover:shadow-indigo-500/5"
        >
          {/* Canvas Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800/80 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-zinc-300">
                {"INVENTRY.MUTEX // STRICT ACID"}
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono text-zinc-500">
              <span>LATENCY: 11ms</span>
              <span>LOCK: EXCLUSIVE</span>
            </div>
          </div>

          {/* Metric and Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 items-center">
            {/* Live Counter Display */}
            <div className="md:col-span-6 space-y-2">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Total Live Stock Units
              </div>
              <div className="flex items-baseline gap-3">
                <motion.span
                  key={stockTotal}
                  initial={
                    shouldReduceMotion ? false : { scale: 0.95, opacity: 0.8 }
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-5xl sm:text-6xl font-semibold tracking-tight font-mono transition-colors duration-300 ${
                    pulse ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {stockTotal.toLocaleString()}
                </motion.span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2Icon className="size-3.5" />
                  Synced
                </span>
              </div>
              <p className="text-xs text-zinc-500 max-w-sm">
                Each mutation runs inside an atomic transaction block with
                select_for_update().
              </p>
            </div>

            {/* Interactive Simulation Controls */}
            <div className="md:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSimulateIntake}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-5 py-2.5 text-xs font-medium text-zinc-200 hover:border-zinc-700 hover:text-white transition active:scale-[0.97]"
              >
                <ArrowDownLeftIcon className="size-3.5 text-emerald-400" />
                <span>Simulate Inbound (+32)</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateDispatch}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-5 py-2.5 text-xs font-medium text-zinc-200 hover:border-zinc-700 hover:text-white transition active:scale-[0.97]"
              >
                <ArrowUpRightIcon className="size-3.5 text-indigo-400" />
                <span>Simulate Dispatch (-16)</span>
              </button>
            </div>
          </div>

          {/* Real-time Ledger Stream */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 pb-2">
              Recent Atomic Mutex Commits
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {transactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between rounded-xl border border-zinc-900/80 bg-zinc-900/40 px-4 py-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2 rounded-full ${
                          tx.type === "IN" ? "bg-emerald-400" : "bg-indigo-400"
                        }`}
                      />
                      <span className="font-mono text-zinc-300">{tx.sku}</span>
                      <span className="text-zinc-400 hidden sm:inline">
                        {tx.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono font-medium ${
                          tx.type === "IN"
                            ? "text-emerald-400"
                            : "text-zinc-300"
                        }`}
                      >
                        {tx.change > 0 ? `+${tx.change}` : tx.change} units
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {tx.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
