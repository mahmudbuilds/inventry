import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";
import { CategoriesClient, type CategoryItem } from "./categories-client";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories: CategoryItem[] = [];

  try {
    const res = await fetchWithAuth("/api/inventory/categories/", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      categories = Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error("Failed to load categories page data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Categories" />
      <div className="flex flex-1 flex-col py-6">
        <CategoriesClient initialCategories={categories} />
      </div>
    </SidebarInset>
  );
}
