import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { QuickCreateDrawer } from "@/components/quick-create-drawer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QuickCreateProvider } from "@/context/quick-create-context";
import { type UserRole, UserRoleProvider } from "@/context/user-role-context";
import { fetchWithAuth } from "@/lib/api";

async function getUser() {
  try {
    const res = await fetchWithAuth("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to load user data", err);
  }
  return null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <UserRoleProvider role={user.role as UserRole}>
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
        </SidebarProvider>
      </QuickCreateProvider>
    </UserRoleProvider>
  );
}
