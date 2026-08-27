import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import {
  DashboardRecentMovements,
  type StockMovementItem,
} from "@/components/dashboard-recent-movements";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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

  let recentMovements: StockMovementItem[] = [];

  try {
    const [overviewRes, movementsRes] = await Promise.all([
      fetchWithAuth("/api/inventory/analytics/dashboard-overview/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
      fetchWithAuth("/api/inventory/movements/history/?limit=8", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
    ]);

    if (overviewRes.ok) {
      const data = await overviewRes.json();
      stats = { ...stats, ...data };
    }

    if (movementsRes.ok) {
      const moveData = await movementsRes.json();
      recentMovements = Array.isArray(moveData)
        ? moveData
        : moveData.results || [];
    }
  } catch (err) {
    console.error("Failed to load dashboard data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col pb-10">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-4 md:py-6">
            <SectionCards {...stats} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DashboardRecentMovements initialMovements={recentMovements} />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
