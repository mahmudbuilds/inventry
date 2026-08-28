import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";
import {
  MovementsClient,
  type OptionItem,
  type StockMovementItem,
} from "./movements-client";

export const dynamic = "force-dynamic";

export default async function MovementsPage() {
  let movements: StockMovementItem[] = [];
  let products: OptionItem[] = [];
  let movementCount = 0;

  try {
    const [moveRes, prodRes] = await Promise.all([
      fetchWithAuth("/api/inventory/movements/history/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
      fetchWithAuth("/api/inventory/products/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
    ]);

    if (moveRes.ok) {
      const data = await moveRes.json();
      movements = Array.isArray(data) ? data : data.results || [];
      movementCount = Array.isArray(data) ? data.length : data.count || 0;
    }

    if (prodRes.ok) {
      const data = await prodRes.json();
      products = Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error("Failed to load movements page data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Stock Movements" />
      <div className="flex flex-1 flex-col py-6">
        <MovementsClient
          initialMovements={movements}
          initialMovementCount={movementCount}
          products={products}
        />
      </div>
    </SidebarInset>
  );
}
