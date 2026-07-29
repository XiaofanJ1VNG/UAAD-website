import type { Metadata, Viewport } from "next";
import "./globals.css";
import { offbit } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "UAAD — Underground Art And Design",
  description: "A creative community empowering change-provoking artists and designers",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={offbit.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-display bg-ink text-white antialiased">
        {children}
      </body>
    </html>
  );
}
