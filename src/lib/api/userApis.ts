import { toast } from "sonner";
import { APIResponse, User } from "../types";
import { apiClient } from "./client";
import { ApiError } from "../api-error";

export default {
  registerUser: async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const res: APIResponse<null> = await apiClient("/api/user/register", {
      method: "POST",
      data: JSON.stringify({ username, email, password }),
    });

    return res;
  },
  loginUser: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const res: APIResponse<null> = await apiClient("/api/user/login", {
      method: "POST",
      data: JSON.stringify({ username, password }),
    });

    return res;
  },
  getUserProfile: async () => {
    const res: APIResponse<User> = await apiClient("/api/user/profile", {
      method: "GET",
    });

    return res;
  },
  updateProfile: async ({
    isUsername,
    username,
    email,
  }: {
    isUsername: boolean;
    username?: string;
    email?: string;
  }) => {
    const res: APIResponse<null> = await apiClient("/api/user/profile", {
      method: "PUT",
      data: JSON.stringify({ isUsername, username, email }),
    });

    return res;
  },

  forgotPassword: async (email: string) => {
    const res: APIResponse<null> = await apiClient(
      "/api/user/forgot-password",
      {
        method: "POST",
        data: JSON.stringify({ email }),
      },
    );

    return res;
  },

  resetPassword: async ({
    code,
    newPassword,
    email,
  }: {
    code: string;
    newPassword: string;
    email: string;
  }) => {
    const res: APIResponse<null> = await apiClient("/api/user/reset-password", {
      method: "POST",
      data: JSON.stringify({ email, code, newPassword }),
    });

    return res;
  },
};
