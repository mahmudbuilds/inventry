"use client";

import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { apiFetch, formatApiError } from "@/lib/api-client";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await apiFetch("/api/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          company_name: companyName,
          username,
          email,
          password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      if (!response.ok) {
        if (isJson) {
          const errorData = await response.json();
          setError(formatApiError(errorData, "Registration failed"));
        } else {
          setError(
            `Server error (${response.status}). Please verify that your backend server is running and reachable.`
          );
        }
      } else {
        if (isJson) {
          await response.json();
        }
        router.push("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(`Registration failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create your company</CardTitle>
        <CardDescription>
          The first account becomes the company superuser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className={`space-y-4 ${error ? "pb-4" : ""}`}
        >
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="company-name">Company name</FieldLabel>
              <Input
                id="company-name"
                type="text"
                placeholder="Acme Inventory"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting && <Loader2Icon className="animate-spin" />}
                  {submitting ? "Creating company..." : "Create Company"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
