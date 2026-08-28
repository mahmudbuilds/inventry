import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";
import {
  type OptionItem,
  type ProductItem,
  ProductsClient,
} from "./products-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: ProductItem[] = [];
  let categories: OptionItem[] = [];
  let suppliers: OptionItem[] = [];

  try {
    const [prodsRes, catsRes, supsRes] = await Promise.all([
      fetchWithAuth("/api/inventory/products/", {
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

    if (prodsRes.ok) {
      const data = await prodsRes.json();
      products = Array.isArray(data) ? data : data.results || [];
    }
    if (catsRes.ok) {
      const data = await catsRes.json();
      categories = Array.isArray(data) ? data : data.results || [];
    }
    if (supsRes.ok) {
      const data = await supsRes.json();
      suppliers = Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error("Failed to load products page data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Products" />
      <div className="flex flex-1 flex-col py-6">
        <ProductsClient
          initialProducts={products}
          categories={categories}
          suppliers={suppliers}
        />
      </div>
    </SidebarInset>
  );
}
