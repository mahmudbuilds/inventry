import type { StockMovementItem } from "@/components/dashboard-recent-movements";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";
import {
  MovementSummaryClient,
  type MovementSummaryData,
} from "./movement-summary-client";

export const dynamic = "force-dynamic";

export default async function MovementSummaryPage() {
  let summary: MovementSummaryData = {
    total_in: 0,
    total_out: 0,
    net_change: 0,
    total_movements: 0,
  };
  let recentMovements: StockMovementItem[] = [];

  try {
    const [summaryRes, movementsRes] = await Promise.all([
      fetchWithAuth("/api/inventory/analytics/movement-summary/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
      fetchWithAuth("/api/inventory/movements/history/?limit=10", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
    ]);

    if (summaryRes.ok) {
      summary = await summaryRes.json();
    }
    if (movementsRes.ok) {
      const data = await movementsRes.json();
      recentMovements = Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error("Failed to load movement summary data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Movement Summary Analytics" />
      <div className="flex flex-1 flex-col py-6">
        <MovementSummaryClient
          summary={summary}
          recentMovements={recentMovements}
        />
      </div>
    </SidebarInset>
  );
}
