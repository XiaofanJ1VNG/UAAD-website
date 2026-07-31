"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { NAV_LINKS } from "@/lib/nav";

export default function Header() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Reserve the header's own height with a spacer so the fixed bar can
  // slide away on scroll without the page content jumping underneath it.
  useEffect(() => {
    function measure() {
      if (barRef.current) setBarHeight(barRef.current.offsetHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Mirrors the Wix "Disappear" scroll effect (Overlap: next section,
  // Direction: up, Distance: 100%): header slides fully out of view when
  // scrolling down, and slides back in on any upward scroll or once back
  // near the very top.
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y <= 4) {
        setHidden(false);
      } else if (y > lastY.current) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        ref={barRef}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-6 py-5 md:px-10 md:py-6"
        style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
      >
        <Link href="/" className="flex-shrink-0">
          <Logo className="h-9 w-9 md:h-10 md:w-10" />
        </Link>

        <nav className="hidden h-[50px] items-center gap-1 rounded-[100px] bg-[#272727]/80 px-1.5 md:flex">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-full border px-5 py-2 text-[20px] transition-colors " +
                  (isActive
                    ? "border-[#6E6E6E] bg-[#121212] text-accent"
                    : "border-[#6E6E6E] bg-[#757575]/20 text-white hover:border-transparent hover:bg-[#121212]")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 rounded-full border border-[#6E6E6E] bg-[#272727]/80 px-4 py-2.5 text-sm text-white/60 md:flex">
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
      </div>

      {/* Spacer matching the fixed header's real height, so it doesn't
          overlap the hero section below when visible. */}
      <div style={{ height: barHeight }} aria-hidden="true" />
    </>
  );
}
