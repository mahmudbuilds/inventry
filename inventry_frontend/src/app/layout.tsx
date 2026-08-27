import type { Metadata } from "next";
import { Noto_Sans, Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const notoSansHeading = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Inventry - Modern Inventory Management",
  description: "Real-time inventory tracking, alerts, and analytics",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        publicSans.variable,
        notoSansHeading.variable,
      )}
    >
      <body className="min-h-full bg-[#F6F8FC] text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
