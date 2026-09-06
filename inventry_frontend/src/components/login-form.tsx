"use client";

import {
  AlertCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  SparklesIcon,
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
            `Server error (${response.status}). Please verify that your backend server is running and reachable.`,
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
      {/* Command Center Card Frame matching Landing Page Showcase */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white shadow-2xl shadow-indigo-950/10 backdrop-blur-xl overflow-hidden">
        {/* Window Header Bar with Traffic Lights */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-50/80 border-b border-zinc-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="size-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="size-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="ml-3 font-semibold text-zinc-700 font-sans">
              Inventry Cloud Auth
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold font-mono">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping inline-block mr-0.5" />
            <span>TLS 1.3 SECURE</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-7 sm:p-9">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-3.5 py-1 text-xs font-medium text-indigo-900 shadow-2xs mb-4">
            <span className="flex size-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>Console Access</span>
            <SparklesIcon className="size-3.5 text-indigo-600 ml-0.5" />
          </div>

          {/* Heading with Serif Italic Accent */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight font-sans">
            Welcome back to{" "}
            <span className="text-indigo-600 font-serif italic">Inventry.</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
            Enter your credentials to access your real-time warehouse dashboard.
          </p>

          {/* Error Notification */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-2xl bg-rose-50 border border-rose-200/80 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <AlertCircleIcon className="size-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
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
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/60 hover:bg-zinc-50/90 focus:bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-zinc-700 tracking-wide font-sans"
                >
                  Password
                </label>
              </div>
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
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-50/60 hover:bg-zinc-50/90 focus:bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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

            {/* Submit Action Button matching Landing Page primary CTA */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Console</span>
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Need to create an organization?{" "}
              <Link
                href="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-colors"
              >
                Create company workspace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
