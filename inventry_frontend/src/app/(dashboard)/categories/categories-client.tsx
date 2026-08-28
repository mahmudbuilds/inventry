"use client";

import {
  BoxesIcon,
  LayersIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TagsIcon,
  Trash2Icon,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserRole } from "@/context/user-role-context";
import { apiFetch, formatApiError } from "@/lib/api-client";

export interface CategoryItem {
  id: number;
  name: string;
  description?: string;
  product_count?: number;
  total_stock?: number;
  average_price?: number;
}

export function CategoriesClient({
  initialCategories = [],
}: {
  initialCategories: CategoryItem[];
}) {
  const router = useRouter();
  const { canManageInventory, canDeleteInventory } = useUserRole();
  const [categories, setCategories] =
    React.useState<CategoryItem[]>(initialCategories);
  const [search, setSearch] = React.useState("");

  // Create Modal
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createSubmitting, setCreateSubmitting] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    name: "",
    description: "",
  });

  // Edit Modal
  const [editCategory, setEditCategory] = React.useState<CategoryItem | null>(
    null,
  );
  const [editOpen, setEditOpen] = React.useState(false);
  const [editSubmitting, setEditSubmitting] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ name: "", description: "" });

  // Delete Modal
  const [deleteCategory, setDeleteCategory] =
    React.useState<CategoryItem | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = React.useState(false);

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const filteredCategories = React.useMemo(() => {
    return categories.filter((c) => {
      return (
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [categories, search]);

  const totalProducts = React.useMemo(
    () => categories.reduce((acc, curr) => acc + (curr.product_count || 0), 0),
    [categories],
  );
  const totalStockUnits = React.useMemo(
    () => categories.reduce((acc, curr) => acc + (curr.total_stock || 0), 0),
    [categories],
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const res = await apiFetch("/api/inventory/categories/", {
        method: "POST",
        body: JSON.stringify(createForm),
      });

      if (res.ok) {
        toast.success(`Category "${createForm.name}" created successfully!`);
        setCreateOpen(false);
        setCreateForm({ name: "", description: "" });
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(formatApiError(errorData, "Failed to create category"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while creating category");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEdit = (cat: CategoryItem) => {
    setEditCategory(cat);
    setEditForm({ name: cat.name, description: cat.description || "" });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory) return;
    setEditSubmitting(true);
    try {
      const res = await apiFetch(
        `/api/inventory/categories/${editCategory.id}/`,
        {
          method: "PUT",
          body: JSON.stringify(editForm),
        },
      );

      if (res.ok) {
        toast.success(`Category "${editForm.name}" updated successfully!`);
        setEditOpen(false);
        router.refresh();
      } else {
        const errJson = await res.json();
        toast.error(formatApiError(errJson, "Failed to update category"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while updating category");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteCategory) return;
    setDeleteSubmitting(true);
    try {
      const res = await apiFetch(
        `/api/inventory/categories/${deleteCategory.id}/`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        toast.success(
          `Category "${deleteCategory.name}" deleted successfully!`,
        );
        setDeleteOpen(false);
        router.refresh();
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(formatApiError(errJson, "Failed to delete category"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while deleting category");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Categories
            </CardDescription>
            <TagsIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Organized taxonomy
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total SKU Items
            </CardDescription>
            <BoxesIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Assigned products
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
              In stock across all categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Category Directory
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Create and manage product groupings, inventory counts, and average
              valuations
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
                Add Category
              </Button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="relative w-full sm:w-80 mb-4">
            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>

          {filteredCategories.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <TagsIcon className="size-12 text-muted-foreground/30 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                No categories found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {search
                  ? "No categories match your search term."
                  : "Organize your inventory by creating your first category."}
              </p>
              {canManageInventory && (
                <Button
                  size="sm"
                  className="mt-4 text-xs gap-1.5"
                  onClick={() => setCreateOpen(true)}
                >
                  <PlusIcon className="size-3.5" />
                  Add Category
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[240px] pl-6 text-xs font-semibold">
                      Category Name
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
                    <TableHead className="text-xs font-semibold text-right pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((c) => {
                    const avgPrice = c.average_price || 0;

                    return (
                      <TableRow
                        key={c.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="pl-6 font-semibold text-sm text-foreground">
                          {c.name}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-md truncate">
                          {c.description || "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs tabular-nums">
                          <Badge
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            {c.product_count || 0} Products
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm tabular-nums text-foreground">
                          {(c.total_stock || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs tabular-nums text-muted-foreground">
                          ${avgPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right pr-6">
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
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuLabel className="text-xs">
                                Options
                              </DropdownMenuLabel>
                              {canManageInventory && (
                                <DropdownMenuItem
                                  className="text-xs gap-2 cursor-pointer"
                                  onClick={() => openEdit(c)}
                                >
                                  <PencilIcon className="size-3.5 text-muted-foreground" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {canDeleteInventory && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-xs gap-2 text-rose-600 focus:text-rose-600 cursor-pointer"
                                    onClick={() => {
                                      setDeleteCategory(c);
                                      setDeleteOpen(true);
                                    }}
                                  >
                                    <Trash2Icon className="size-3.5" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* CREATE CATEGORY DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add New Category
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a category to organize items and track inventory
              aggregates.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleCreateSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-name" className="text-xs font-medium">
                Category Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="c-name"
                placeholder="e.g. Ergonomic Furniture"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-desc" className="text-xs font-medium">
                Description (Optional)
              </Label>
              <Input
                id="c-desc"
                placeholder="Brief summary of items in this category..."
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
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
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT CATEGORY DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Edit Category
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update category name and descriptive details.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-name" className="text-xs font-medium">
                Category Name <span className="text-rose-500">*</span>
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-desc" className="text-xs font-medium">
                Description (Optional)
              </Label>
              <Input
                id="e-desc"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
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

      {/* DELETE CATEGORY DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-rose-600">
              Delete Category
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{deleteCategory?.name}"
              </span>
              ? Associated products may need to be recategorized.
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
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
