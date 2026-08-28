"use client";

import {
  ArrowLeftRightIcon,
  BoxesIcon,
  Loader2Icon,
  TagsIcon,
  TruckIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuickCreate } from "@/context/quick-create-context";
import { useUserRole } from "@/context/user-role-context";
import { apiFetch, formatApiError } from "@/lib/api-client";

interface OptionItem {
  id: number;
  name: string;
  sku?: string;
}

export function QuickCreateDrawer() {
  const router = useRouter();
  const { activeType, close, isOpen, open: openType } = useQuickCreate();
  const { canManageInventory } = useUserRole();

  const [categories, setCategories] = React.useState<OptionItem[]>([]);
  const [suppliers, setSuppliers] = React.useState<OptionItem[]>([]);
  const [products, setProducts] = React.useState<OptionItem[]>([]);
  const [loadingDependencies, setLoadingDependencies] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Form states
  const [productForm, setProductForm] = React.useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    unit_price: "",
    reorder_level: "10",
    initial_stock: "0",
  });

  const [movementForm, setMovementForm] = React.useState({
    product: "",
    movement_type: "IN",
    quantity: "1",
    notes: "",
  });

  const [supplierForm, setSupplierForm] = React.useState({
    name: "",
    contact_email: "",
    phone: "",
  });

  const [categoryForm, setCategoryForm] = React.useState({
    name: "",
    description: "",
  });

  const fetchDependencies = React.useCallback(async () => {
    setLoadingDependencies(true);
    try {
      const [catsRes, supsRes, prodsRes] = await Promise.all([
        apiFetch("/api/inventory/categories/"),
        apiFetch("/api/inventory/suppliers/"),
        apiFetch("/api/inventory/products/"),
      ]);

      if (catsRes.ok) {
        const catData = await catsRes.json();
        setCategories(Array.isArray(catData) ? catData : catData.results || []);
      }
      if (supsRes.ok) {
        const supData = await supsRes.json();
        setSuppliers(Array.isArray(supData) ? supData : supData.results || []);
      }
      if (prodsRes.ok) {
        const prodData = await prodsRes.json();
        setProducts(
          Array.isArray(prodData) ? prodData : prodData.results || [],
        );
      }
    } catch (err) {
      console.error("Failed to load options for quick create", err);
    } finally {
      setLoadingDependencies(false);
    }
  }, []);

  // Fetch dropdown dependencies when drawer opens or active tab switches
  React.useEffect(() => {
    if (isOpen) {
      fetchDependencies();
    }
  }, [isOpen, activeType, fetchDependencies]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.category) {
      toast.error("Please select a category");
      return;
    }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: productForm.name,
        sku: productForm.sku,
        category: parseInt(productForm.category, 10),
        unit_price: parseFloat(productForm.unit_price) || 0,
        reorder_level: parseInt(productForm.reorder_level, 10) || 0,
        initial_stock: parseInt(productForm.initial_stock, 10) || 0,
      };
      if (productForm.supplier) {
        payload.supplier = parseInt(productForm.supplier, 10);
      }

      const res = await apiFetch("/api/inventory/products/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Product "${productForm.name}" created successfully!`);
        setProductForm({
          name: "",
          sku: "",
          category: "",
          supplier: "",
          unit_price: "",
          reorder_level: "10",
          initial_stock: "0",
        });
        close();
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(formatApiError(errorData, "Failed to create product"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while creating product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementForm.product) {
      toast.error("Please select a product");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/inventory/movements/", {
        method: "POST",
        body: JSON.stringify({
          product: parseInt(movementForm.product, 10),
          movement_type: movementForm.movement_type,
          quantity: parseInt(movementForm.quantity, 10) || 1,
          notes: movementForm.notes,
        }),
      });

      if (res.ok) {
        toast.success(
          `Stock movement (${movementForm.movement_type}) recorded successfully!`,
        );
        setMovementForm({
          product: "",
          movement_type: "IN",
          quantity: "1",
          notes: "",
        });
        close();
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(formatApiError(errorData, "Failed to record movement"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while recording stock movement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/inventory/suppliers/", {
        method: "POST",
        body: JSON.stringify(supplierForm),
      });

      if (res.ok) {
        const supData = await res.json();
        toast.success(`Supplier "${supplierForm.name}" added successfully!`);
        setSupplierForm({ name: "", contact_email: "", phone: "" });
        await fetchDependencies();
        close();
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(formatApiError(errorData, "Failed to add supplier"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while adding supplier");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/inventory/categories/", {
        method: "POST",
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        const catData = await res.json();
        toast.success(`Category "${categoryForm.name}" created successfully!`);
        setCategoryForm({ name: "", description: "" });
        await fetchDependencies();
        close();
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(formatApiError(errorData, "Failed to create category"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while creating category");
    } finally {
      setSubmitting(false);
    }
  };

  const getTitleAndDescription = () => {
    switch (activeType) {
      case "product":
        return {
          title: "Add New Product",
          description:
            "Create a new SKU with category, supplier, pricing, and initial stock.",
          icon: <BoxesIcon className="size-5 text-primary" />,
        };
      case "movement":
        return {
          title: "Record Stock Movement",
          description:
            "Log inward restock or outward dispatch transitions with inventory audit.",
          icon: <ArrowLeftRightIcon className="size-5 text-primary" />,
        };
      case "supplier":
        return {
          title: "Add New Supplier",
          description: "Register vendor contact and supplier information.",
          icon: <TruckIcon className="size-5 text-primary" />,
        };
      case "category":
        return {
          title: "Add New Category",
          description: "Organize products into structured groupings.",
          icon: <TagsIcon className="size-5 text-primary" />,
        };
      default:
        return {
          title: "Quick Create",
          description: "Add an item to your inventory system.",
          icon: null,
        };
    }
  };

  const meta = getTitleAndDescription();

  if (!canManageInventory) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6">
        <SheetHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            {meta.icon}
            <SheetTitle className="text-lg font-semibold">
              {meta.title}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            {meta.description}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 flex-1 flex flex-col gap-4">
          {/* PRODUCT FORM */}
          {activeType === "product" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={handleProductSubmit}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="product-name" className="text-xs font-medium">
                  Product Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="product-name"
                  placeholder="e.g. Ergonomic Office Desk"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="product-sku" className="text-xs font-medium">
                    SKU Code <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="product-sku"
                    placeholder="DSK-1001"
                    value={productForm.sku}
                    onChange={(e) =>
                      setProductForm({ ...productForm, sku: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="product-price"
                    className="text-xs font-medium"
                  >
                    Unit Price ($) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="149.99"
                    value={productForm.unit_price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        unit_price: e.target.value,
                      })
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
                    value={productForm.category}
                    onValueChange={(val) =>
                      setProductForm({ ...productForm, category: val ?? "" })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="p-3 text-center flex flex-col items-center gap-1.5">
                          <p className="text-xs text-muted-foreground">
                            No categories found
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-6 text-xs px-2"
                            onClick={() => openType("category")}
                          >
                            + Add Category
                          </Button>
                        </div>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
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
                    value={productForm.supplier}
                    onValueChange={(val) =>
                      setProductForm({ ...productForm, supplier: val ?? "" })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="None / Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None / Unassigned</SelectItem>
                      {suppliers.map((sup) => (
                        <SelectItem key={sup.id} value={String(sup.id)}>
                          {sup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="product-stock"
                    className="text-xs font-medium"
                  >
                    Initial Stock Qty
                  </Label>
                  <Input
                    id="product-stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={productForm.initial_stock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        initial_stock: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="product-min-stock"
                    className="text-xs font-medium"
                  >
                    Reorder Alert Level
                  </Label>
                  <Input
                    id="product-min-stock"
                    type="number"
                    min="0"
                    placeholder="10"
                    value={productForm.reorder_level}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        reorder_level: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border/60 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={close}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2Icon className="size-4 animate-spin mr-1" />
                  )}
                  Create Product
                </Button>
              </div>
            </form>
          )}

          {/* MOVEMENT FORM */}
          {activeType === "movement" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={handleMovementSubmit}
            >
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">
                  Select Product <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={movementForm.product}
                  onValueChange={(val) =>
                    setMovementForm({ ...movementForm, product: val ?? "" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.length === 0 ? (
                      <div className="p-3 text-center flex flex-col items-center gap-1.5">
                        <p className="text-xs text-muted-foreground">
                          No products available
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-6 text-xs px-2"
                          onClick={() => openType("product")}
                        >
                          + Add Product
                        </Button>
                      </div>
                    ) : (
                      products.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name} {p.sku ? `(${p.sku})` : ""}
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
                    value={movementForm.movement_type}
                    onValueChange={(val) =>
                      setMovementForm({
                        ...movementForm,
                        movement_type: val ?? "IN",
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN">Stock In (Restock)</SelectItem>
                      <SelectItem value="OUT">Stock Out (Dispatch)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="movement-qty" className="text-xs font-medium">
                    Quantity <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="movement-qty"
                    type="number"
                    min="1"
                    placeholder="10"
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
                <Label htmlFor="movement-notes" className="text-xs font-medium">
                  Notes / Reference
                </Label>
                <Input
                  id="movement-notes"
                  placeholder="e.g. PO #1089 restocking / Client sale"
                  value={movementForm.notes}
                  onChange={(e) =>
                    setMovementForm({ ...movementForm, notes: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border/60 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={close}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2Icon className="size-4 animate-spin mr-1" />
                  )}
                  Record Movement
                </Button>
              </div>
            </form>
          )}

          {/* SUPPLIER FORM */}
          {activeType === "supplier" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSupplierSubmit}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="supplier-name" className="text-xs font-medium">
                  Supplier Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="supplier-name"
                  placeholder="e.g. Apex Global Logistics"
                  value={supplierForm.name}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="supplier-email" className="text-xs font-medium">
                  Contact Email <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="supplier-email"
                  type="email"
                  placeholder="sales@apexlogistics.com"
                  value={supplierForm.contact_email}
                  onChange={(e) =>
                    setSupplierForm({
                      ...supplierForm,
                      contact_email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="supplier-phone" className="text-xs font-medium">
                  Phone Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="supplier-phone"
                  placeholder="+1 (555) 234-5678"
                  value={supplierForm.phone}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border/60 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={close}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2Icon className="size-4 animate-spin mr-1" />
                  )}
                  Add Supplier
                </Button>
              </div>
            </form>
          )}

          {/* CATEGORY FORM */}
          {activeType === "category" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={handleCategorySubmit}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-name" className="text-xs font-medium">
                  Category Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="category-name"
                  placeholder="e.g. Office Hardware"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-desc" className="text-xs font-medium">
                  Description (Optional)
                </Label>
                <Input
                  id="category-desc"
                  placeholder="Items related to office hardware, monitors, desks..."
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border/60 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={close}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2Icon className="size-4 animate-spin mr-1" />
                  )}
                  Add Category
                </Button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
