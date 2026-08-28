"use client";

import { ArrowDownLeftIcon, ArrowUpRightIcon } from "lucide-react";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiFetch } from "@/lib/api-client";

interface StockFlowPoint {
  date: string;
  stock_in: number;
  stock_out: number;
}

const chartConfig = {
  stock_in: {
    label: "Stock In (Restock)",
    color: "hsl(142.1, 70.6%, 45.3%)",
  },
  stock_out: {
    label: "Stock Out (Dispatched)",
    color: "hsl(346.8, 77.2%, 49.8%)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  initialDays = "30d",
  initialData = [],
}: {
  initialDays?: string;
  initialData?: StockFlowPoint[];
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState(initialDays);
  const [data, setData] = React.useState<StockFlowPoint[]>(initialData);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isMobile && timeRange === "90d") {
      setTimeRange("7d");
    }
  }, [isMobile, timeRange]);

  React.useEffect(() => {
    if (timeRange === initialDays) return;

    let isMounted = true;
    async function loadFlowData() {
      setLoading(true);
      const days = timeRange === "7d" ? "7" : timeRange === "90d" ? "90" : "30";
      try {
        const res = await apiFetch(
          `/api/inventory/analytics/stock-flow?days=${days}`,
          { headers: { Accept: "application/json" } },
        );
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setData(Array.isArray(json) ? json : []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch stock flow analytics", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFlowData();
    return () => {
      isMounted = false;
    };
  }, [initialDays, timeRange]);

  const totalIn = React.useMemo(
    () => data.reduce((acc, curr) => acc + (curr.stock_in || 0), 0),
    [data],
  );
  const totalOut = React.useMemo(
    () => data.reduce((acc, curr) => acc + (curr.stock_out || 0), 0),
    [data],
  );

  return (
    <Card className="@container/card border-border/80 shadow-xs">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Stock Flow Activity
            </CardTitle>
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground ml-2">
              <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <ArrowDownLeftIcon className="size-3.5" /> +
                {totalIn.toLocaleString()} In
              </span>
              <span className="flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
                <ArrowUpRightIcon className="size-3.5" /> -
                {totalOut.toLocaleString()} Out
              </span>
            </div>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Inbound vs Outbound inventory volume across active transactions
          </CardDescription>
        </div>

        <CardAction>
          <ToggleGroup
            value={[timeRange]}
            onValueChange={(value) => {
              if (value[0]) setTimeRange(value[0]);
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-3! text-xs @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 90 days</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value) setTimeRange(value);
            }}
          >
            <SelectTrigger
              className="flex w-36 text-xs @[767px]/card:hidden"
              size="sm"
              aria-label="Select date range"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        {loading ? (
          <div className="h-[260px] w-full flex flex-col justify-end gap-2 p-4">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-[260px] w-full flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-lg border-muted">
            <p className="text-sm font-medium text-muted-foreground">
              No stock movements logged during this period.
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Add restock or dispatch movements to visualize flow trends.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[260px] w-full"
          >
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillStockIn" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-stock_in)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-stock_in)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient id="fillStockOut" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-stock_out)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-stock_out)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(value) => {
                  if (!value) return "";
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="stock_in"
                type="monotone"
                fill="url(#fillStockIn)"
                stroke="var(--color-stock_in)"
                strokeWidth={2}
                name="Stock In"
              />
              <Area
                dataKey="stock_out"
                type="monotone"
                fill="url(#fillStockOut)"
                stroke="var(--color-stock_out)"
                strokeWidth={2}
                name="Stock Out"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
