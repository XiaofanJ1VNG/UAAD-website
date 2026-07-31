"use client";

import Papa from "papaparse";
import { EventItem } from "./types";

export interface CsvImportResult {
  events: Omit<EventItem, "id">[];
  errors: string[];
}

function displayDateFrom(dateStr: string): string {
  const [, m, d] = dateStr.split("-");
  return m && d ? `${m}/${d}` : "";
}

// Only these three are required — everything else can be blank and gets
// filled with a sensible empty default, so a rough CSV of old events
// (which might be missing organizers/time/address for some rows) still
// imports instead of failing outright.
const REQUIRED = ["date", "location", "title"] as const;

// Header matching is case/whitespace-insensitive (transformHeader below),
// so "CoverImage", "cover image"... no — keep it simple and exact per the
// template, just tolerant of case and stray spaces around the name.
export function parseEventsCsv(csvText: string): CsvImportResult {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const errors: string[] = parsed.errors.map(
    (e) => `Row ${(e.row ?? 0) + 2}: ${e.message}`
  );

  const events: Omit<EventItem, "id">[] = [];

  parsed.data.forEach((row, i) => {
    const rowNum = i + 2; // +1 for zero-index, +1 for the header row itself
    const missing = REQUIRED.filter((key) => !row[key]?.trim());
    if (missing.length > 0) {
      errors.push(`Row ${rowNum}: missing ${missing.join(", ")} — skipped`);
      return;
    }

    const date = row.date.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Row ${rowNum}: date "${date}" isn't in YYYY-MM-DD format — skipped`);
      return;
    }

    events.push({
      date,
      displayDate: displayDateFrom(date),
      location: row.location.trim(),
      title: row.title.trim(),
      organizers: row.organizers?.trim() ?? "",
      time: row.time?.trim() ?? "",
      address: row.address?.trim() ?? "",
      artists: (row.artists ?? "")
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean),
      description: row.description?.trim() ?? "",
      // CSV cells can only hold text, so images can't travel through a
      // CSV directly — this column should be a URL to an already-hosted
      // image (e.g. from your old Wix site, or a link you've uploaded
      // elsewhere). Leaving it blank is fine; you can add a cover image
      // later by editing that event individually.
      coverImage: row.coverimage?.trim() ?? "",
      archived: /^true$/i.test((row.archived ?? "").trim()),
    });
  });

  return { events, errors };
}

export const CSV_TEMPLATE = `date,location,title,organizers,time,address,artists,description,coverImage,archived
2025-03-14,NYC,Ghosts in the Feedback Loop,UAAD,7:00 PM - 11:00 PM,"The Shed, 545 W 30th St, New York, NY",k0j0; Amanda Bennetts; Florence Alwajih,A virtual exhibition exploring algorithmic systems.,https://example.com/flyer.jpg,false
`;
