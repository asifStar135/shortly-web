"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Link2,
  LogOut,
  Mail,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getDate } from "@/lib/helpers";
import { logoutUser } from "@/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import userApis from "@/lib/api/userApis";
import { ApiError } from "@/lib/api-error";

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState(username);
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState(username);

  const [logoutDialog, setLogoutDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { user, clearUser, setUser, setIsAuthenticated, setLoadingData } =
    useAuthStore();

  const handleLogOut = async () => {
    try {
      const res = await logoutUser();
      if (res) {
        clearUser();
        setIsAuthenticated(false);
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveUsername = () => {
    if (!usernameDraft.trim()) {
      toast.error("Please enter a username !");
      return;
    }

    setLoadingData(true);

    toast.promise(
      userApis.updateProfile({
        isUsername: true,
        username: usernameDraft,
      }),
      {
        loading: "Saving your changes...",
        success: (res) => {
          if (user) setUser({ ...user, username: usernameDraft });
          setEditingUsername(false);
          return res.message;
        },
        error: (error: ApiError) => error.message,
      },
    );
  };

  const cancelUsernameEdit = () => {
    setEditingUsername(false);
  };

  const saveEmail = () => {
    if (!emailDraft.trim()) {
      toast.error("Please enter a valid email !");
      return;
    }

    setLoadingData(true);

    toast.promise(
      userApis.updateProfile({
        isUsername: false,
        email: emailDraft,
      }),
      {
        loading: "Saving your changes...",
        success: (res) => {
          if (user) setUser({ ...user, email: emailDraft });
          setEditingEmail(false);
          return res.message;
        },
        error: (error: ApiError) => error.message,
      },
    );
  };

  const cancelEmailEdit = () => {
    setEmailDraft(user?.email || "");
    setEditingEmail(false);
  };

  return (
    <main className="min-h-screen bg-[#f8f0df] text-[#111111]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6">
        {/* Main */}
        <section className="flex-1 py-4 md:py-10">
          {/* Back */}
          <Link
            href="/home"
            className="mb-10 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          {/* Page heading */}
          <div className="mb-12">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
              Account
            </p>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Your profile
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-gray-500">
              Manage your account, security and shortLy preferences from one
              place.
            </p>
          </div>

          {/* Profile Identity */}
          <section className="border-y border-gray-300/70 py-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#3c2d11] text-2xl font-semibold text-[#f8f0df]">
                {user?.username.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500">Username</p>

                <div className="mt-1 flex items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    @{user?.username}
                  </h2>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Member since {getDate(user?.createdAt)}
                </p>
              </div>
            </div>
          </section>

          {/* Account Stats */}
          <section className="grid grid-cols-1 border-b border-gray-300/70 sm:grid-cols-3">
            <ProfileStat
              icon={<Link2 size={18} />}
              label="Total links"
              value={user?.totalUrls?.toString() ?? "0"}
            />

            <ProfileStat
              icon={<Check size={18} />}
              label="Active links"
              value={user?.activeUrls?.toString() || "0"}
              border
            />

            <ProfileStat
              icon={<ExternalLink size={18} />}
              label="Total visits"
              value={user?.totalVisits?.toString() || "0"}
              border
            />
          </section>

          {/* Account Information */}
          <section className="py-16">
            <SectionHeader eyebrow="Account" title="Account information" />

            <div className="mt-8 border-y border-gray-300/70">
              <InfoRow
                icon={<User size={18} />}
                label="Username"
                view={
                  editingUsername ? (
                    <div className="mt-2 flex max-w-lg items-center gap-3">
                      <div className="flex flex-1 items-center border-b border-gray-500">
                        <span className="text-gray-400">@</span>

                        <input
                          autoFocus
                          value={usernameDraft}
                          onChange={(e) => setUsernameDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveUsername();
                            if (e.key === "Escape") cancelUsernameEdit();
                          }}
                          className="w-full bg-transparent px-2 py-2 text-xl font-medium outline-none"
                        />
                      </div>

                      <button
                        onClick={saveUsername}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-white transition-opacity hover:opacity-80"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        onClick={cancelUsernameEdit}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-white/50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 font-medium">{`@${user?.username}`}</p>
                  )
                }
                action={
                  !editingUsername && (
                    <button
                      onClick={() => {
                        setUsernameDraft(user?.username || "");
                        setEditingUsername(true);
                      }}
                      className="text-sm font-medium text-[#735b25] underline decoration-[#cdbb8f] underline-offset-4 hover:text-[#3c2d11]"
                    >
                      Edit
                    </button>
                  )
                }
              />

              <InfoRow
                icon={<Mail size={18} />}
                label="Email"
                view={
                  editingEmail ? (
                    <div className="mt-2 flex max-w-lg items-center gap-3">
                      <div className="flex flex-1 items-center border-b border-gray-500">
                        <span className="text-gray-400">at:</span>

                        <input
                          autoFocus
                          type="email"
                          value={emailDraft}
                          onChange={(e) => setEmailDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEmail();
                            if (e.key === "Escape") cancelEmailEdit();
                          }}
                          className="w-full bg-transparent px-2 py-2 text-xl font-medium outline-none"
                        />
                      </div>

                      <button
                        onClick={saveEmail}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-white transition-opacity hover:opacity-80"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        onClick={cancelEmailEdit}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-white/50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 font-medium">{`to: ${user?.email}`}</p>
                  )
                }
                action={
                  !editingEmail && (
                    <button
                      onClick={() => {
                        setEmailDraft(user?.email || "");
                        setEditingEmail(true);
                      }}
                      className="text-sm font-medium text-[#735b25] underline decoration-[#cdbb8f] underline-offset-4 hover:text-[#3c2d11]"
                    >
                      Edit
                    </button>
                  )
                }
              />

              <InfoRow
                icon={<Link2 size={18} />}
                label="Your URLs"
                view={
                  <p className="mt-1 font-medium">
                    {user?.totalUrls} links created
                  </p>
                }
                action={
                  <Link
                    href="/my-urls"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#735b25] underline decoration-[#cdbb8f] underline-offset-4 hover:text-[#3c2d11]"
                  >
                    View links
                    <ArrowRight size={14} />
                  </Link>
                }
              />
            </div>
          </section>

          {/* Security */}
          {/* <section className=" border-gray-300/70">
            <SectionHeader
              eyebrow="Security"
              title="Keep your account secure."
            />

            <div className="mt-8 border-y border-gray-300/70">
              <SettingsRow
                icon={<KeyRound size={19} />}
                title="Password"
                description="Change your account password."
                action={
                  <Link
                    href="/profile/reset-password"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/50"
                  >
                    Reset password
                    <ArrowRight size={15} />
                  </Link>
                }
              />

              <SettingsRow
                icon={<ShieldCheck size={19} />}
                title="Password protected links"
                description="Protect individual short URLs with a password."
                badge="Coming soon"
              />
            </div>
          </section> */}

          {/* Preferences */}
          <section className="border-t border-gray-300/70 py-16">
            <SectionHeader eyebrow="Preferences" title="Your preferences." />

            <div className="mt-8 border-y border-gray-300/70">
              <SettingsRow
                icon={<ShieldCheck size={19} />}
                title="Account security"
                description="Security preferences and additional protection."
                badge="Coming soon"
              />

              <SettingsRow
                icon={<ExternalLink size={19} />}
                title="Analytics preferences"
                description="Control how link analytics are collected and displayed."
                badge="Coming soon"
              />
            </div>
          </section>

          {/* Session */}
          <section className="border-gray-300/70">
            <SectionHeader eyebrow="Session" title="Manage your session." />

            <div className="mt-8 flex flex-col justify-between gap-6 border-y border-gray-300/70 py-7 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500">
                  <LogOut size={18} />
                </div>

                <div>
                  <h3 className="font-medium">Sign out</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Sign out from this device.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLogoutDialog(true)}
                className="w-fit rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/50"
              >
                Sign out
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className=" pt-8">
            <div className="border border-red-200/80 bg-red-50/30 p-7 md:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-500">
                Danger zone
              </p>

              <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-medium text-red-700">Delete account</h3>

                  <p className="mt-1 max-w-lg text-sm leading-6 text-gray-500">
                    Permanently delete your account and all URLs associated with
                    it. This action cannot be undone.
                  </p>
                </div>

                <button
                  onClick={() => setDeleteDialog(true)}
                  className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Delete account
                </button>
              </div>
            </div>
          </section>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-300/70 py-8 text-center text-sm text-gray-400">
          © 2026 shortLy. Simple links, simply shared.
        </footer>
      </div>

      {/* Logout Dialog */}
      {logoutDialog && (
        <ConfirmDialog
          title="Sign out?"
          description="You will need to log in again to manage your short URLs."
          confirmText="Sign out"
          onCancel={() => setLogoutDialog(false)}
          onConfirm={handleLogOut}
        />
      )}

      {/* Delete Account Dialog */}
      {deleteDialog && (
        <ConfirmDialog
          title="Delete your account?"
          description="This permanently deletes your account and all the short URLs associated with it. This action cannot be undone."
          confirmText="Delete account"
          destructive
          onCancel={() => setDeleteDialog(false)}
          onConfirm={() => {
            setDeleteDialog(false);
          }}
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function ProfileStat({
  icon,
  label,
  value,
  border = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <div
      className={`px-6 py-7 ${
        border ? "border-t border-gray-300/70 sm:border-l sm:border-t-0" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  view,
  description,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  view: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-300/60 px-2 py-6 last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-start gap-4">
        <div className="mt-0.5 text-gray-400">{icon}</div>

        <div>
          <p className="text-sm text-gray-500">{label}</p>

          {view}

          {description && (
            <p className="mt-1 max-w-xl text-xs leading-5 text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && <div className="sm:shrink-0">{action}</div>}
    </div>
  );
}

function SettingsRow({
  icon,
  title,
  description,
  action,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-gray-300/60 px-2 py-7 last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-start gap-4">
        <div className="mt-0.5 text-gray-400">{icon}</div>

        <div>
          <h3 className="font-medium">{title}</h3>

          <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      {action}

      {badge && (
        <span className="w-fit rounded-full border border-gray-300 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
          {badge}
        </span>
      )}
    </div>
  );
}

function ConfirmDialog({
  title,
  description,
  confirmText,
  destructive = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmText: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-[#f8f0df] p-7 shadow-2xl">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 ${
              destructive ? "bg-red-600" : "bg-[#111111]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
