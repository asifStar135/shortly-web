"use client";

import { getDate, validateUrl } from "@/lib/helpers";
import UrlApis from "@/lib/api/UrlApis";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-error";

export default function CreateUrlForm() {
  const router = useRouter();
  const [title, setTitle] = useState("Untitled url");
  const [url, setUrl] = useState("");
  const [isNever, setIsNever] = useState(true);
  const [expiryDate, setExpiryDate] = useState<Date>(
    new Date(new Date().getFullYear(), 11, 31),
  );

  const { setLoadingData } = useAuthStore();

  const handleUrlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;

    setUrl(textarea.value);

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateUrl(url)) {
      toast.error("Please enter a valid url");
      return;
    }
    setLoadingData(true);

    toast.promise(
      UrlApis.createShortUrl({
        title,
        url,
        expiryDate: expiryDate ? expiryDate : null,
      }),
      {
        loading: "Creating short url...",
        success: (res) => {
          setTimeout(() => {
            router.push(`/my-urls/${res.data?.id}`);
          }, 500);
          return "Short url created successfully";
        },
        error: (error: ApiError) => error.message,
        finally: () => setLoadingData(false),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Title
        </label>

        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your short url"
          required
          autoFocus
          className="block w-full resize-none overflow-hidden rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400"
        />
      </div>
      <div>
        <label
          htmlFor="url"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          URL
        </label>

        <textarea
          id="url"
          name="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://example.com/your-long-url"
          rows={1}
          required
          className="block w-full resize-none overflow-hidden rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-zinc-800">
          Expiry date
        </label>

        <div className="space-y-3">
          {/* Never */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3 transition hover:border-zinc-400">
            <input
              type="radio"
              name="expiryOption"
              value="never"
              checked={isNever}
              onChange={() => setIsNever(true)}
              className="h-4 w-4 accent-[#3c2d11]"
            />

            <div>
              <p className="text-sm font-medium text-zinc-900">Never</p>

              <p className="text-xs text-zinc-500">
                This short URL will not expire
              </p>
            </div>
          </label>

          {/* Specific date */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3 transition hover:border-zinc-400">
            <input
              type="radio"
              name="expiryOption"
              value="date"
              checked={!isNever}
              onChange={() => {
                setIsNever(false);
              }}
              className="h-4 w-4 accent-[#3c2d11]"
            />

            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900">
                Set expiry date
              </p>

              <p className="text-xs text-zinc-500">
                Choose when this short URL should stop working
              </p>

              {!isNever && (
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={new Date(expiryDate).toISOString().split("T")[0]}
                  min={getDate(new Date())}
                  onChange={(event) => {
                    setExpiryDate(new Date(event.target.value));
                  }}
                  className="mt-3 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400"
                />
              )}
            </div>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        Create shortLy URL →
      </button>
    </form>
  );
}
