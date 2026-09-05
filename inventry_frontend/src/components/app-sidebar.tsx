"use client";

import {
  ArrowLeftRightIcon,
  BoxesIcon,
  ChartNoAxesCombinedIcon,
  LayoutDashboardIcon,
  RefreshCwIcon,
  TagsIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserCogIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import logo from "@/assets/logo.png";
import { NavAnalytics } from "@/components/nav-analytics";
import { NavMain } from "@/components/nav-main";
import { NavManage } from "@/components/nav-manage";
import { NavUser, type UserType } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
  ],
  manage: [
    { name: "Categories", url: "/categories", icon: <TagsIcon /> },
    { name: "Suppliers", url: "/suppliers", icon: <TruckIcon /> },
    { name: "Products", url: "/products", icon: <BoxesIcon /> },
    { name: "Movements", url: "/movements", icon: <ArrowLeftRightIcon /> },
  ],
  analytics: [
    {
      name: "Low Stock Analytics",
      url: "/analytics/low-stock",
      icon: <TriangleAlertIcon />,
    },
    {
      name: "Stock Turnover",
      url: "/analytics/stock-turnover",
      icon: <RefreshCwIcon />,
    },
    {
      name: "Category Summary",
      url: "/analytics/category-summary",
      icon: <ChartNoAxesCombinedIcon />,
    },
    {
      name: "Movement Summary",
      url: "/analytics/movement-summary",
      icon: <ArrowLeftRightIcon />,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserType | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const isAdmin = user?.role === "Admin";

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5 py-5!"
              render={<Link href="/dashboard" />}
            >
              <Image src={logo} alt="Inventry Logo" height={26} width={26} />
              <div className="flex flex-col">
                <span className="text-base font-semibold">Inventry</span>
                {user?.company && (
                  <span className="text-xs text-foreground/70 truncate">
                    {user.company.name}
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavManage items={data.manage} />
        <NavAnalytics items={data.analytics} />

        {isAdmin && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/users"}
                  render={<Link href="/users" />}
                >
                  <UserCogIcon />
                  <span>User Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
