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
    <footer className="border-t border-white/10 px-9 py-[72px] md:px-[60px]">
      <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Logo className="h-[54px] w-[54px] flex-shrink-0" />
          <div>
            <p className="text-[21px] font-medium">Underground Art And Design</p>
            <a
              href="mailto:hello@uaad.art"
              className="text-[21px] text-white/50 hover:text-accent"
            >
              hello@uaad.art
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-9 gap-y-3 text-[21px] text-white/70">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-6 text-[21px] text-white/70">
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

      <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-9 text-[18px] text-white/40 md:flex-row md:items-center md:justify-between">
        <p>© {year} by Underground Art And Design</p>
        <div className="flex gap-6">
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
