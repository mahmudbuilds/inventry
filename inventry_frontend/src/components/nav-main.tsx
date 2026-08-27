"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  PlusIcon,
  BoxesIcon,
  ArrowLeftRightIcon,
  TruckIcon,
  TagsIcon,
  ChevronDownIcon,
} from "lucide-react"
import { useQuickCreate } from "@/context/quick-create-context"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()
  const { open } = useQuickCreate()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-full"
                render={
                  <SidebarMenuButton
                    tooltip="Quick Create"
                    className="w-full justify-between bg-primary font-medium text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                  />
                }
              >
                <div className="flex items-center gap-2">
                  <PlusIcon className="size-4" />
                  <span>Quick Create</span>
                </div>
                <ChevronDownIcon className="size-3.5 opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="bottom" sideOffset={6} className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Create New...
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => open("product")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BoxesIcon className="size-4 text-primary" />
                  <span>Add Product</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => open("movement")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeftRightIcon className="size-4 text-primary" />
                  <span>Stock Movement</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => open("supplier")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <TruckIcon className="size-4 text-primary" />
                  <span>Add Supplier</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => open("category")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <TagsIcon className="size-4 text-primary" />
                  <span>Add Category</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname === item.url}
                render={<Link href={item.url} />}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
