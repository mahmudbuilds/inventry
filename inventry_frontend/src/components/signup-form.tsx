"use client";

import {
  AlertCircleIcon,
  ArrowRightIcon,
  Building2Icon,
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch, formatApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Compute password strength score (0-4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const getStrengthLabel = (score: number) => {
    if (password.length === 0) return "";
    if (score <= 1) return "Weak";
    if (score === 2) return "Fair";
    if (score === 3) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
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
            `Server error (${response.status}). Please verify that your backend server is running and reachable.`,
          );
        }
      } else {
        if (isJson) {
          await response.json();
        }
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        `Registration failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Command Center Card Frame */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white shadow-2xl shadow-indigo-950/10 backdrop-blur-xl overflow-hidden">
        {/* Window Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-50/80 border-b border-zinc-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="size-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="size-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="ml-3 font-semibold text-zinc-700 font-sans">
              Inventry Organization Setup
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold font-mono">
            <span>SUPERUSER SETUP</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-7 sm:p-9">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-3.5 py-1 text-xs font-medium text-indigo-900 shadow-2xs mb-4">
            <span className="flex size-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>Workspace Provisioning</span>
            <SparklesIcon className="size-3.5 text-indigo-600 ml-0.5" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight font-sans">
            Create your company{" "}
            <span className="text-indigo-600 font-serif italic">workspace.</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
            The initial account is provisioned as your organization&apos;s superuser.
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

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="company-name"
                className="block text-xs font-semibold text-zinc-700 tracking-wide font-sans"
              >
                Company Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                  <Building2Icon className="size-4" />
                </div>
                <input
                  id="company-name"
                  name="company-name"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Logistics, Inc."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/60 hover:bg-zinc-50/90 focus:bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Username & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold text-zinc-700 tracking-wide font-sans"
                >
                  Admin Username
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
                    placeholder="johndoe"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/60 hover:bg-zinc-50/90 focus:bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-zinc-700 tracking-wide font-sans"
                >
                  Work Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                    <MailIcon className="size-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@acme.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/60 hover:bg-zinc-50/90 focus:bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-zinc-700 tracking-wide font-sans"
                >
                  Superuser Password
                </label>
                {password.length > 0 && (
                  <span className="text-[11px] font-medium text-zinc-500 font-mono">
                    Strength:{" "}
                    <span
                      className={cn(
                        "font-semibold",
                        strengthScore <= 1 && "text-rose-600",
                        strengthScore === 2 && "text-amber-600",
                        strengthScore === 3 && "text-blue-600",
                        strengthScore >= 4 && "text-emerald-600",
                      )}
                    >
                      {getStrengthLabel(strengthScore)}
                    </span>
                  </span>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                  <LockIcon className="size-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

              {/* Password Strength Meter Bars */}
              {password.length > 0 && (
                <div className="pt-1">
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    <div
                      className={cn(
                        "rounded-full transition-all duration-300",
                        strengthScore >= 1 ? "bg-rose-500" : "bg-zinc-200",
                      )}
                    />
                    <div
                      className={cn(
                        "rounded-full transition-all duration-300",
                        strengthScore >= 2 ? "bg-amber-500" : "bg-zinc-200",
                      )}
                    />
                    <div
                      className={cn(
                        "rounded-full transition-all duration-300",
                        strengthScore >= 3 ? "bg-blue-500" : "bg-zinc-200",
                      )}
                    />
                    <div
                      className={cn(
                        "rounded-full transition-all duration-300",
                        strengthScore >= 4 ? "bg-emerald-500" : "bg-zinc-200",
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-semibold text-zinc-700 tracking-wide font-sans"
                >
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2Icon className="size-3" />
                    <span>Passwords match</span>
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600">
                    <AlertCircleIcon className="size-3" />
                    <span>Passwords do not match</span>
                  </span>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={cn(
                    "w-full pl-10 pr-10 py-2.5 bg-zinc-50/60 hover:bg-zinc-50/90 focus:bg-white border rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:ring-4",
                    passwordsMismatch
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/10",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    <span>Provisioning organization...</span>
                  </>
                ) : (
                  <>
                    <span>Create Company Workspace</span>
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Sign In */}
          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Already have an organization?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-colors"
              >
                Sign in to console
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
