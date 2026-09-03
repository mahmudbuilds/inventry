import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { fetchWithAuth } from "@/lib/api";
import { type ManagedUser, UsersClient } from "./users-client";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let currentUser = null;
  let users: ManagedUser[] = [];

  const meRes = await fetchWithAuth("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
  }).catch(() => null);

  if (!meRes || !meRes.ok) {
    redirect("/login");
  }

  currentUser = await meRes.json().catch(() => null);
  if (!currentUser || currentUser.role !== "Admin") {
    redirect("/");
  }

  try {
    const usersRes = await fetchWithAuth("/api/auth/users/", {
      credentials: "include",
      cache: "no-store",
    });

    if (usersRes.ok) {
      users = await usersRes.json();
    }
  } catch (err) {
    console.error("Failed to load users", err);
  }

  return (
    <SidebarInset>
      <SiteHeader title="User Management" />
      <div className="flex flex-1 flex-col py-6">
        <UsersClient
          initialUsers={users}
          currentUserId={currentUser?.id || 0}
        />
      </div>
    </SidebarInset>
  );
}
