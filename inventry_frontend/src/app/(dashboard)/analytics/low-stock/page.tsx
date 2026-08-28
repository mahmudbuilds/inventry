import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";
import {
  LowStockClient,
  type LowStockProduct,
  type OptionItem,
} from "./low-stock-client";

export const dynamic = "force-dynamic";

export default async function LowStockPage() {
  let lowStockProducts: LowStockProduct[] = [];
  let categories: OptionItem[] = [];
  let suppliers: OptionItem[] = [];

  try {
    const [lowRes, catRes, supRes] = await Promise.all([
      fetchWithAuth("/api/inventory/analytics/low-stock/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
      fetchWithAuth("/api/inventory/categories/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
      fetchWithAuth("/api/inventory/suppliers/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
    ]);

    if (lowRes.ok) {
      const data = await lowRes.json();
      lowStockProducts = Array.isArray(data) ? data : data.results || [];
    }
    if (catRes.ok) {
      const data = await catRes.json();
      categories = Array.isArray(data) ? data : data.results || [];
    }
    if (supRes.ok) {
      const data = await supRes.json();
      suppliers = Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error("Failed to load low stock page data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Low Stock Analytics" />
      <div className="flex flex-1 flex-col py-6">
        <LowStockClient
          initialProducts={lowStockProducts}
          categories={categories}
          suppliers={suppliers}
        />
      </div>
    </SidebarInset>
  );
}
