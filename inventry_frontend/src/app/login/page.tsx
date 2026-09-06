import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign In — Inventry",
  description: "Sign in to your Inventry account to manage your stock, products, and orders.",
};

export default function LoginPage() {
  return (
    <AuthLayout maxWidthClass="max-w-md">
      <LoginForm />
    </AuthLayout>
  );
}
