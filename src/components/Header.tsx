"use client";

import Link from "next/link";
import Logo from "./Logo";
import { NAV_LINKS } from "@/lib/nav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-5 md:px-10 md:py-6">
      <Link href="/" className="flex-shrink-0">
        <Logo className="h-9 w-9 md:h-10 md:w-10" />
      </Link>

      <nav className="hidden md:flex items-center rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm divide-x divide-white/10">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-5 py-2.5 text-sm text-white/90 transition-colors hover:text-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-white/60 backdrop-blur-sm">
        <svg
          className="h-4 w-4 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="M17 17l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <span>Search...</span>
      </div>

      {/* Mobile: compact menu affordance (stub for MVP) */}
      <button
        className="flex md:hidden items-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/90"
        aria-label="Open menu"
      >
        Menu
      </button>
    </header>
  );
}
