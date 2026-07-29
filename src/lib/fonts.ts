import localFont from "next/font/local";

// The "info board" typeface — used for the small departure-board-style
// text (date/location labels on the timeline, the When/Where/Artists
// labels in the expanded event detail). Big headlines stay on the Wix
// Madefor Display font, unchanged.
export const offbit = localFont({
  src: [
    { path: "../fonts/OffBitTrial-101.otf", weight: "400", style: "normal" },
    { path: "../fonts/OffBitTrial-101Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-offbit",
  display: "swap",
});
