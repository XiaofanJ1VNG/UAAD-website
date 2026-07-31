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

// Names in a cell are comma-separated in real exports (e.g. from Wix),
// which is safe because Papa Parse already un-quotes the CSV column
// itself — by the time we see this string, the commas inside it are just
// characters, not column separators.
function splitCommaList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Tags sometimes arrive as a JSON array string (e.g. `["Exhibition","Talk"]`,
// which is how some CMS exports serialize a multi-select field). Falls back
// to a plain comma-separated list otherwise.
function parseTags(value: string | undefined): string[] {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v).trim()).filter(Boolean);
      }
    } catch {
      // fall through to comma-split below
    }
  }
  return splitCommaList(trimmed);
}

function isUsableImageUrl(value: string | undefined): boolean {
  return /^https?:\/\//i.test((value ?? "").trim());
}

// Nothing is required — a row with a blank title or date still imports.
// Dates that are empty just sort to the start of the timeline rather than
// blocking the whole import; better to get everything in and let you
// clean up individual events afterward than to silently drop rows.
export function parseEventsCsv(csvText: string): CsvImportResult {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const errors: string[] = parsed.errors.map(
    (e) => `Row ${(e.row ?? 0) + 2}: ${e.message}`
  );

  const events: Omit<EventItem, "id">[] = parsed.data.map((row, i) => {
    const rowNum = i + 2; // +1 for zero-index, +1 for the header row itself
    const date = (row.date ?? "").trim();
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Row ${rowNum}: date "${date}" isn't in YYYY-MM-DD format — imported without a date`);
    }
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";

    const rawCover = row.cover ?? row.coverimage ?? "";
    if (rawCover.trim() && !isUsableImageUrl(rawCover)) {
      errors.push(
        `Row ${rowNum}: coverImage "${rawCover.trim().slice(0, 40)}..." isn't a usable web URL (e.g. a wix:image:// reference) — imported without a cover image`
      );
    }

    return {
      date: validDate,
      displayDate: validDate ? displayDateFrom(validDate) : "",
      location: (row.location ?? "").trim(),
      title: (row.title ?? "").trim(),
      // "Curator" is what this shows up as in Wix-style exports; plain
      // "organizers" also works if that's what a column is called.
      organizers: (row.curator ?? row.organizers ?? "").trim(),
      time: (row.time ?? "").trim(),
      artists: splitCommaList(row.artists),
      description: (row.intro ?? row.description ?? "").trim(),
      coverImage: isUsableImageUrl(rawCover) ? rawCover.trim() : "",
      archived: /^true$/i.test((row.archive ?? row.archived ?? "").trim()),
      tags: parseTags(row.tags),
      url: (row.url ?? "").trim() || undefined,
      coOrganizedWith:
        row["co-organizers"]?.trim() ||
        row["co-organized with"]?.trim() ||
        row.coorganizedwith?.trim() ||
        undefined,
    };
  });

  return { events, errors };
}

export const CSV_TEMPLATE = `date,location,title,co-organizers,Tags,time,Url,artists,Curator,description,coverImage,archived
2025-03-14,"Brooklyn Art Haus, NYC",Ghosts in the Feedback Loop,Creative Code Art,"[""Exhibition""]",7:00 PM - 11:00 PM,https://example.com/event-page,"k0j0, Amanda Bennetts, Florence Alwajih",Amy Xiaofan Jiang,A virtual exhibition exploring algorithmic systems.,https://example.com/flyer.jpg,FALSE
`;
