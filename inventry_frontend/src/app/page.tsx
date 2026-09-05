import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { fetchWithAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

async function getAuthUser() {
  try {
    const res = await fetchWithAuth("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Unauthenticated or backend unavailable
  }
  return null;
}

export default async function RootPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string; landing?: string }>;
}) {
  const resolvedParams = await searchParams;
  const user = await getAuthUser();

  // If user is authenticated and hasn't explicitly requested the landing preview,
  // redirect directly to the authenticated console:
  if (
    user &&
    resolvedParams.preview !== "true" &&
    resolvedParams.landing !== "true"
  ) {
    redirect("/dashboard");
  }

  return <LandingPage user={user} />;
}
