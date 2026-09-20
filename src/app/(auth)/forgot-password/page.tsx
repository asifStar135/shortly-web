"use client";

import Link from "next/link";
import { ArrowLeft, Mail, LockKeyhole } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import userApis from "@/lib/api/userApis";
import { ApiError } from "@/lib/api-error";
import { redirect } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // false = email step, true = reset password step
  const [isCodeStep, setIsCodeStep] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(userApis.forgotPassword(email), {
      loading: "Please hang on for a moment...",
      success: (res) => {
        setIsCodeStep(true);
        return res.message;
      },
      error: (error: ApiError) => {
        return error.message;
      },
    });
  };

  const handleResetSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    toast.promise(
      userApis.resetPassword({
        email,
        code,
        newPassword,
      }),
      {
        loading: "Resetting your password...",
        success: (res) => {
          setTimeout(() => {
            redirect("/login");
          }, 300);
          return res.message;
        },
        error: (error: ApiError) => {
          return error.message;
        },
      },
    );
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f8f0df]">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#d8cfbd] bg-white/30">
              {isCodeStep ? (
                <LockKeyhole
                  size={22}
                  strokeWidth={1.7}
                  className="text-[#3c2d11]"
                />
              ) : (
                <Mail size={22} strokeWidth={1.7} className="text-[#3c2d11]" />
              )}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              {isCodeStep ? "Reset your password" : "Forgot your password?"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {isCodeStep
                ? `Enter the verification code sent to ${email} and choose a new password.`
                : "No worries. Enter your email and we'll help you get back into your account."}
            </p>
          </div>

          {/* Step 1: Email */}
          {!isCodeStep ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-[#d8cfbd] bg-white/40 px-4 text-sm outline-none transition focus:border-[#3c2d11] focus:bg-white/60"
                />
              </div>

              <button
                type="submit"
                className="h-12 cursor-pointer w-full rounded-xl bg-[#3c2d11] text-sm font-medium text-[#f8f0df] transition hover:opacity-90"
              >
                Send reset code
              </button>
            </form>
          ) : (
            /* Step 2: Code + New Password */
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="code"
                  className="mb-2 block text-sm font-medium"
                >
                  Verification code
                </label>

                <input
                  id="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter the code"
                  autoComplete="one-time-code"
                  className="h-12 w-full rounded-xl border border-[#d8cfbd] bg-white/40 px-4 text-sm tracking-widest outline-none transition focus:border-[#3c2d11] focus:bg-white/60"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  New password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-[#d8cfbd] bg-white/40 px-4 text-sm outline-none transition focus:border-[#3c2d11] focus:bg-white/60"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-[#d8cfbd] bg-white/40 px-4 text-sm outline-none transition focus:border-[#3c2d11] focus:bg-white/60"
                />
              </div>

              <button
                type="submit"
                className="h-12 cursor-pointer w-full rounded-xl bg-[#3c2d11] text-sm font-medium text-[#f8f0df] transition hover:opacity-90"
              >
                Reset password
              </button>
            </form>
          )}

          {/* Back */}
          <div className="mt-8 text-center">
            {isCodeStep ? (
              <button
                type="button"
                onClick={() => setIsCodeStep(false)}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-[#3c2d11]"
              >
                <ArrowLeft size={15} />
                Change email
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#3c2d11]"
              >
                <ArrowLeft size={15} />
                Back to login
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
