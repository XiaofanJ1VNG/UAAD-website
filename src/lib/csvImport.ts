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
// (which might be missing some columns for some rows) still imports
// instead of failing outright.
const REQUIRED = ["date", "location", "title"] as const;

function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Header matching is case/whitespace-insensitive (transformHeader below).
// A couple of columns accept either name so older CSVs (or the original
// template) keep working alongside the current column names.
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
      artists: splitList(row.artists),
      // "intro" is the current column name; "description" still works too.
      description: (row.intro ?? row.description ?? "").trim(),
      // CSV cells can only hold text, so images can't travel through a
      // CSV directly — "cover" (or "coverimage") should be a URL to an
      // already-hosted image. Leaving it blank is fine; add a photo
      // later by editing that event individually.
      coverImage: (row.cover ?? row.coverimage ?? "").trim(),
      archived: /^true$/i.test((row.archive ?? row.archived ?? "").trim()),
      tags: splitList(row.tags),
      url: row.url?.trim() || undefined,
      coOrganizedWith: row["co-organized with"]?.trim() || row.coorganizedwith?.trim() || undefined,
    });
  });

  return { events, errors };
}

export const CSV_TEMPLATE = `Title,Date,Tags,location,intro,URL,cover,archive,Co-organized with
Ghosts in the Feedback Loop,2025-03-14,exhibition; net art,NYC,A virtual exhibition exploring algorithmic systems.,https://example.com/event-page,https://example.com/flyer.jpg,false,Creative Code Art
`;
