"use client";

import {
  ActivityIcon,
  ClockIcon,
  FlameIcon,
  RefreshCwIcon,
  SearchIcon,
  TrendingUpIcon,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface TurnoverProduct {
  id: number;
  sku: string;
  name: string;
  category: number;
  category_name?: string;
  supplier_name?: string | null;
  unit_price: string | number;
  quantity_in_stock: number;
  turnover_rate?: number;
}

export interface OptionItem {
  id: number;
  name: string;
}

export function StockTurnoverClient({
  initialProducts = [],
  categories = [],
}: {
  initialProducts: TurnoverProduct[];
  categories: OptionItem[];
}) {
  const [products] = React.useState<TurnoverProduct[]>(initialProducts);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());

      const matchCat =
        selectedCategory === "ALL" || String(p.category) === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [products, search, selectedCategory]);

  const avgTurnover = React.useMemo(() => {
    if (products.length === 0) return 0;
    const sum = products.reduce(
      (acc, curr) => acc + (curr.turnover_rate || 0),
      0,
    );
    return sum / products.length;
  }, [products]);

  const topPerformer = React.useMemo(() => {
    if (products.length === 0) return null;
    return products[0];
  }, [products]);

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Average Turnover Rate
            </CardDescription>
            <ActivityIcon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTurnover.toFixed(2)}x</div>
            <p className="text-xs text-muted-foreground mt-1">
              Outbound to inventory stock ratio
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Top Velocity Product
            </CardDescription>
            <FlameIcon className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {topPerformer ? topPerformer.name : "No data yet"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {topPerformer
                ? `${(topPerformer.turnover_rate || 0).toFixed(2)}x turnover`
                : "Record movements"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Active Moving Products
            </CardDescription>
            <RefreshCwIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items with dispatched inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Turnover Table Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Product Turnover Rankings
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Evaluate inventory velocity and demand speed (Dispatched units /
              Current on-hand stock)
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
            <div className="relative w-full sm:w-80">
              <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search product or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(v) => setSelectedCategory(v ?? "ALL")}
            >
              <SelectTrigger className="w-[180px] text-xs h-9">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <RefreshCwIcon className="size-12 text-muted-foreground/30 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                No turnover data recorded yet
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Products will appear here once outbound dispatches ('Stock Out')
                are logged.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[80px] pl-6 text-xs font-semibold">
                      Rank
                    </TableHead>
                    <TableHead className="w-[260px] text-xs font-semibold">
                      Product & SKU
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Current Stock
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Turnover Ratio
                    </TableHead>
                    <TableHead className="text-xs font-semibold pr-6">
                      Velocity Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p, index) => {
                    const rate = p.turnover_rate || 0;
                    const isHigh = rate >= 1.0;
                    const isMed = rate >= 0.5 && rate < 1.0;

                    return (
                      <TableRow
                        key={p.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="pl-6 font-bold text-xs text-muted-foreground">
                          #{index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-foreground">
                              {p.name}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {p.sku}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            {p.category_name || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs tabular-nums text-foreground">
                          {p.quantity_in_stock.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-bold text-sm tabular-nums text-primary">
                          {rate.toFixed(2)}x
                        </TableCell>
                        <TableCell className="pr-6">
                          {isHigh ? (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1 text-xs"
                            >
                              <FlameIcon className="size-3 text-emerald-600" />
                              High Velocity
                            </Badge>
                          ) : isMed ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 gap-1 text-xs"
                            >
                              <TrendingUpIcon className="size-3 text-blue-600" />
                              Moderate Velocity
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 gap-1 text-xs"
                            >
                              <ClockIcon className="size-3" />
                              Slow Moving
                            </Badge>
                          )}
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
