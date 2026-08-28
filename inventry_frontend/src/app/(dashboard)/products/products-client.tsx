"use client";

import {
  AlertTriangleIcon,
  ArrowLeftRightIcon,
  BoxesIcon,
  CheckCircle2Icon,
  Loader2Icon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  XCircleIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useQuickCreate } from "@/context/quick-create-context";
import { useUserRole } from "@/context/user-role-context";
import { apiFetch, formatApiError } from "@/lib/api-client";

export interface ProductItem {
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
  created_at: string;
  updated_at: string;
}

export interface OptionItem {
  id: number;
  name: string;
}

export function ProductsClient({
  initialProducts = [],
  categories = [],
  suppliers = [],
}: {
  initialProducts: ProductItem[];
  categories: OptionItem[];
  suppliers: OptionItem[];
}) {
  const router = useRouter();
  const { open: openQuickCreate } = useQuickCreate();
  const { canManageInventory, canDeleteInventory } = useUserRole();

  const [products, setProducts] =
    React.useState<ProductItem[]>(initialProducts);
  const [categoriesList, setCategoriesList] =
    React.useState<OptionItem[]>(categories);
  const [suppliersList, setSuppliersList] =
    React.useState<OptionItem[]>(suppliers);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [stockStatusFilter, setStockStatusFilter] = React.useState("ALL");

  const fetchOptions = React.useCallback(async () => {
    try {
      const [catsRes, supsRes] = await Promise.all([
        apiFetch("/api/inventory/categories/"),
        apiFetch("/api/inventory/suppliers/"),
      ]);
      if (catsRes.ok) {
        const catData = await catsRes.json();
        setCategoriesList(
          Array.isArray(catData) ? catData : catData.results || [],
        );
      }
      if (supsRes.ok) {
        const supData = await supsRes.json();
        setSuppliersList(
          Array.isArray(supData) ? supData : supData.results || [],
        );
      }
    } catch (err) {
      console.error("Failed to refresh options in products client", err);
    }
  }, []);

  React.useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Create Product Dialog State
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createSubmitting, setCreateSubmitting] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    unit_price: "",
    reorder_level: "10",
    initial_stock: "0",
  });

  // Edit Product Dialog State
  const [editProduct, setEditProduct] = React.useState<ProductItem | null>(
    null,
  );
  const [editOpen, setEditOpen] = React.useState(false);
  const [editSubmitting, setEditSubmitting] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    unit_price: "",
    reorder_level: "10",
  });

  // Delete Dialog State
  const [deleteProduct, setDeleteProduct] = React.useState<ProductItem | null>(
    null,
  );
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = React.useState(false);

  // Quick Movement Dialog State for row
  const [movementProduct, setMovementProduct] =
    React.useState<ProductItem | null>(null);
  const [movementOpen, setMovementOpen] = React.useState(false);
  const [movementSubmitting, setMovementSubmitting] = React.useState(false);
  const [movementForm, setMovementForm] = React.useState({
    movement_type: "IN",
    quantity: "10",
    notes: "",
  });

  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  React.useEffect(() => {
    if (categories.length > 0) setCategoriesList(categories);
  }, [categories]);

  React.useEffect(() => {
    if (suppliers.length > 0) setSuppliersList(suppliers);
  }, [suppliers]);

  React.useEffect(() => {
    if (createOpen || editOpen) {
      fetchOptions();
    }
  }, [createOpen, editOpen, fetchOptions]);

  // Filtered products list
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());

      const matchesCat =
        selectedCategory === "ALL" || String(p.category) === selectedCategory;

      let matchesStock = true;
      if (stockStatusFilter === "LOW") {
        matchesStock =
          p.quantity_in_stock <= p.reorder_level && p.quantity_in_stock > 0;
      } else if (stockStatusFilter === "OUT") {
        matchesStock = p.quantity_in_stock <= 0;
      } else if (stockStatusFilter === "OK") {
        matchesStock = p.quantity_in_stock > p.reorder_level;
      }

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, search, selectedCategory, stockStatusFilter]);

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.category) {
      toast.error("Please select a category");
      return;
    }
    setCreateSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: createForm.name,
        sku: createForm.sku,
        category: parseInt(createForm.category, 10),
        unit_price: parseFloat(createForm.unit_price) || 0,
        reorder_level: parseInt(createForm.reorder_level, 10) || 0,
        initial_stock: parseInt(createForm.initial_stock, 10) || 0,
      };
      if (createForm.supplier) {
        payload.supplier = parseInt(createForm.supplier, 10);
      }

      const res = await apiFetch("/api/inventory/products/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Product "${createForm.name}" created successfully!`);
        setCreateOpen(false);
        setCreateForm({
          name: "",
          sku: "",
          category: "",
          supplier: "",
          unit_price: "",
          reorder_level: "10",
          initial_stock: "0",
        });
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(formatApiError(errorData, "Failed to create product"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while creating product");
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Open Edit Form
  const openEdit = (product: ProductItem) => {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      sku: product.sku,
      category: String(product.category),
      supplier: product.supplier ? String(product.supplier) : "",
      unit_price: String(product.unit_price),
      reorder_level: String(product.reorder_level),
    });
    setEditOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setEditSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: editForm.name,
        sku: editForm.sku,
        category: parseInt(editForm.category, 10),
        unit_price: parseFloat(editForm.unit_price) || 0,
        reorder_level: parseInt(editForm.reorder_level, 10) || 0,
      };
      if (editForm.supplier) {
        payload.supplier = parseInt(editForm.supplier, 10);
      } else {
        payload.supplier = null;
      }

      const res = await apiFetch(`/api/inventory/products/${editProduct.id}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Product "${editForm.name}" updated successfully!`);
        setEditOpen(false);
        router.refresh();
      } else {
        const errJson = await res.json();
        toast.error(formatApiError(errJson, "Failed to update product"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while updating product");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Handle Delete Submit
  const handleDeleteSubmit = async () => {
    if (!deleteProduct) return;
    setDeleteSubmitting(true);
    try {
      const res = await apiFetch(
        `/api/inventory/products/${deleteProduct.id}/`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        toast.success(`Product "${deleteProduct.name}" deleted successfully!`);
        setDeleteOpen(false);
        router.refresh();
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(formatApiError(errJson, "Failed to delete product"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while deleting product");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Handle Quick Movement Submit
  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementProduct) return;
    setMovementSubmitting(true);
    try {
      const res = await apiFetch("/api/inventory/movements/", {
        method: "POST",
        body: JSON.stringify({
          product: movementProduct.id,
          movement_type: movementForm.movement_type,
          quantity: parseInt(movementForm.quantity, 10) || 1,
          notes: movementForm.notes,
        }),
      });

      if (res.ok) {
        toast.success(`Stock movement recorded for ${movementProduct.name}!`);
        setMovementOpen(false);
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(formatApiError(errorData, "Failed to record movement"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while recording movement");
    } finally {
      setMovementSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Header & Controls */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Products Inventory
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Manage items, SKUs, inventory thresholds, and supplier
              associations
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
                Add Product
              </Button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
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
                  {categoriesList.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={stockStatusFilter}
                onValueChange={(v) => setStockStatusFilter(v ?? "ALL")}
              >
                <SelectTrigger className="w-[150px] text-xs h-9">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="OK">Healthy Stock</SelectItem>
                  <SelectItem value="LOW">Low Stock</SelectItem>
                  <SelectItem value="OUT">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="px-0 py-0">
          {filteredProducts.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <BoxesIcon className="size-12 text-muted-foreground/30 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                No products found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {search ||
                selectedCategory !== "ALL" ||
                stockStatusFilter !== "ALL"
                  ? "No products match your active search filters."
                  : "Start by creating your first product item."}
              </p>
              {canManageInventory && (
                <Button
                  size="sm"
                  className="mt-4 text-xs gap-1.5"
                  onClick={() => setCreateOpen(true)}
                >
                  <PlusIcon className="size-3.5" />
                  Add Product
                </Button>
              )}
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
                      Unit Price
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Stock Level
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => {
                    const isOut = p.quantity_in_stock <= 0;
                    const isLow =
                      !isOut && p.quantity_in_stock <= p.reorder_level;
                    const priceNum =
                      typeof p.unit_price === "number"
                        ? p.unit_price
                        : parseFloat(p.unit_price) || 0;

                    return (
                      <TableRow
                        key={p.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="pl-6">
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
                            className="text-xs font-normal"
                          >
                            {p.category_name || "Unassigned"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {p.supplier_name || "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs tabular-nums">
                          ${priceNum.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-sm text-foreground">
                              {p.quantity_in_stock.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Min: {p.reorder_level}
                            </span>
                          </div>
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
                          ) : isLow ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 gap-1 text-xs"
                            >
                              <AlertTriangleIcon className="size-3" />
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1 text-xs"
                            >
                              <CheckCircle2Icon className="size-3" />
                              In Stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-1">
                            {canManageInventory && (
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                title="Record In/Out Movement"
                                onClick={() => {
                                  setMovementProduct(p);
                                  setMovementForm({
                                    movement_type: "IN",
                                    quantity: "10",
                                    notes: "",
                                  });
                                  setMovementOpen(true);
                                }}
                              >
                                <ArrowLeftRightIcon className="size-3.5 text-primary" />
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                  >
                                    <MoreVerticalIcon className="size-3.5" />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel className="text-xs">
                                  Options
                                </DropdownMenuLabel>
                                {canManageInventory && (
                                  <>
                                    <DropdownMenuItem
                                      className="text-xs gap-2 cursor-pointer"
                                      onClick={() => openEdit(p)}
                                    >
                                      <PencilIcon className="size-3.5 text-muted-foreground" />
                                      Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-xs gap-2 cursor-pointer"
                                      onClick={() => {
                                        setMovementProduct(p);
                                        setMovementForm({
                                          movement_type: "IN",
                                          quantity: "10",
                                          notes: "",
                                        });
                                        setMovementOpen(true);
                                      }}
                                    >
                                      <ArrowLeftRightIcon className="size-3.5 text-muted-foreground" />
                                      Record Stock
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {canDeleteInventory && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-xs gap-2 text-rose-600 focus:text-rose-600 cursor-pointer"
                                      onClick={() => {
                                        setDeleteProduct(p);
                                        setDeleteOpen(true);
                                      }}
                                    >
                                      <Trash2Icon className="size-3.5" />
                                      Delete Product
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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

      {/* CREATE PRODUCT DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add New Product
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define product SKU, category, supplier, pricing, and initial stock
              units.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleCreateSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-name" className="text-xs font-medium">
                Product Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="c-name"
                placeholder="e.g. Wireless Ergonomic Mouse"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-sku" className="text-xs font-medium">
                  SKU Code <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="c-sku"
                  placeholder="WEM-902"
                  value={createForm.sku}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, sku: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-price" className="text-xs font-medium">
                  Unit Price ($) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="c-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="49.99"
                  value={createForm.unit_price}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, unit_price: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">
                  Category <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={createForm.category}
                  onValueChange={(val) =>
                    setCreateForm({ ...createForm, category: val ?? "" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.length === 0 ? (
                      <div className="p-3 text-center flex flex-col items-center gap-1.5">
                        <p className="text-xs text-muted-foreground">
                          No categories found
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-6 text-xs px-2"
                          onClick={() => openQuickCreate("category")}
                        >
                          + Add Category
                        </Button>
                      </div>
                    ) : (
                      categoriesList.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">
                  Supplier (Optional)
                </Label>
                <Select
                  value={createForm.supplier}
                  onValueChange={(val) =>
                    setCreateForm({ ...createForm, supplier: val ?? "" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None / Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None / Unassigned</SelectItem>
                    {suppliersList.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-stock" className="text-xs font-medium">
                  Initial Stock
                </Label>
                <Input
                  id="c-stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={createForm.initial_stock}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      initial_stock: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-reorder" className="text-xs font-medium">
                  Reorder Alert Level
                </Label>
                <Input
                  id="c-reorder"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={createForm.reorder_level}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      reorder_level: e.target.value,
                    })
                  }
                />
              </div>
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
                Create Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT PRODUCT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Edit Product
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify product specification, category, pricing, or reorder
              threshold.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-name" className="text-xs font-medium">
                Product Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="e-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="e-sku" className="text-xs font-medium">
                  SKU Code <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="e-sku"
                  value={editForm.sku}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sku: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="e-price" className="text-xs font-medium">
                  Unit Price ($) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="e-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.unit_price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, unit_price: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">
                  Category <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={editForm.category}
                  onValueChange={(val) =>
                    setEditForm({ ...editForm, category: val ?? "" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.length === 0 ? (
                      <div className="p-3 text-center flex flex-col items-center gap-1.5">
                        <p className="text-xs text-muted-foreground">
                          No categories found
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-6 text-xs px-2"
                          onClick={() => openQuickCreate("category")}
                        >
                          + Add Category
                        </Button>
                      </div>
                    ) : (
                      categoriesList.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">
                  Supplier (Optional)
                </Label>
                <Select
                  value={editForm.supplier}
                  onValueChange={(val) =>
                    setEditForm({ ...editForm, supplier: val ?? "" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None / Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None / Unassigned</SelectItem>
                    {suppliersList.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-reorder" className="text-xs font-medium">
                Reorder Alert Level
              </Label>
              <Input
                id="e-reorder"
                type="number"
                min="0"
                value={editForm.reorder_level}
                onChange={(e) =>
                  setEditForm({ ...editForm, reorder_level: e.target.value })
                }
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={editSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editSubmitting}>
                {editSubmitting && (
                  <Loader2Icon className="size-4 animate-spin mr-1" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-rose-600">
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{deleteProduct?.name}"
              </span>
              ? This action permanently removes the item and related movement
              histories.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={deleteSubmitting}
            >
              {deleteSubmitting && (
                <Loader2Icon className="size-4 animate-spin mr-1" />
              )}
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QUICK MOVEMENT DIALOG */}
      <Dialog open={movementOpen} onOpenChange={setMovementOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Record Stock Movement
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Log stock change for{" "}
              <span className="font-semibold text-foreground">
                {movementProduct?.name}
              </span>{" "}
              (Current stock: {movementProduct?.quantity_in_stock})
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleMovementSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">Movement Type</Label>
                <Select
                  value={movementForm.movement_type}
                  onValueChange={(val) =>
                    setMovementForm({
                      ...movementForm,
                      movement_type: val ?? "IN",
                    })
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
                <Label htmlFor="m-qty" className="text-xs font-medium">
                  Quantity
                </Label>
                <Input
                  id="m-qty"
                  type="number"
                  min="1"
                  value={movementForm.quantity}
                  onChange={(e) =>
                    setMovementForm({
                      ...movementForm,
                      quantity: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="m-notes" className="text-xs font-medium">
                Notes / Reference
              </Label>
              <Input
                id="m-notes"
                placeholder="e.g. Restock batch #402"
                value={movementForm.notes}
                onChange={(e) =>
                  setMovementForm({ ...movementForm, notes: e.target.value })
                }
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMovementOpen(false)}
                disabled={movementSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={movementSubmitting}>
                {movementSubmitting && (
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
