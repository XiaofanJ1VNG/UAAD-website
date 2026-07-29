import Link from "next/link";
import Logo from "./Logo";
import { NAV_LINKS } from "@/lib/nav";

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/uaad.art" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UClT5QT-y-EUanu3h0TiiTcA",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/underground-art-and-design-llc",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-6 py-12 md:px-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <Logo className="h-9 w-9 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Underground Art And Design</p>
            <a
              href="mailto:hello@uaad.art"
              className="text-sm text-white/50 hover:text-accent"
            >
              hello@uaad.art
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-4 text-sm text-white/70">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
        <p>© {year} by Underground Art And Design</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-accent">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
