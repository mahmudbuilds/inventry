import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";
import {
  CategorySummaryClient,
  type CategorySummaryItem,
} from "./category-summary-client";

export const dynamic = "force-dynamic";

export default async function CategorySummaryPage() {
  let categories: CategorySummaryItem[] = [];

  try {
    const res = await fetchWithAuth(
      "/api/inventory/analytics/category-summary/",
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();
      categories = Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error("Failed to load category summary page data", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="Category Summary" />
      <div className="flex flex-1 flex-col py-6">
        <CategorySummaryClient initialCategories={categories} />
      </div>
    </SidebarInset>
  );
}
