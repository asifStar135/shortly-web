"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Link2, LogOut, Menu, User, X } from "lucide-react";
import { logoutUser } from "@/actions";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Create URL", href: "/shorten" },
  { label: "My URLs", href: "/my-urls" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clearUser, setIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
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

  return (
    <header className="sticky top-0 z-50 border-b border-[#5a4a29] bg-[#3c2d11] text-[#f8f0df]">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link
          href="/home"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          <span>shortLy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#e5dcc9] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          {/* Profile */}
          <div className="relative ml-2">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer rounded-full border border-[#756642] px-3 py-2 transition-colors hover:bg-[#4a3918]"
              aria-label="Profile menu"
            >
              <User size={17} strokeWidth={1.8} />
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-xl border border-[#756642] bg-[#3c2d11] py-1 shadow-xl">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#e5dcc9] hover:bg-[#4a3918] hover:text-white"
                >
                  <User size={16} />
                  Profile
                </Link>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center cursor-pointer gap-3 px-4 py-3 text-sm text-[#e5dcc9] hover:bg-[#4a3918] hover:text-white"
                >
                  <LogOut size={16} onClick={handleLogout} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-lg p-2 cursor-pointer transition-colors hover:bg-[#4a3918] md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-[#5a4a29] px-6 py-4 md:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 border-b border-[#5a4a29] py-4 text-sm text-[#e5dcc9] hover:text-white"
              >
                <Link2 size={16} />
                {link.label}
              </Link>
            ))}

            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 py-4 text-sm text-[#e5dcc9] hover:text-white"
            >
              <User size={16} />
              Profile
            </Link>

            <button
              className="flex items-center gap-3 py-4 cursor-pointer text-left text-sm text-[#e5dcc9] hover:text-white"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
                // TODO: logout API
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
