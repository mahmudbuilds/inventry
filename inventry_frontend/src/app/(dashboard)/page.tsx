import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";

import data from "./data.json";
import { cookies } from "next/headers";

export default async function Page() {
  let cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value
  let stats = {
    total_products: 0,
    total_stock_units: 0,
    low_stock_count: 0,
    turnover_rate: 0,
    products_new_this_month: 0,
    products_change_pct: 0,
    units_added_this_month: 0,
    units_added_change_pct: 0,
  };

  try {
    const dashboardViewResponse = await fetchWithAuth(
      "/api/inventory/analytics/dashboard-overview/",
      {
        method: "GET", credentials: "include",
        cache: "no-store"
      },
    );
    if (dashboardViewResponse.ok) {
      const data = await dashboardViewResponse.json();
      stats = { ...stats, ...data };
    } else {
      console.warn(`Dashboard overview returned status: ${dashboardViewResponse.status}`);
    }
  } catch (err) {
    console.error("Failed to load dashboard overview data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards {...stats} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
