"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Link2,
  Search,
  Check,
  ExternalLinkIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import UrlApis from "@/lib/api/UrlApis";
import { getDate } from "@/lib/helpers";
import { UrlItem } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

export default function MyUrlsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [urlItems, setUrlItems] = useState<UrlItem[]>([]);
  const { setLoading } = useAuthStore();

  const fetchUrlItems = async () => {
    setLoading(true);
    setLoading(false);

    try {
      const res = await UrlApis.fetchAllUrls();
      setUrlItems(res ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrlItems();
  }, []);

  const filteredUrls: UrlItem[] = useMemo(() => {
    const result = urlItems.filter((url) => {
      const matchesSearch =
        url?.title?.toLowerCase()?.includes(search.toLowerCase()) ||
        url?.shortCode?.toLowerCase()?.includes(search.toLowerCase()) ||
        url?.longUrl?.toLowerCase()?.includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || url?.isActive == (status == "Active");

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sort === "visits") return b?.total_visit - a?.total_visit;
      if (sort === "oldest") return a?.id - b?.id;

      if (sort === "name") return a?.title?.localeCompare(b?.title);

      return b.id - a.id;
    });
  }, [search, status, sort, urlItems]);

  const totalPages = Math.ceil(filteredUrls.length / ITEMS_PER_PAGE);

  const paginatedUrls = filteredUrls.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleSort = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleCopy = async (shortCode: string, id: number) => {
    await navigator.clipboard.writeText(
      process.env.NEXT_PUBLIC_CLIENT_URL + shortCode,
    );

    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const activeCount = urlItems.filter((url) => url?.isActive === true).length;

  const totalVisits = urlItems.reduce(
    (sum, url: UrlItem) => sum + url?.total_visit,
    0,
  );

  return (
    <main className="min-h-screen bg-[#f8f0df] text-[#111111]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 md:px-10">
        {/* Header */}
        <section className="pt-12 pb-10 md:pt-10 md:pb-14">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
            Your workspace
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                My URLs
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-gray-500">
                Manage everything you&apos;ve shortened, all in one place. Keep
                your links organized and ready to share.
              </p>
            </div>

            <Link
              href="/shorten"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-[#111111] hover:ring-1 hover:ring-[#111111]"
            >
              <Link2 size={17} />
              Create new URL
            </Link>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 border-y border-gray-300/70 sm:grid-cols-3">
          <QuickStat label="Total links" value={urlItems.length.toString()} />

          <QuickStat
            label="Total visits"
            value={totalVisits.toLocaleString()}
            border
          />

          <QuickStat
            label="Active links"
            value={activeCount.toString()}
            border
          />
        </section>

        {/* Controls */}
        <section className="flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or short URL..."
              className="h-12 w-full rounded-full border border-gray-300/80 bg-white/30 pl-11 pr-5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gray-500 focus:bg-white/50"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="h-12 appearance-none rounded-full border border-gray-300/80 bg-white/30 pl-5 pr-10 text-sm outline-none transition-all hover:bg-white/50"
              >
                <option value="visits">Most visits</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name A–Z</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => handleStatus(e.target.value)}
                className="h-12 appearance-none rounded-full border border-gray-300/80 bg-white/30 pl-5 pr-10 text-sm outline-none transition-all hover:bg-white/50"
              >
                <option value="All">All status</option>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </section>

        {/* Table */}
        {paginatedUrls.length > 0 ? (
          <>
            <section className="overflow-hidden border-y border-gray-300/70">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-gray-300/70 text-xs uppercase tracking-wider text-gray-400">
                      <th className="px-5 py-4 font-medium">Name</th>

                      <th className="px-5 py-4 font-medium">Short URL</th>

                      <th className="px-5 py-4 font-medium">Status</th>

                      <th className="px-5 py-4 font-medium">Visits</th>

                      <th className="px-5 py-4 font-medium">Created</th>

                      <th className="px-5 py-4 font-medium">Expires</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedUrls.map((url) => (
                      <tr
                        key={url.id}
                        className="border-b border-gray-300/50 last:border-b-0 transition-colors hover:bg-white/20"
                      >
                        {/* Name */}
                        <td className="px-5 py-5">
                          <Link
                            href={`/my-urls/${url.id}`}
                            className="font-medium text-[#735b25] underline decoration-[#cdbb8f] underline-offset-4 transition-colors hover:text-[#3c2d11]"
                          >
                            {url.title ?? "--"}
                          </Link>
                        </td>

                        {/* Short URL */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {process.env.NEXT_PUBLIC_CLIENT_URL +
                                url.shortCode}
                            </span>

                            <button
                              onClick={() => handleCopy(url.shortCode, url.id)}
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all hover:bg-white/70 hover:text-[#111111]"
                              title="Copy short URL"
                            >
                              {copiedId === url.id ? (
                                <Check size={15} />
                              ) : (
                                <Copy size={15} />
                              )}
                            </button>

                            <Link
                              href={
                                process.env.NEXT_PUBLIC_CLIENT_URL +
                                url.shortCode
                              }
                              target="_blank"
                              onClick={() => handleCopy(url.shortCode, url.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-white/70 hover:text-[#111111]"
                              title="Copy short URL"
                            >
                              <ExternalLinkIcon size={15} />
                            </Link>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-5">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                url.isActive ? "bg-green-600" : "bg-gray-400"
                              }`}
                            />
                            {url.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Visits */}
                        <td className="px-5 py-5 text-sm font-medium">
                          {url?.total_visit?.toLocaleString()}
                        </td>

                        {/* Created */}
                        <td className="px-5 py-5 text-sm text-gray-500">
                          {getDate(url.createdAt)}
                        </td>

                        {/* Expires */}
                        <td className="px-5 py-5 text-sm text-gray-500">
                          {url?.expiresAt ? getDate(url.expiresAt) : "Never"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-7">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {(page - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(page * ITEMS_PER_PAGE, filteredUrls.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {filteredUrls.length}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition-all hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`hidden cursor-pointer h-10 w-10 items-center justify-center rounded-full text-sm sm:flex ${
                          page === pageNumber
                            ? "bg-[#111111] text-white"
                            : "text-gray-600 hover:bg-white/50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ),
                  )}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-all hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <section className="flex min-h-[420px] flex-col items-center justify-center border-y border-gray-300/70 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 text-gray-400">
              <Link2 size={26} strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              No URLs found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {search || status !== "All"
                ? "Try changing your search or filter to find what you're looking for."
                : "You haven't created any short links yet. Create your first one and start sharing."}
            </p>

            {!search && status === "All" && (
              <Link
                href="/shorten"
                className="mt-6 rounded-full bg-[#111111] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-[#111111] hover:ring-1 hover:ring-[#111111]"
              >
                Create a URL
              </Link>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-300/70 py-8 text-center text-sm text-gray-400">
          © 2026 shortLy. Simple links, simply shared.
        </footer>
      </div>
    </main>
  );
}

function QuickStat({
  label,
  value,
  border = false,
}: {
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <div
      className={`px-6 py-6 ${
        border ? "border-t border-gray-300/70 sm:border-l sm:border-t-0" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
