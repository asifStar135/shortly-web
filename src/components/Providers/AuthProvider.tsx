"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import userApis from "@/lib/api/userApis";
import { redirect, useRouter } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUser, clearUser, setIsAuthenticated, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    userApis
      .getUserProfile()
      .then((res) => {
        setIsAuthenticated(true);
        setUser(res.data);
      })
      .catch((e) => {
        clearUser();
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [setUser, clearUser]);

  return children;
}
