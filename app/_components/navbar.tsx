"use client";

import Link from "next/link";

export default function Navbar() {
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

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-sm hover:bg-neutral-800"
          >
            <span className="inline-block w-6 h-6 rounded-full bg-white/20" aria-hidden />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
