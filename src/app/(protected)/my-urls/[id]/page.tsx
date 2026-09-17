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
import { Smartphone, MapPin, MoreHorizontal } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
                    urlDetails?.isActive
                      ? setOpenDisableModal(true)
                      : confirmEnableDisable(true)
                  }
                  disabled={loadingData}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white/30 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/60 hover:border-gray-500"
                >
                  <Power size={16} />
                  {urlDetails?.isActive ? "Disable" : "Enable"}
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
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3  text-gray-500">
              <span className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    urlDetails?.isActive ? "bg-green-600" : "bg-gray-400"
                  }`}
                />
                <strong className="font-medium text-gray-700">
                  {urlDetails?.isActive ? "Active" : "Disabled"}
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
            </div>
          </div>

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
                value={urlDetails?.total_visit?.toLocaleString() || "-"}
                description="All time"
              />

              <Stat
                label="Unique visitors"
                value={urlDetails?.unique_visit?.toLocaleString() || "-"}
                description="Estimated unique users"
                border
              />

              <Stat
                label="Today's visits"
                value={urlDetails?.today_visit?.toLocaleString() || "-"}
                description="Since midnight"
                border
              />
            </div>

            {/* Additional Analytics */}
            <div className="mt-8 grid gap-15 md:grid-cols-2 lg:grid-cols-3">
              {/* Device Analytics */}
              <div className="rounded-2xl border border-[#d8cfbd] bg-white/40 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#3c2d11]">
                      Visits by device
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Devices used to access your URL
                    </p>
                  </div>

                  <Smartphone
                    size={20}
                    strokeWidth={1.7}
                    className="text-[#3c2d11]"
                  />
                </div>

                {/* Primary device */}
                <div className="rounded-xl border border-[#d8cfbd] bg-[#f8f0df]/70 p-4">
                  <p className="text-center text-2xl font-semibold text-[#3c2d11]">
                    {urlDetails?.device_visits?.length
                      ? urlDetails.device_visits[0].count
                      : "--"}
                  </p>
                  <p className="text-center mt-1 text-xs uppercase tracking-wide text-gray-500">
                    {urlDetails?.device_visits?.length
                      ? urlDetails?.device_visits[0]?.deviceType
                      : null}
                  </p>
                </div>

                <Dialog>
                  {urlDetails?.device_visits?.length ? (
                    <DialogTrigger className="mt-3 flex h-9 w-full items-center justify-center cursor-pointer rounded-md bg-transparent text-sm font-medium text-primary hover:bg-[#eee4cf]">
                      See all devices
                      <MoreHorizontal className="ml-1 h-4 w-4" />
                    </DialogTrigger>
                  ) : null}

                  <DialogContent className="border-[#d8cfbd] bg-[#f8f0df]">
                    <DialogHeader>
                      <DialogTitle className="text-[#3c2d11]">
                        Visits by device
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2">
                      {urlDetails?.device_visits?.map(
                        ({ deviceType, count }) => (
                          <div
                            key={deviceType}
                            className="flex items-center justify-between rounded-lg bg-white/50 px-4 py-3"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {deviceType}
                            </span>

                            <span className="text-sm font-semibold text-[#3c2d11]">
                              {count}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Location Analytics */}
              <div className="rounded-2xl border border-[#d8cfbd] bg-white/40 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#3c2d11]">
                      Top locations
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Where your URL is being visited
                    </p>
                  </div>

                  <MapPin
                    size={20}
                    strokeWidth={1.7}
                    className="text-[#3c2d11]"
                  />
                </div>

                {/* Primary location */}
                <div className="rounded-xl border border-[#d8cfbd] bg-[#f8f0df]/70 p-4">
                  <p className="text-center text-2xl font-semibold text-[#3c2d11]">
                    {urlDetails?.city_visits?.length
                      ? urlDetails?.city_visits[0]?.count
                      : "--"}
                  </p>
                  <p className="text-center mt-1 text-xs text-gray-500">
                    {urlDetails?.city_visits?.length
                      ? urlDetails?.city_visits[0]?.city +
                        ", " +
                        urlDetails?.city_visits[0]?.country
                      : null}
                  </p>
                </div>

                <Dialog>
                  {urlDetails?.city_visits?.length ? (
                    // <DialogTrigger className="w-full flex justify-center mt-3 h-9 text-xs text-[#3c2d11] hover:bg-[#eee4cf]">
                    <DialogTrigger className="mt-3 flex h-9 w-full items-center justify-center rounded-md bg-transparent text-sm font-medium text-primary cursor-pointer hover:bg-[#eee4cf]">
                      See all locations
                      <MoreHorizontal className="ml-1 h-4 w-4 shrink-0" />
                    </DialogTrigger>
                  ) : null}

                  <DialogContent className="border-[#d8cfbd] bg-[#f8f0df]">
                    <DialogHeader>
                      <DialogTitle className="text-[#3c2d11]">
                        Visits by location
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2">
                      {urlDetails?.city_visits?.map(
                        ({ city, count, country }) => (
                          <div
                            key={city}
                            className="flex items-center justify-between rounded-lg bg-white/50 px-4 py-3"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {city + ", " + country}
                            </span>

                            <span className="text-sm font-semibold text-[#3c2d11]">
                              {count}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* QR Code Coming Soon */}
              <div className="flex min-h-[230px] flex-col justify-between rounded-2xl border border-dashed border-[#cfc3ab] bg-[#eee4cf]/40 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#3c2d11]">
                      QR code
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Generate a QR code for your short URL and share it
                      anywhere.
                    </p>
                  </div>

                  <QrCode
                    size={22}
                    strokeWidth={1.7}
                    className="text-[#3c2d11]"
                  />
                </div>

                <div>
                  <span className="inline-flex rounded-full bg-[#3c2d11]/10 px-3 py-1 text-xs font-medium text-[#3c2d11]">
                    Coming soon
                  </span>

                  <p className="mt-3 text-xs text-gray-500">
                    Quickly generate and download a QR code for this URL.
                  </p>
                </div>
              </div>
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
