import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "./layout-client";
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
    <DashboardLayoutClient user={user}>
      {children}
    </DashboardLayoutClient>
  );
}
