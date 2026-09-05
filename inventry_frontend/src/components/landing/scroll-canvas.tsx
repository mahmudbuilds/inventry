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
      className="relative py-24 md:py-36 px-6 lg:px-8 perspective-1000 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Sub-Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 px-3 py-1 text-xs font-medium text-indigo-700 mb-3">
            <span>LIVE INVENTORY SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
            Instant Real-Time Stock Updates
          </h2>
          <p className="mt-3 text-base text-zinc-600 max-w-lg mx-auto">
            Test how incoming freight deliveries and customer dispatches update stock balances immediately without errors or delays.
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
          className="rounded-3xl border border-zinc-200/90 bg-white/95 p-6 sm:p-10 shadow-2xl shadow-indigo-950/5 backdrop-blur-2xl transition-shadow hover:shadow-indigo-500/10"
        >
          {/* Canvas Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-zinc-800">
                {"INVENTRY // LIVE STOCK STREAM"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-zinc-100 px-3 py-1 rounded-md border border-zinc-200 text-zinc-600 font-medium">STATUS: REAL-TIME SYNC</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md font-semibold">OVERSOLD PROTECTION: ACTIVE</span>
            </div>
          </div>

          {/* Metric and Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 items-center">
            {/* Live Counter Display */}
            <div className="md:col-span-6 space-y-2">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Total Available Stock on Hand
              </div>
              <div className="flex items-baseline gap-3">
                <motion.span
                  key={stockTotal}
                  initial={
                    shouldReduceMotion ? false : { scale: 0.95, opacity: 0.8 }
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-5xl sm:text-6xl font-bold tracking-tight font-mono transition-colors duration-300 ${
                    pulse ? "text-emerald-600" : "text-zinc-950"
                  }`}
                >
                  {stockTotal.toLocaleString()}
                </motion.span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2Icon className="size-3.5" />
                  Accurate
                </span>
              </div>
              <p className="text-xs text-zinc-600 max-w-sm leading-relaxed">
                Click the buttons to simulate receiving new shipments or fulfilling customer orders. Notice how stock levels never become negative.
              </p>
            </div>

            {/* Interactive Simulation Controls */}
            <div className="md:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSimulateIntake}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-xs font-semibold text-zinc-800 shadow-xs hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 transition active:scale-[0.97]"
              >
                <ArrowDownLeftIcon className="size-4 text-emerald-600" />
                <span>Receive Shipment (+32)</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateDispatch}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-xs font-semibold text-zinc-800 shadow-xs hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-800 transition active:scale-[0.97]"
              >
                <ArrowUpRightIcon className="size-4 text-indigo-600" />
                <span>Dispatch Order (-16)</span>
              </button>
            </div>
          </div>

          {/* Real-time Activity Stream */}
          <div className="space-y-2.5 pt-2">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold pb-1 flex items-center justify-between">
              <span>Recent Inventory Transactions</span>
              <span className="text-[11px] text-zinc-400 font-normal">Updated Just Now</span>
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
                    className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-4 py-3 text-xs shadow-2xs hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2.5 rounded-full ${
                          tx.type === "IN" ? "bg-emerald-500" : "bg-indigo-500"
                        }`}
                      />
                      <span className="font-mono font-medium text-zinc-800">{tx.sku}</span>
                      <span className="text-zinc-600 hidden sm:inline">
                        {tx.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono font-semibold ${
                          tx.type === "IN"
                            ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60"
                            : "text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60"
                        }`}
                      >
                        {tx.change > 0 ? `+${tx.change}` : tx.change} units
                      </span>
                      <span className="text-zinc-400 text-[11px]">
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
