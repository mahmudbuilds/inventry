"use client";

import { useState } from "react";
import { PasswordChangeDialog } from "@/components/password-change-dialog";
import { AppSidebar } from "@/components/app-sidebar";
import { QuickCreateDrawer } from "@/components/quick-create-drawer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QuickCreateProvider } from "@/context/quick-create-context";
import { type UserRole, UserRoleProvider } from "@/context/user-role-context";

export interface DashboardLayoutClientProps {
  user: any;
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  user,
  children,
}: DashboardLayoutClientProps) {
  const [showPasswordChange, setShowPasswordChange] = useState(
    user?.password_change_required || false,
  );

  return (
    <UserRoleProvider role={user?.role as UserRole}>
      <QuickCreateProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" user={user} />
          {children}
          <QuickCreateDrawer />
          <PasswordChangeDialog
            open={showPasswordChange}
            onOpenChange={setShowPasswordChange}
            onSuccess={() => setShowPasswordChange(false)}
          />
        </SidebarProvider>
      </QuickCreateProvider>
    </UserRoleProvider>
  );
}
