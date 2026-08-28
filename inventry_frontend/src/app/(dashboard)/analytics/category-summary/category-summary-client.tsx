"use client";

import {
  BoxesIcon,
  ChartNoAxesCombinedIcon,
  DollarSignIcon,
  LayersIcon,
  PieChartIcon,
  SearchIcon,
} from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {useState, useMemo} from "react";

export interface CategorySummaryItem {
  id: number;
  name: string;
  description?: string;
  product_count?: number;
  total_stock?: number;
  average_price?: number;
}

export function CategorySummaryClient({
  initialCategories = [],
}: {
  initialCategories: CategorySummaryItem[];
}) {
  const [categories] = useState<CategorySummaryItem[]>(initialCategories);
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      return (
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [categories, search]);

  const totalSKUs = useMemo(
    () => categories.reduce((acc, curr) => acc + (curr.product_count || 0), 0),
    [categories],
  );
  const totalStockUnits = useMemo(
    () => categories.reduce((acc, curr) => acc + (curr.total_stock || 0), 0),
    [categories],
  );
  const totalValuation = useMemo(() => {
    return categories.reduce((acc, curr) => {
      const units = curr.total_stock || 0;
      const avg = curr.average_price || 0;
      return acc + units * avg;
    }, 0);
  }, [categories]);

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Categories
            </CardDescription>
            <ChartNoAxesCombinedIcon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Taxonomy classifications
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Products
            </CardDescription>
            <BoxesIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSKUs.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Classified items
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Stock Units
            </CardDescription>
            <LayersIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStockUnits.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              On-hand aggregate
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Estimated Valuation
            </CardDescription>
            <DollarSignIcon className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              $
              {totalValuation.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Units × Avg unit price
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Summary Table */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Category Inventory Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Deep dive into stock distribution, pricing averages, and capital
              allocation across categories
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="relative w-full sm:w-80 mb-4">
            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search category summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>

          {filteredCategories.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <PieChartIcon className="size-12 text-muted-foreground/30 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                No category data
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Create categories and assign products to view analytical
                summaries.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[240px] pl-6 text-xs font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Description
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Products Count
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Total Units
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Avg Unit Price
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Category Value
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right pr-6">
                      Stock Share
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((c) => {
                    const units = c.total_stock || 0;
                    const avg = c.average_price || 0;
                    const catVal = units * avg;
                    const sharePct =
                      totalStockUnits > 0 ? (units / totalStockUnits) * 100 : 0;

                    return (
                      <TableRow
                        key={c.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="pl-6 font-semibold text-sm text-foreground">
                          {c.name}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                          {c.description || "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs tabular-nums">
                          <Badge
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            {c.product_count || 0} SKUs
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-sm tabular-nums text-foreground">
                          {units.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs tabular-nums text-muted-foreground">
                          ${avg.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm tabular-nums text-emerald-600 dark:text-emerald-400">
                          $
                          {catVal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right pr-6 font-medium text-xs tabular-nums">
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {sharePct.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
