"use client";
import { ApiError } from "@/lib/api-error";
import userApis from "@/lib/api/userApis";
import { useAuthStore } from "@/store/authStore";
import { redirect, useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLoading, loading, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    setLoading(true);

    toast.promise(userApis.registerUser({ username, email, password }), {
      loading: "We're saving your details, please wait...",
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
            Choose a username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. asif"
            required
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Enter your email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Create a password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a secure password"
            required
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950"
          />
        </div>

        <button
          type="submit"
          className="h-11 cursor-pointer w-full rounded-lg bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Create my account →
        </button>
      </div>

      <div className="mt-6 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-zinc-950 underline underline-offset-4"
        >
          Login
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;
