"use client";

import {
  AlertTriangleIcon,
  ArrowDownLeftIcon,
  BoxesIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SearchIcon,
  XCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export interface LowStockProduct {
  id: number;
  sku: string;
  name: string;
  category: number;
  category_name?: string;
  supplier?: number | null;
  supplier_name?: string | null;
  unit_price: string | number;
  quantity_in_stock: number;
  reorder_level: number;
}

export interface OptionItem {
  id: number;
  name: string;
}

export function LowStockClient({
  initialProducts = [],
  categories = [],
  suppliers = [],
}: {
  initialProducts: LowStockProduct[];
  categories: OptionItem[];
  suppliers: OptionItem[];
}) {
  const router = useRouter();
  const [products, setProducts] =
    React.useState<LowStockProduct[]>(initialProducts);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [selectedSupplier, setSelectedSupplier] = React.useState("ALL");

  // Restock Dialog
  const [restockProduct, setRestockProduct] =
    React.useState<LowStockProduct | null>(null);
  const [restockOpen, setRestockOpen] = React.useState(false);
  const [restockSubmitting, setRestockSubmitting] = React.useState(false);
  const [restockQuantity, setRestockQuantity] = React.useState("25");
  const [restockNotes, setRestockNotes] = React.useState(
    "Low stock replenishment",
  );

  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());

      const matchCat =
        selectedCategory === "ALL" || String(p.category) === selectedCategory;

      const matchSup =
        selectedSupplier === "ALL" || String(p.supplier) === selectedSupplier;

      return matchSearch && matchCat && matchSup;
    });
  }, [products, search, selectedCategory, selectedSupplier]);

  const outOfStockCount = React.useMemo(
    () => products.filter((p) => p.quantity_in_stock <= 0).length,
    [products],
  );
  const lowStockCount = products.length - outOfStockCount;
  const totalDeficitUnits = React.useMemo(() => {
    return products.reduce((acc, curr) => {
      const deficit = Math.max(0, curr.reorder_level - curr.quantity_in_stock);
      return acc + deficit;
    }, 0);
  }, [products]);

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct) return;
    setRestockSubmitting(true);
    try {
      const res = await fetch("/api/inventory/movements/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: restockProduct.id,
          movement_type: "IN",
          quantity: parseInt(restockQuantity, 10) || 1,
          notes: restockNotes,
        }),
      });

      if (res.ok) {
        toast.success(
          `Restocked ${restockQuantity} units for "${restockProduct.name}"!`,
        );
        setRestockOpen(false);
        router.refresh();
      } else {
        const errorData = await res.json();
        const msg = Object.entries(errorData)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
          .join(" | ");
        toast.error(msg || "Failed to record restock movement");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while recording restock");
    } finally {
      setRestockSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/80 shadow-xs border-amber-500/20 bg-amber-50/10 dark:bg-amber-950/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Low Stock Alerts
            </CardDescription>
            <AlertTriangleIcon className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {lowStockCount} Items
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Below minimum reorder threshold
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs border-rose-500/20 bg-rose-50/10 dark:bg-rose-950/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium text-rose-700 dark:text-rose-400">
              Out of Stock (Zero Units)
            </CardDescription>
            <XCircleIcon className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
              {outOfStockCount} Items
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Immediate procurement required
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Deficit to Safe Stock
            </CardDescription>
            <BoxesIcon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDeficitUnits.toLocaleString()} Units
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total units needed to meet minimums
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Low Stock & Reorder Alerts
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Prioritize restock orders based on inventory shortfall and reorder
              thresholds
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
            <div className="relative w-full sm:w-80">
              <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search low stock SKU or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select
                value={selectedCategory}
                onValueChange={(v) => setSelectedCategory(v ?? "ALL")}
              >
                <SelectTrigger className="w-[160px] text-xs h-9">
                  <SelectValue placeholder="Category" />
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

              <Select
                value={selectedSupplier}
                onValueChange={(v) => setSelectedSupplier(v ?? "ALL")}
              >
                <SelectTrigger className="w-[160px] text-xs h-9">
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Suppliers</SelectItem>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <CheckCircle2Icon className="size-12 text-emerald-500/50 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                Stock levels healthy!
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                There are currently no products under their reorder threshold
                for the selected filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[260px] pl-6 text-xs font-semibold">
                      Product & SKU
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Supplier
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Current Stock
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Reorder Level
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Urgency
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right pr-6">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => {
                    const isOut = p.quantity_in_stock <= 0;
                    const deficit = Math.max(
                      0,
                      p.reorder_level - p.quantity_in_stock,
                    );

                    return (
                      <TableRow
                        key={p.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="pl-6 font-medium">
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
                        <TableCell className="text-xs text-muted-foreground">
                          {p.supplier_name || "—"}
                        </TableCell>
                        <TableCell className="text-right font-bold text-sm tabular-nums">
                          <span
                            className={
                              isOut
                                ? "text-rose-600 font-extrabold"
                                : "text-amber-600"
                            }
                          >
                            {p.quantity_in_stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs tabular-nums text-muted-foreground">
                          {p.reorder_level}
                        </TableCell>
                        <TableCell>
                          {isOut ? (
                            <Badge
                              variant="outline"
                              className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 gap-1 text-xs"
                            >
                              <XCircleIcon className="size-3" />
                              Out of Stock
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 gap-1 text-xs"
                            >
                              <AlertTriangleIcon className="size-3" />
                              Deficit: -{deficit}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 gap-1.5"
                            onClick={() => {
                              setRestockProduct(p);
                              const defaultRestock = Math.max(
                                20,
                                p.reorder_level * 2 - p.quantity_in_stock,
                              );
                              setRestockQuantity(String(defaultRestock));
                              setRestockOpen(true);
                            }}
                          >
                            <ArrowDownLeftIcon className="size-3.5 text-emerald-600" />
                            Restock
                          </Button>
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

      {/* RESTOCK DIALOG */}
      <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Quick Restock Order
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record incoming shipment for{" "}
              <span className="font-semibold text-foreground">
                {restockProduct?.name}
              </span>{" "}
              (Current stock: {restockProduct?.quantity_in_stock}, Min:{" "}
              {restockProduct?.reorder_level})
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleRestockSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="r-qty" className="text-xs font-medium">
                Restock Units <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="r-qty"
                type="number"
                min="1"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="r-notes" className="text-xs font-medium">
                Notes / Supplier Reference
              </Label>
              <Input
                id="r-notes"
                value={restockNotes}
                onChange={(e) => setRestockNotes(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRestockOpen(false)}
                disabled={restockSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={restockSubmitting}>
                {restockSubmitting && (
                  <Loader2Icon className="size-4 animate-spin mr-1" />
                )}
                Confirm Restock
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
