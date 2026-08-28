import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SidebarInset aria-busy="true">
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col pb-10">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-4 md:py-6">
            <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
              {["products", "units", "low-stock", "turnover"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border/80 p-5"
                >
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-4 h-8 w-20" />
                  <Skeleton className="mt-3 h-3 w-36" />
                </div>
              ))}
            </div>
            <div className="px-4 lg:px-6">
              <div className="rounded-xl border border-border/80 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Skeleton className="h-6 w-44" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading stock flow activity...
                    </p>
                  </div>
                  <Skeleton className="h-8 w-36" />
                </div>
                <Skeleton className="mt-6 h-[260px] w-full rounded-md" />
              </div>
            </div>
            <div className="px-4 lg:px-6">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
