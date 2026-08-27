import type { Metadata } from "next";
import { Public_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QuickCreateProvider } from "@/context/quick-create-context";
import { QuickCreateDrawer } from "@/components/quick-create-drawer";
import { fetchWithAuth } from "@/lib/api";

const notoSansHeading = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Inventry - Modern Inventory Management",
  description: "Real-time inventory tracking, alerts, and analytics",
};

async function getUser() {
  try {
    const res = await fetchWithAuth("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to load user data", err);
  }
  return null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

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
        <QuickCreateProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <AppSidebar variant="inset" user={user} />
            {children}
            <QuickCreateDrawer />
          </SidebarProvider>
        </QuickCreateProvider>
      </body>
    </html>
  );
}