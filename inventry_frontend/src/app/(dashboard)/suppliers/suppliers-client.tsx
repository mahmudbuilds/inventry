"use client";

import {
  BoxesIcon,
  Loader2Icon,
  MailIcon,
  MoreVerticalIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  TruckIcon,
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

export interface SupplierItem {
  id: number;
  name: string;
  contact_email: string;
  phone: string;
  product_count?: number;
}

export function SuppliersClient({
  initialSuppliers = [],
}: {
  initialSuppliers: SupplierItem[];
}) {
  const router = useRouter();
  const { canManageInventory, canDeleteInventory } = useUserRole();
  const [suppliers, setSuppliers] =
    React.useState<SupplierItem[]>(initialSuppliers);
  const [search, setSearch] = React.useState("");

  // Create Dialog
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createSubmitting, setCreateSubmitting] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    name: "",
    contact_email: "",
    phone: "",
  });

  // Edit Dialog
  const [editSupplier, setEditSupplier] = React.useState<SupplierItem | null>(
    null,
  );
  const [editOpen, setEditOpen] = React.useState(false);
  const [editSubmitting, setEditSubmitting] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: "",
    contact_email: "",
    phone: "",
  });

  // Delete Dialog
  const [deleteSupplier, setDeleteSupplier] =
    React.useState<SupplierItem | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = React.useState(false);

  React.useEffect(() => {
    setSuppliers(initialSuppliers);
  }, [initialSuppliers]);

  const filteredSuppliers = React.useMemo(() => {
    return suppliers.filter((s) => {
      return (
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contact_email.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [suppliers, search]);

  const totalProductsSupplied = React.useMemo(
    () => suppliers.reduce((acc, curr) => acc + (curr.product_count || 0), 0),
    [suppliers],
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const res = await apiFetch("/api/inventory/suppliers/", {
        method: "POST",
        body: JSON.stringify(createForm),
      });

      if (res.ok) {
        toast.success(`Supplier "${createForm.name}" created successfully!`);
        setCreateOpen(false);
        setCreateForm({ name: "", contact_email: "", phone: "" });
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(formatApiError(errorData, "Failed to create supplier"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while creating supplier");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEdit = (sup: SupplierItem) => {
    setEditSupplier(sup);
    setEditForm({
      name: sup.name,
      contact_email: sup.contact_email,
      phone: sup.phone,
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSupplier) return;
    setEditSubmitting(true);
    try {
      const res = await apiFetch(
        `/api/inventory/suppliers/${editSupplier.id}/`,
        {
          method: "PUT",
          body: JSON.stringify(editForm),
        },
      );

      if (res.ok) {
        toast.success(`Supplier "${editForm.name}" updated successfully!`);
        setEditOpen(false);
        router.refresh();
      } else {
        const errJson = await res.json();
        toast.error(formatApiError(errJson, "Failed to update supplier"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while updating supplier");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteSupplier) return;
    setDeleteSubmitting(true);
    try {
      const res = await apiFetch(
        `/api/inventory/suppliers/${deleteSupplier.id}/`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        toast.success(
          `Supplier "${deleteSupplier.name}" deleted successfully!`,
        );
        setDeleteOpen(false);
        router.refresh();
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(formatApiError(errJson, "Failed to delete supplier"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while deleting supplier");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Registered Suppliers
            </CardDescription>
            <TruckIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active vendor network
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Supplied SKUs
            </CardDescription>
            <BoxesIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProductsSupplied.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total items mapped to vendors
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Communication Directory
            </CardDescription>
            <MailIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Direct email & phone contacts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Table Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Suppliers & Vendors
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Maintain supplier directory, contact credentials, and procurement
              links
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
                Add Supplier
              </Button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="relative w-full sm:w-80 mb-4">
            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>

          {filteredSuppliers.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <TruckIcon className="size-12 text-muted-foreground/30 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                No suppliers found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {search
                  ? "No suppliers match your search term."
                  : "Register your vendor partners to link them with products."}
              </p>
              {canManageInventory && (
                <Button
                  size="sm"
                  className="mt-4 text-xs gap-1.5"
                  onClick={() => setCreateOpen(true)}
                >
                  <PlusIcon className="size-3.5" />
                  Add Supplier
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[260px] pl-6 text-xs font-semibold">
                      Supplier Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Email Address
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Phone Number
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Products Supplied
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((s) => (
                    <TableRow
                      key={s.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="pl-6 font-semibold text-sm text-foreground">
                        {s.name}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${s.contact_email}`}
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                        >
                          <MailIcon className="size-3.5 text-muted-foreground" />
                          {s.contact_email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                          <PhoneIcon className="size-3.5" />
                          {s.phone}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-xs tabular-nums">
                        <Badge
                          variant="secondary"
                          className="font-normal text-xs"
                        >
                          {s.product_count || 0} Products
                        </Badge>
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
                                onClick={() => openEdit(s)}
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
                                    setDeleteSupplier(s);
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE SUPPLIER DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add New Supplier
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register supplier contacts for restocking and purchase orders.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleCreateSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-name" className="text-xs font-medium">
                Supplier Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="s-name"
                placeholder="e.g. Apex Global Logistics"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-email" className="text-xs font-medium">
                Contact Email <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="s-email"
                type="email"
                placeholder="orders@apexlogistics.com"
                value={createForm.contact_email}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    contact_email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-phone" className="text-xs font-medium">
                Phone Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="s-phone"
                placeholder="+1 (555) 234-5678"
                value={createForm.phone}
                onChange={(e) =>
                  setCreateForm({ ...createForm, phone: e.target.value })
                }
                required
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
                Add Supplier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT SUPPLIER DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Edit Supplier
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify vendor contact credentials.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="es-name" className="text-xs font-medium">
                Supplier Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="es-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="es-email" className="text-xs font-medium">
                Contact Email <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="es-email"
                type="email"
                value={editForm.contact_email}
                onChange={(e) =>
                  setEditForm({ ...editForm, contact_email: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="es-phone" className="text-xs font-medium">
                Phone Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="es-phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                required
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

      {/* DELETE SUPPLIER DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-rose-600">
              Delete Supplier
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{deleteSupplier?.name}"
              </span>
              ? Supplier linkage will be removed from associated products.
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
              Delete Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
