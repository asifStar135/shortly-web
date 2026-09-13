"use client";

import { SubmitEvent, useEffect, useState } from "react";
import userApis from "@/lib/api/userApis";
import { useAuthStore } from "@/store/authStore";
import { redirect, useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-error";
import { toast } from "sonner";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoading, loading, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    toast.promise(userApis.loginUser({ username, password }), {
      loading: "Welcome back! Just a moment...",
      error: (error: ApiError) => {
        return error.message;
      },
      success: (data) => {
        setTimeout(() => {
          redirect("/home");
        }, 300);
        return data.message;
      },
      finally: () => setLoading(false),
    });
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, loading]);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <a
              href="/forgot-password"
              className="text-xs text-zinc-500 underline underline-offset-4 hover:text-zinc-950"
            >
              Forgot password?
            </a>
          </div>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950"
          />
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-lg bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Login →
        </button>
      </div>

      <div className="mt-6 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-medium text-zinc-950 underline underline-offset-4"
        >
          Sign up
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
