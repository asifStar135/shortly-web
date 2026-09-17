"use client";

import { useAuthStore } from "@/store/authStore";
import Loading from "../Loading";
import { redirect } from "next/navigation";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isAuthenticated } = useAuthStore();

  if (loading) return <Loading />;

  if (!loading && !isAuthenticated) redirect("/login");

  return children;
}
