"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const hideAuthActions =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } catch (e) {}
    try {
      sessionStorage.clear();
    } catch (e) {}
    try {
      // expire auth cookies used by middleware
      document.cookie = "auth_token=; Max-Age=0; path=/";
      document.cookie = "token=; Max-Age=0; path=/";
      document.cookie = "role=; Max-Age=0; path=/";
    } catch (e) {}
    // Use hard replace to prevent back navigation to protected pages
    try {
      window.location.replace("/login");
      return;
    } catch (e) {}
    router.replace("/login");
    router.refresh();
  };
  return (
    <header className="bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-neutral-900">Tiffin Mate</Link>
          <nav aria-label="Main navigation" className="hidden md:flex gap-4 text-neutral-700">
            <Link href="/" className="hover:text-neutral-900">Home</Link>
            <Link href="/menu" className="hover:text-neutral-900">Menu</Link>
            <Link href="/bookings" className="hover:text-neutral-900">Bookings</Link>
          </nav>
        </div>

        {!hideAuthActions && (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-sm hover:bg-neutral-800"
            >
              <span className="inline-block w-6 h-6 rounded-full bg-white/20" aria-hidden />
              <span>Profile</span>
            </Link>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
