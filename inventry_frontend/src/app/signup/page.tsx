import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Create Company — Inventry",
  description: "Create your organization account and configure superuser access for Inventry.",
};

export default function SignupPage() {
  return (
    <AuthLayout maxWidthClass="max-w-lg">
      <SignupForm />
    </AuthLayout>
  );
}
