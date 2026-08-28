import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";
import { type SupplierItem, SuppliersClient } from "./suppliers-client";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  let suppliers: SupplierItem[] = [];

  try {
    const res = await fetchWithAuth("/api/inventory/suppliers/", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      suppliers = Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error("Failed to load suppliers page data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Suppliers" />
      <div className="flex flex-1 flex-col py-6">
        <SuppliersClient initialSuppliers={suppliers} />
      </div>
    </SidebarInset>
  );
}
