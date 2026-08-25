"use client";

import * as React from "react";

import { NavManage } from "@/components/nav-manage";
import { NavAnalytics } from "@/components/nav-analytics";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
  LayoutGrid,
  UserCheck2Icon,
  User,
  TagsIcon,
  TruckIcon,
  BoxesIcon,
  ArrowLeftRightIcon,
  TriangleAlertIcon,
  RefreshCwIcon,
  ChartNoAxesCombinedIcon,
} from "lucide-react";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    role: "admin",
    email: "shadcn@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <CameraIcon />,
      isActive: true,
      url: "/capture",
      items: [
        {
          title: "Active Proposals",
          url: "/capture/active",
        },
        {
          title: "Archived",
          url: "/capture/archived",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <FileTextIcon />,
      url: "/proposals",
      items: [
        {
          title: "Active Proposals",
          url: "/proposals/active",
        },
        {
          title: "Archived",
          url: "/proposals/archived",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <FileTextIcon />,
      url: "/prompts",
      items: [
        {
          title: "Active Proposals",
          url: "/prompts/active",
        },
        {
          title: "Archived",
          url: "/prompts/archived",
        },
      ],
    },
  ],
  
  manage: [
    {
      name: "Categories",
      url: "/categories",
      icon: <TagsIcon />,
    },
    {
      name: "Suppliers",
      url: "/suppliers",
      icon: <TruckIcon />,
    },
    {
      name: "Products",
      url: "/products",
      icon: <BoxesIcon />,
    },
    {
      name: "Movements",
      url: "/movements",
      icon: <ArrowLeftRightIcon />,
    },
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
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <Image src={logo} alt="logo-img" height="26" width="26"></Image>
              <span className="text-base font-semibold">Inventry</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavManage items={data.manage} />
        <NavAnalytics items={data.analytics} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
