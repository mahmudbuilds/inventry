"use client";

import {
  ActivityIcon,
  ArrowDownLeftIcon,
  ArrowLeftRightIcon,
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  TrendingUpIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import { apiFetch, formatApiError } from "@/lib/api-client";
import { useQuickCreate } from "@/context/quick-create-context";
import { useUserRole } from "@/context/user-role-context";

export interface StockMovementItem {
  id: number;
  product: number;
  product_name: string;
  product_sku: string;
  movement_type: "IN" | "OUT";
  quantity: number;
  timestamp: string;
  performed_by_username?: string;
  notes?: string;
}

export interface OptionItem {
  id: number;
  name: string;
  sku?: string;
  quantity_in_stock?: number;
}

export function MovementsClient({
  initialMovements = [],
  initialMovementCount = 0,
  products = [],
}: {
  initialMovements: StockMovementItem[];
  initialMovementCount: number;
  products: OptionItem[];
}) {
  const router = useRouter();
  const { open: openQuickCreate } = useQuickCreate();
  const { canManageInventory } = useUserRole();
  const [movements, setMovements] =
    React.useState<StockMovementItem[]>(initialMovements);
  const [productsList, setProductsList] =
    React.useState<OptionItem[]>(products);
  const [movementCount, setMovementCount] =
    React.useState(initialMovementCount);
  const [page, setPage] = React.useState(1);
  const [loadingMovements, setLoadingMovements] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("ALL");

  const totalPages = Math.max(1, Math.ceil(movementCount / 20));

  React.useEffect(() => {
    let isMounted = true;

    async function fetchMovements() {
      setLoadingMovements(true);
      const params = new URLSearchParams({ page: String(page) });
      if (search.trim()) params.set("search", search.trim());
      if (typeFilter !== "ALL") params.set("movement_type", typeFilter);

      try {
        const res = await apiFetch(
          `/api/inventory/movements/history/?${params.toString()}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setMovements(Array.isArray(data) ? data : data.results || []);
          setMovementCount(Array.isArray(data) ? data.length : data.count || 0);
        }
      } catch (err) {
        console.error("Failed to load stock movements", err);
      } finally {
        if (isMounted) setLoadingMovements(false);
      }
    }

    fetchMovements();
    return () => {
      isMounted = false;
    };
  }, [page, search, typeFilter]);

  React.useEffect(() => {
    setPage(1);
  }, [search, typeFilter]);

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await apiFetch("/api/inventory/products/");
      if (res.ok) {
        const data = await res.json();
        setProductsList(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error("Failed to load products in movements client", err);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Create Movement Dialog
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createSubmitting, setCreateSubmitting] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    product: "",
    movement_type: "IN",
    quantity: "1",
    notes: "",
  });

  React.useEffect(() => {
    setMovements(initialMovements);
  }, [initialMovements]);

  React.useEffect(() => {
    if (products.length > 0) setProductsList(products);
  }, [products]);

  React.useEffect(() => {
    if (createOpen) {
      fetchProducts();
    }
  }, [createOpen, fetchProducts]);

  const filteredMovements = React.useMemo(() => {
    return movements.filter((m) => {
      const matchSearch =
        m.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.product_sku?.toLowerCase().includes(search.toLowerCase()) ||
        m.notes?.toLowerCase().includes(search.toLowerCase()) ||
        m.performed_by_username?.toLowerCase().includes(search.toLowerCase());

      const matchType = typeFilter === "ALL" || m.movement_type === typeFilter;

      return matchSearch && matchType;
    });
  }, [movements, search, typeFilter]);

  const totalIn = React.useMemo(
    () =>
      movements
        .filter((m) => m.movement_type === "IN")
        .reduce((acc, curr) => acc + curr.quantity, 0),
    [movements],
  );
  const totalOut = React.useMemo(
    () =>
      movements
        .filter((m) => m.movement_type === "OUT")
        .reduce((acc, curr) => acc + curr.quantity, 0),
    [movements],
  );
  const netStock = totalIn - totalOut;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.product) {
      toast.error("Please select a product");
      return;
    }
    setCreateSubmitting(true);
    try {
      const res = await apiFetch("/api/inventory/movements/", {
        method: "POST",
        body: JSON.stringify({
          product: parseInt(createForm.product, 10),
          movement_type: createForm.movement_type,
          quantity: parseInt(createForm.quantity, 10) || 1,
          notes: createForm.notes,
        }),
      });

      if (res.ok) {
        toast.success(
          `Stock movement (${createForm.movement_type}) recorded successfully!`,
        );
        setCreateOpen(false);
        setCreateForm({
          product: "",
          movement_type: "IN",
          quantity: "1",
          notes: "",
        });
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(formatApiError(errorData, "Failed to record movement"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while recording stock movement");
    } finally {
      setCreateSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Inbound Stock
            </CardDescription>
            <ArrowDownLeftIcon className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              +{totalIn.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Restocked units
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Outbound Stock
            </CardDescription>
            <ArrowUpRightIcon className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              -{totalOut.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dispatched units
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Net Stock Flow
            </CardDescription>
            <TrendingUpIcon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {netStock >= 0
                ? `+${netStock.toLocaleString()}`
                : netStock.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Net inventory change
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Transactions
            </CardDescription>
            <ActivityIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {movements.length.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Audited ledger entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Movements Table Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Stock Movement Ledger
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Complete historical transaction log of inventory inbound
              restocking and outbound dispatches
            </CardDescription>
          </div>
          <CardAction className="flex items-center gap-2">
            {canManageInventory && (
              <Button
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => setCreateOpen(true)}
              >
                <PlusIcon className="size-3.5" />
                Record Movement
              </Button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
            <div className="relative w-full sm:w-80">
              <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search product, SKU, user, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v ?? "ALL")}
            >
              <SelectTrigger className="w-[160px] text-xs h-9">
                <SelectValue placeholder="Movement Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="IN">Stock In (Restock)</SelectItem>
                <SelectItem value="OUT">Stock Out (Dispatch)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loadingMovements ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading stock movements...
            </div>
          ) : filteredMovements.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <ArrowLeftRightIcon className="size-12 text-muted-foreground/30 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                No stock movements found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {search || typeFilter !== "ALL"
                  ? "No transactions match your current search criteria."
                  : "Log inventory changes using the Record Movement button."}
              </p>
              <Button
                size="sm"
                className="mt-4 text-xs gap-1.5"
                onClick={() => setCreateOpen(true)}
              >
                <PlusIcon className="size-3.5" />
                Record Movement
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[160px] pl-6 text-xs font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Product & SKU
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Quantity
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Performed By
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Timestamp
                    </TableHead>
                    <TableHead className="text-xs font-semibold pr-6">
                      Notes / Reference
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((m) => {
                    const isIn = m.movement_type === "IN";
                    const dateStr = new Date(m.timestamp).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );

                    return (
                      <TableRow
                        key={m.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="pl-6">
                          <Badge
                            variant="outline"
                            className={
                              isIn
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1 text-xs"
                                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 gap-1 text-xs"
                            }
                          >
                            {isIn ? (
                              <ArrowDownLeftIcon className="size-3 text-emerald-600" />
                            ) : (
                              <ArrowUpRightIcon className="size-3 text-rose-600" />
                            )}
                            {isIn ? "Stock In" : "Stock Out"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-foreground">
                              {m.product_name || `Product #${m.product}`}
                            </span>
                            {m.product_sku && (
                              <span className="text-xs text-muted-foreground font-mono">
                                {m.product_sku}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-sm tabular-nums">
                          <span
                            className={
                              isIn
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-foreground"
                            }
                          >
                            {isIn
                              ? `+${m.quantity.toLocaleString()}`
                              : `-${m.quantity.toLocaleString()}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <UserIcon className="size-3.5" />
                            <span>{m.performed_by_username || "System"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ClockIcon className="size-3.5" />
                            <span>{dateStr}</span>
                          </div>
                        </TableCell>
                        <TableCell className="pr-6 text-xs text-muted-foreground max-w-xs truncate">
                          {m.notes || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {movementCount > 0 && (
            <div className="flex items-center justify-between border-t px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous page"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1 || loadingMovements}
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Next page"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page === totalPages || loadingMovements}
                >
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RECORD MOVEMENT DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Record Stock Movement
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select product and log inventory addition or dispatch with live
              validation.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleCreateSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">
                Select Product <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={createForm.product}
                onValueChange={(val) =>
                  setCreateForm({ ...createForm, product: val ?? "" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose product..." />
                </SelectTrigger>
                <SelectContent>
                  {productsList.length === 0 ? (
                    <div className="p-3 text-center flex flex-col items-center gap-1.5">
                      <p className="text-xs text-muted-foreground">
                        No products available
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-6 text-xs px-2"
                        onClick={() => openQuickCreate("product")}
                      >
                        + Add Product
                      </Button>
                    </div>
                  ) : (
                    productsList.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name} {p.sku ? `(${p.sku})` : ""}{" "}
                        {typeof p.quantity_in_stock === "number"
                          ? `— Stock: ${p.quantity_in_stock}`
                          : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">
                  Movement Type <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={createForm.movement_type}
                  onValueChange={(val) =>
                    setCreateForm({ ...createForm, movement_type: val ?? "IN" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Stock In (Restock)</SelectItem>
                    <SelectItem value="OUT">Stock Out (Dispatch)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cm-qty" className="text-xs font-medium">
                  Quantity <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="cm-qty"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={createForm.quantity}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, quantity: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cm-notes" className="text-xs font-medium">
                Notes / Reference
              </Label>
              <Input
                id="cm-notes"
                placeholder="e.g. PO #1089 restocking / Client shipment"
                value={createForm.notes}
                onChange={(e) =>
                  setCreateForm({ ...createForm, notes: e.target.value })
                }
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={createSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSubmitting}>
                {createSubmitting && (
                  <Loader2Icon className="size-4 animate-spin mr-1" />
                )}
                Record Movement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
