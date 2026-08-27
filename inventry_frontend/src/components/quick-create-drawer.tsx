"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useQuickCreate } from "@/context/quick-create-context";
import { BoxesIcon, ArrowLeftRightIcon, TruckIcon, TagsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QuickCreateDrawer() {
  const { activeType, close, isOpen } = useQuickCreate();

  const getTitleAndDescription = () => {
    switch (activeType) {
      case "product":
        return {
          title: "Add New Product",
          description: "Create a new SKU with category, pricing, and initial stock.",
          icon: <BoxesIcon className="size-5 text-primary" />,
        };
      case "movement":
        return {
          title: "Record Stock Movement",
          description: "Log inward, outward, or adjustment stock transitions.",
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
          description: "Organize products into hierarchical or grouped categories.",
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6">
        <SheetHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            {meta.icon}
            <SheetTitle className="text-lg font-semibold">{meta.title}</SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            {meta.description}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 flex-1 flex flex-col gap-4">
          {activeType === "product" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                close();
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" placeholder="e.g. Ergonomic Office Chair" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="product-sku">SKU / Code</Label>
                  <Input id="product-sku" placeholder="SKU-1029" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="product-price">Price ($)</Label>
                  <Input id="product-price" type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="product-stock">Initial Stock</Label>
                  <Input id="product-stock" type="number" placeholder="0" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="product-min-stock">Min Threshold</Label>
                  <Input id="product-min-stock" type="number" placeholder="5" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-border/60 mt-auto">
                <Button type="button" variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit">Create Product</Button>
              </div>
            </form>
          )}

          {activeType === "movement" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                close();
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="movement-product">Select Product</Label>
                <Input id="movement-product" placeholder="Search product by name or SKU..." required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="movement-type">Type</Label>
                  <Input id="movement-type" placeholder="In / Out / Adjustment" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="movement-qty">Quantity</Label>
                  <Input id="movement-qty" type="number" placeholder="1" required />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="movement-notes">Reason / Reference</Label>
                <Input id="movement-notes" placeholder="e.g. PO #1089 restocking" />
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-border/60 mt-auto">
                <Button type="button" variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit">Record Movement</Button>
              </div>
            </form>
          )}

          {activeType === "supplier" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                close();
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="supplier-name">Supplier Name</Label>
                <Input id="supplier-name" placeholder="e.g. Acme Supplies Ltd" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="supplier-email">Email Address</Label>
                <Input id="supplier-email" type="email" placeholder="orders@acme.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="supplier-phone">Phone Number</Label>
                <Input id="supplier-phone" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-border/60 mt-auto">
                <Button type="button" variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit">Add Supplier</Button>
              </div>
            </form>
          )}

          {activeType === "category" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                close();
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-name">Category Name</Label>
                <Input id="category-name" placeholder="e.g. Office Supplies" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-desc">Description (Optional)</Label>
                <Input id="category-desc" placeholder="Brief summary of items in this category..." />
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-border/60 mt-auto">
                <Button type="button" variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit">Add Category</Button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}