"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Pencil,
  Power,
  Trash2,
  BarChart3,
  Globe2,
  Monitor,
  QrCode,
  ExternalLinkIcon,
  PenLine,
  X,
} from "lucide-react";
import Link from "next/link";
import UrlApis from "@/lib/api/UrlApis";
import { useParams, useRouter } from "next/navigation";
import { editActions, UrlItem } from "@/lib/types";
import { getDate, validateUrl } from "@/lib/helpers";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/shared/ConfirmDialog";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api-error";

export default function ShortUrlDetailsPage() {
  const { loadingData, setLoadingData } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [urlDetails, setUrlDetails] = useState<UrlItem>();

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingLongUrl, setEditingLongUrl] = useState(false);
  const [editingExpiry, setEditingExpiry] = useState(false);
  const [isNever, setIsNever] = useState(true);

  const [titleDraft, setTitleDraft] = useState<string>("");
  const [longUrlDraft, setLongUrlDraft] = useState<string>("");
  const [expiryDraft, setExpiryDraft] = useState<Date | null>(null);

  const [openDisableModal, setOpenDisableModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const params = useParams();
  const router = useRouter();

  const fetchUrlDetails = async () => {
    setLoadingData(true);

    try {
      const details = await UrlApis.fetchUrlById(Number(params.id));
      setUrlDetails(details.data);
    } catch (error) {
      setTimeout(() => {
        router.push("/my-urls");
      }, 300);
      toast.error((error as ApiError)?.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveName = async () => {
    if (!titleDraft?.trim()) {
      toast.warning("Title cannot be empty!");
      return;
    }

    const dataToUpdate = {
      title: titleDraft,
    };
    setLoadingData(true);
    toast.promise(
      UrlApis.editUrlData(urlDetails?.id || 0, editActions.title, dataToUpdate),
      {
        success: (res) => {
          fetchUrlDetails();
          return res.message;
        },
        error: (error: ApiError) => error.message,
        loading: "Saving your changes...",
        finally: () => setLoadingData(false),
      },
    );

    setEditingTitle(false);
  };

  const cancelNameEdit = () => {
    setEditingTitle(false);
  };

  const saveLongUrl = () => {
    if (!validateUrl(longUrlDraft)) {
      toast.warning("Please enter a valid url");
      return;
    }

    const dataToUpdate = {
      longUrl: longUrlDraft,
    };

    setLoadingData(true);
    toast.promise(
      UrlApis.editUrlData(
        urlDetails?.id || 0,
        editActions.longUrl,
        dataToUpdate,
      ),
      {
        success: (res) => {
          fetchUrlDetails();
          return res.message;
        },
        error: (error: ApiError) => error.message,
        loading: "Saving your changes...",
        finally: () => setLoadingData(false),
      },
    );

    setEditingLongUrl(false);
  };

  const handleSaveExpiry = async () => {
    const dataToUpdate = {
      expires: isNever ? null : expiryDraft,
    };

    setLoadingData(true);
    toast.promise(
      UrlApis.editUrlData(
        urlDetails?.id || 0,
        editActions.expires,
        dataToUpdate,
      ),
      {
        success: (res) => {
          fetchUrlDetails();
          return res.message;
        },
        error: (error: ApiError) => error.message,
        loading: "Saving your changes...",
        finally: () => setLoadingData(false),
      },
    );

    setEditingExpiry(false);
  };

  const cancelLongUrlEdit = () => {
    setEditingLongUrl(false);
  };

  const confirmEnableDisable = async (enable: boolean) => {
    setLoadingData(true);
    toast.promise(
      UrlApis.editUrlData(
        urlDetails?.id,
        enable ? editActions.enable : editActions.disable,
        {},
      ),
      {
        loading: "Saving your changes...",
        success: (res) => {
          fetchUrlDetails();
          return res.message;
        },
        error: (error: ApiError) => error.message,
        finally: () => setLoadingData(false),
      },
    );
    setOpenDisableModal(false);
  };

  const confirmDelete = () => {
    setLoadingData(true);

    toast.promise(UrlApis.deleteUrl(urlDetails?.id), {
      loading: "Saving your changes...",
      success: (res) => {
        setTimeout(() => {
          router.push("/my-urls");
        }, 500);
        return res.message;
      },

      error: (error: ApiError) => error.message,
      finally: () => setLoadingData(false),
    });
    setOpenDeleteModal(false);
  };

  const shortUrl = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_CLIENT_URL ?? ""}${urlDetails?.shortCode ?? ""}`;
  }, [urlDetails, process.env.NEXT_PUBLIC_CLIENT_URL]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    fetchUrlDetails();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f0df] text-[#111111]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 md:px-10">
        {/* Main */}
        <section className="flex-1 py-1 md:py-2">
          {/* Back */}
          <Link
            href="/my-urls"
            className="mb-10 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to your links
          </Link>

          {/* Title */}
          <div className="mb-12">
            {editingTitle ? (
              <div className="flex items-center gap-3">
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") cancelNameEdit();
                  }}
                  className="w-full border-b border-gray-500 bg-transparent py-2 text-xl font-medium outline-none"
                />

                <button
                  onClick={handleSaveName}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white hover:opacity-80"
                  aria-label="Save name"
                >
                  <Check size={16} />
                </button>

                <button
                  onClick={cancelNameEdit}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 hover:bg-white/50"
                  aria-label="Cancel name edit"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-start gap-4 sm:flex-row">
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  {urlDetails?.title ?? ""}
                </h1>

                <button
                  onClick={() => {
                    setTitleDraft(urlDetails?.title || "");
                    setEditingTitle(true);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/60 hover:text-black"
                  aria-label="Edit name"
                >
                  <PenLine size={20} />
                </button>
              </div>
            )}
          </div>

          {/* URL Overview */}
          <div className="border-y border-gray-300/70 py-10">
            {/* Short URL */}
            <div className="text-center">
              <p className="mb-4 text-lg text-gray-500">Short URL</p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <span className="break-all text-2xl font-semibold tracking-tight md:text-3xl">
                  {shortUrl}
                </span>

                <button
                  onClick={handleCopy}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#111111] bg-[#111111] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-[#111111]"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy"}
                </button>

                <Link
                  href={shortUrl || ""}
                  target="_blank"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#111111] bg-[#111111] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-[#111111]"
                >
                  {<ExternalLinkIcon size={16} />}
                  Open
                </Link>
              </div>

              {/* URL Actions */}
              <div className="mt-6 flex justify-center gap-10">
                <button
                  onClick={() =>
                    urlDetails?.active
                      ? setOpenDisableModal(true)
                      : confirmEnableDisable(true)
                  }
                  disabled={loadingData}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white/30 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/60 hover:border-gray-500"
                >
                  <Power size={16} />
                  {urlDetails?.active ? "Disable" : "Enable"}
                </button>

                <button
                  onClick={() => setOpenDeleteModal(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition-all hover:border-red-400 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            {/* Long URL */}
            <div className="mt-10">
              <p className="mb-3 text-lg text-gray-500">Redirects to</p>

              {editingLongUrl ? (
                <div className="flex items-start gap-3">
                  <textarea
                    autoFocus
                    value={longUrlDraft}
                    onChange={(e) => setLongUrlDraft(e.target.value)}
                    rows={3}
                    className="w-full resize-none border-b border-gray-500 bg-transparent py-2 text-lg leading-8 text-gray-700 outline-none"
                  />

                  <div className="flex shrink-0 gap-2 pt-2">
                    <button
                      onClick={saveLongUrl}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-white hover:opacity-80"
                      aria-label="Save URL"
                    >
                      <Check size={16} />
                    </button>

                    <button
                      onClick={cancelLongUrlEdit}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:bg-white/50"
                      aria-label="Cancel URL edit"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <a
                    href={urlDetails?.longUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-lg leading-8 text-gray-700 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-black md:text-xl"
                  >
                    {urlDetails?.longUrl}
                  </a>

                  <button
                    onClick={() => {
                      setLongUrlDraft(urlDetails?.longUrl || "");
                      setEditingLongUrl(true);
                    }}
                    className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/60 hover:text-black"
                    aria-label="Edit URL"
                  >
                    <PenLine size={20} />
                  </button>

                  {/* <ExternalLink
                    size={18}
                    className="mt-1 shrink-0 text-gray-400"
                  /> */}
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3  text-gray-500">
              <span className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    urlDetails?.active ? "bg-green-600" : "bg-gray-400"
                  }`}
                />
                <strong className="font-medium text-gray-700">
                  {urlDetails?.active ? "Active" : "Disabled"}
                </strong>
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block" />

              <span>
                Created :{" "}
                <strong className="font-semibold text-primary">
                  {getDate(urlDetails?.createdAt)}
                </strong>
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block" />

              {/* Expiry */}
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500">Expires on :</p>

                {!editingExpiry ? (
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">
                      {urlDetails?.expiresAt
                        ? getDate(urlDetails?.expiresAt)
                        : "Never"}
                    </span>

                    <button
                      onClick={() => {
                        setExpiryDraft(
                          urlDetails?.expiresAt
                            ? new Date(urlDetails?.expiresAt)
                            : new Date(new Date().getFullYear(), 11, 31),
                        );
                        setIsNever(urlDetails?.expiresAt ? false : true);
                        setEditingExpiry(true);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/60 hover:text-black"
                      aria-label="Edit expiry"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="max-w-md rounded-xl border border-gray-300/70 bg-white/20 p-5 flex gap-4 items-center">
                    <div>
                      {/* Radio options */}
                      <div className="space-y-4">
                        <label className="flex cursor-pointer items-center gap-3 text-sm">
                          <input
                            type="radio"
                            name="expiry"
                            value="never"
                            checked={isNever}
                            onChange={() => setIsNever(true)}
                            className="accent-[#3c2d11]"
                          />
                          Never
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 text-sm">
                          <input
                            type="radio"
                            name="expiry"
                            value="date"
                            checked={!isNever}
                            onChange={() => setIsNever(false)}
                            className="accent-[#3c2d11]"
                          />
                          Set expiry date
                        </label>
                      </div>

                      {/* Date input */}
                      {!isNever && (
                        <div className="mt-5">
                          <input
                            id="expiry-date"
                            type="date"
                            value={
                              expiryDraft
                                ? expiryDraft?.toISOString()?.split("T")[0]
                                : ""
                            }
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                              setExpiryDraft(new Date(e.target.value))
                            }
                            className="h-11 w-full rounded-lg border border-gray-300 bg-white/40 px-3 text-sm outline-none focus:border-[#3c2d11]"
                          />
                        </div>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveExpiry}
                        className="rounded-full cursor-pointer bg-[#111111] px-5 py-2 text-sm font-medium text-white"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        onClick={() => setEditingExpiry(false)}
                        className="rounded-full cursor-pointer border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-white/50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="border-primary/30 flex items-center gap-4 p-2 rounded-lg border ">
                <span>
                  Expires :{" "}
                  <strong className="font-semibold text-primary">
                    {urlDetails?.expiresAt
                      ? getDate(urlDetails?.expiresAt)
                      : "Never"}
                  </strong>
                </span>

                <button
                  onClick={() => {
                    setEditingExpiry(true)
                    setExpiryDraft()
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/60 hover:text-black"
                  aria-label="Edit expiry date"
                >
                  <PenLine size={15} />
                </button>
              </div> */}
            </div>
          </div>

          {/* Actions */}
          {/* <div className="flex flex-wrap items-center gap-3 border-b border-gray-300/70 py-7">
            <button className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/30 px-5 py-2.5 text-sm font-medium transition-all hover:border-gray-500 hover:bg-white/60">
              <Pencil size={16} />
              Edit
            </button>

            <button
              onClick={() => setActive(!active)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/30 px-5 py-2.5 text-sm font-medium transition-all hover:border-gray-500 hover:bg-white/60"
            >
              <Power size={16} />
              {active ? "Disable" : "Enable"}
            </button>

            <button className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition-all hover:border-red-400 hover:bg-red-50">
              <Trash2 size={16} />
              Delete
            </button>
          </div> */}

          {/* Analytics */}
          <div className="pt-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
                  Analytics
                </p>

                <h2 className="text-3xl font-semibold tracking-tight">
                  Link performance
                </h2>
              </div>

              <BarChart3
                size={28}
                strokeWidth={1.5}
                className="hidden text-gray-400 sm:block"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 border border-gray-300/70 sm:grid-cols-3">
              <Stat
                label="Total visits"
                value={urlDetails?.visit?.toLocaleString() || ""}
                description="All time"
              />

              <Stat
                label="Unique visitors"
                value={"20"}
                description="Estimated unique users"
                border
              />

              <Stat
                label="Today's visits"
                value={"5"}
                description="Since midnight"
                border
              />
            </div>

            {/* Coming Soon Analytics */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <ComingSoonCard
                icon={<BarChart3 size={22} />}
                title="Visits over time"
                description="Track clicks and visitor activity across days, weeks and months."
              />

              <ComingSoonCard
                icon={<Globe2 size={22} />}
                title="Visitor locations"
                description="See where your visitors are coming from around the world."
              />

              <ComingSoonCard
                icon={<Monitor size={22} />}
                title="Devices & browsers"
                description="Understand how people access your short link."
              />

              <ComingSoonCard
                icon={<QrCode size={22} />}
                title="QR code"
                description="Generate and download a QR code for this short link."
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-300/70 py-8 text-center text-sm text-gray-400">
          © 2026 shortLy. Simple links, simply shared.
        </footer>
      </div>
      <ConfirmDialog
        open={openDisableModal}
        onOpenChange={setOpenDisableModal}
        title="Disable this URL ?"
        description="Anyone using this short link will no longer be redirected to its destination."
        confirmText="Yes Disable"
        onConfirm={() => confirmEnableDisable(false)}
      />
      <ConfirmDialog
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        title="Delete this URL?"
        description="This action cannot be undone. The short URL will no longer be available."
        confirmText="Delete URL"
        destructive
        onConfirm={confirmDelete}
      />
    </main>
  );
}

/* ---------- Components ---------- */

function Stat({
  label,
  value,
  description,
  border = false,
}: {
  label: string;
  value: string;
  description: string;
  border?: boolean;
}) {
  return (
    <div
      className={`px-6 py-7 ${
        border ? "border-t border-gray-300/70 sm:border-l sm:border-t-0" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>

      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}

function ComingSoonCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative min-h-40 overflow-hidden border border-gray-300/70 p-6">
      <div className="absolute right-5 top-5 rounded-full border border-gray-300 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
        Coming soon
      </div>

      <div className="flex h-full flex-col justify-between gap-8">
        <div className="text-gray-400">{icon}</div>

        <div>
          <h3 className="text-lg font-medium">{title}</h3>

          <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
