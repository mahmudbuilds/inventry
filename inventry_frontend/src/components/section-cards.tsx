"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ActivityIcon,
} from "lucide-react";

interface SectionCardsProps {
  total_products?: number;
  total_stock_units?: number;
  low_stock_count?: number;
  turnover_rate?: number;
  products_new_this_month?: number;
  products_change_pct?: number;
  units_added_this_month?: number;
  units_added_change_pct?: number;
}

export function SectionCards({
  total_products = 0,
  total_stock_units = 0,
  low_stock_count = 0,
  turnover_rate = 0,
  products_new_this_month = 0,
  products_change_pct = 0,
  units_added_this_month = 0,
  units_added_change_pct = 0,
}: SectionCardsProps) {
  const isProductsUp = products_change_pct >= 0;
  const isUnitsUp = units_added_change_pct >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* 1. Total Products */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {total_products.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                isProductsUp
                  ? "text-emerald-600 dark:text-emerald-400 gap-1"
                  : "text-rose-600 dark:text-rose-400 gap-1"
              }
            >
              {isProductsUp ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
              {isProductsUp ? `+${products_change_pct}%` : `${products_change_pct}%`}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            {isProductsUp ? "Trending up this month" : "Down from last month"}
            {isProductsUp ? (
              <TrendingUpIcon className="size-4 text-emerald-500" />
            ) : (
              <TrendingDownIcon className="size-4 text-rose-500" />
            )}
          </div>
          <div className="text-muted-foreground">
            {products_new_this_month} new products added this month
          </div>
        </CardFooter>
      </Card>

      {/* 2. Total Stock Units */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Stock Units</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {total_stock_units.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                isUnitsUp
                  ? "text-emerald-600 dark:text-emerald-400 gap-1"
                  : "text-rose-600 dark:text-rose-400 gap-1"
              }
            >
              {isUnitsUp ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
              {isUnitsUp ? `+${units_added_change_pct}%` : `${units_added_change_pct}%`}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            {isUnitsUp ? "Inbound flow positive" : "Inbound flow decreased"}
            {isUnitsUp ? (
              <TrendingUpIcon className="size-4 text-emerald-500" />
            ) : (
              <TrendingDownIcon className="size-4 text-rose-500" />
            )}
          </div>
          <div className="text-muted-foreground">
            {units_added_this_month.toLocaleString()} units added this month
          </div>
        </CardFooter>
      </Card>

      {/* 3. Low Stock Items */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Low Stock Items</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {low_stock_count.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                low_stock_count > 0
                  ? "border-amber-500/30 text-amber-600 dark:text-amber-400 gap-1"
                  : "text-emerald-600 dark:text-emerald-400 gap-1"
              }
            >
              {low_stock_count > 0 ? (
                <>
                  <AlertTriangleIcon className="size-3 text-amber-500" />
                  Attention
                </>
              ) : (
                <>
                  <CheckCircle2Icon className="size-3 text-emerald-500" />
                  Healthy
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            {low_stock_count > 0
              ? `${low_stock_count} item${low_stock_count === 1 ? "" : "s"} below threshold`
              : "All stock levels healthy"}
          </div>
          <div className="text-muted-foreground">
            {low_stock_count > 0 ? "Reordering recommended" : "No immediate reorders needed"}
          </div>
        </CardFooter>
      </Card>

      {/* 4. Stock Turnover Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Stock Turnover Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {turnover_rate.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <ActivityIcon className="size-3 text-primary" />
              Velocity
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            Outbound to stock ratio
          </div>
          <div className="text-muted-foreground">
            {turnover_rate > 0 ? "Active inventory movement" : "Steady inventory movement"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
