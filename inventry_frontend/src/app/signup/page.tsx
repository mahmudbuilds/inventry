import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Create Company — Inventry",
  description: "Create your company account to start tracking stock, products, and orders effortlessly.",
};

export default function SignupPage() {
  return (
    <AuthLayout maxWidthClass="max-w-lg">
      <SignupForm />
    </AuthLayout>
  );
}
