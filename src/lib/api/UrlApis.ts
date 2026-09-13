import { APIResponse, editActions, UrlItem } from "../types";
import { apiClient } from "./client";

export default {
  createShortUrl: async ({
    title,
    url,
    expiryDate,
  }: {
    title: string;
    url: string;
    expiryDate: Date | null;
  }) => {
    const res: APIResponse<UrlItem> = await apiClient("/api/url/create", {
      method: "POST",
      data: JSON.stringify({ title, longUrl: url, expires: expiryDate }),
    });

    return res;
  },

  fetchAllUrls: async () => {
    const response: APIResponse<UrlItem[]> = await apiClient("/api/url/all", {
      method: "GET",
    });

    return response.data;
  },

  fetchUrlById: async (url_id: number) => {
    const res: APIResponse<UrlItem> = await apiClient("/api/url/" + url_id, {
      method: "GET",
    });

    return res;
  },

  editUrlData: async (
    urlId?: number,
    editAction?: editActions,
    dataToUpdate?: any,
  ) => {
    const res: APIResponse<UrlItem> = await apiClient("/api/url/" + urlId, {
      method: "PUT",
      data: { editAction: editAction, ...dataToUpdate },
    });

    return res;
  },

  deleteUrl: async (urlId?: number) => {
    const res: APIResponse<null> = await apiClient("/api/url/" + urlId, {
      method: "DELETE",
    });

    return res;
  },
};
