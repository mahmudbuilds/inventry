import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";
import {
  type OptionItem,
  StockTurnoverClient,
  type TurnoverProduct,
} from "./stock-turnover-client";

export const dynamic = "force-dynamic";

export default async function StockTurnoverPage() {
  let turnoverProducts: TurnoverProduct[] = [];
  let categories: OptionItem[] = [];

  try {
    const [turnRes, catRes] = await Promise.all([
      fetchWithAuth("/api/inventory/analytics/stock-turnover/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
      fetchWithAuth("/api/inventory/categories/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
    ]);

    if (turnRes.ok) {
      const data = await turnRes.json();
      turnoverProducts = Array.isArray(data) ? data : data.results || [];
    }
    if (catRes.ok) {
      const data = await catRes.json();
      categories = Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error("Failed to load stock turnover page data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Stock Turnover Analytics" />
      <div className="flex flex-1 flex-col py-6">
        <StockTurnoverClient
          initialProducts={turnoverProducts}
          categories={categories}
        />
      </div>
    </SidebarInset>
  );
}
