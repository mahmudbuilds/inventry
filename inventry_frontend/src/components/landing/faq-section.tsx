"use client";

import { ChevronDownIcon, HelpCircleIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const FAQS = [
  {
    q: "How does Inventry prevent negative stock and overselling?",
    a: "When you record a stock dispatch, Inventry checks available quantity immediately. If someone requests more items than you have in stock, the action is automatically prevented, ensuring your inventory balance never drops below zero.",
  },
  {
    q: "How do low-stock alerts work?",
    a: "Every product includes a customizable reorder level threshold. When on-hand inventory drops to or below this level, the item is instantly flagged on the main dashboard overview and listed in the dedicated Low-Stock Analytics view.",
  },
  {
    q: "What types of stock movements can I log?",
    a: "You can record Stock In (for incoming purchases or restocks) and Stock Out (for sales dispatches). Each movement logs the product, quantity, date/timestamp, audit notes, and the authenticated user who recorded it.",
  },
  {
    q: "Can I organize products by category and supplier?",
    a: "Yes. You can create product categories and supplier profiles with contact emails and phone numbers. Every product can be linked to a category and supplier, with dedicated summary reports showing total units and average pricing per category.",
  },
  {
    q: "Can multiple team members access our company account?",
    a: "Yes. The user who signs up becomes the Company Administrator and can add staff members through User Management. Administrators can configure user roles and require staff to set a new password upon their first login.",
  },
  {
    q: "How is our company's data kept secure and private?",
    a: "Every company has its own private, isolated workspace. Your products, suppliers, and records are never visible or accessible to other companies. All accounts are protected with modern industry-standard encryption.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 md:py-36 px-6 lg:px-8 bg-[#fafafc] border-b border-zinc-200/80">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-indigo-200/60 px-3.5 py-1 text-xs font-medium text-indigo-700 shadow-2xs mb-3">
            <HelpCircleIcon className="size-3.5 text-indigo-600" />
            <span>OPERATIONAL FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600">
            Clear answers about how Inventry works, verified directly from the application features.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-zinc-200/90 bg-white shadow-xs overflow-hidden transition-all duration-200 hover:border-zinc-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-zinc-950 transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <div
                    className={`size-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-indigo-50 text-indigo-600" : ""
                    }`}
                  >
                    <ChevronDownIcon className="size-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={
                        shouldReduceMotion
                          ? false
                          : { opacity: 0, height: 0 }
                      }
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-zinc-600 leading-relaxed border-t border-zinc-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
