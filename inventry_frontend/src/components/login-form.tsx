"use client";

import {
  AlertCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch, formatApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await apiFetch("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      if (response.ok) {
        if (isJson) {
          await response.json();
        }
        router.push("/dashboard");
        router.refresh();
      } else {
        if (isJson) {
          const errorData = await response.json();
          setError(formatApiError(errorData, "Login failed"));
        } else {
          setError(
            "Unable to connect to the service. Please check your internet connection and try again.",
          );
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        `Login failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-7 sm:p-9">
        {/* Header */}
        <div className="mb-6 text-left">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 font-sans">
            Sign in
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-sans">
            Enter your details below to access your account
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-150"
          >
            <AlertCircleIcon className="size-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-zinc-700 tracking-wide font-sans"
            >
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                <UserIcon className="size-4" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johndoe"
                className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-zinc-700 tracking-wide font-sans"
            >
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                <LockIcon className="size-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Switch to Sign Up */}
        <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
