"use client";

import { EventItem } from "./types";
import { EVENTS_PATH, UPLOADS_DIR } from "./githubConfig";
import { getFile, putTextFile, putBinaryFile, fileToBase64 } from "./githubApi";

interface LoadedEvents {
  events: EventItem[];
  sha: string | null;
}

export async function loadEventsForAdmin(token: string): Promise<LoadedEvents> {
  const file = await getFile(EVENTS_PATH, token);
  if (!file.content.trim()) return { events: [], sha: file.sha };
  try {
    return { events: JSON.parse(file.content) as EventItem[], sha: file.sha };
  } catch {
    throw new Error("content/events.json exists but isn't valid JSON — check it manually on GitHub.");
  }
}

async function saveEvents(
  events: EventItem[],
  sha: string | null,
  message: string,
  token: string
): Promise<void> {
  const content = JSON.stringify(events, null, 2);
  await putTextFile(EVENTS_PATH, content, message, token, sha);
}

export async function uploadCoverImage(file: File, token: string): Promise<string> {
  const base64 = await fileToBase64(file);
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${UPLOADS_DIR}/${crypto.randomUUID()}.${ext}`;
  return putBinaryFile(path, base64, `Upload cover image`, token);
}

// Each write re-reads the file first to get the latest sha, so two edits in
// a row (e.g. add then immediately archive) don't collide with a stale sha.
export async function addEvent(
  newEvent: Omit<EventItem, "id">,
  token: string
): Promise<EventItem[]> {
  const { events, sha } = await loadEventsForAdmin(token);
  const event: EventItem = { ...newEvent, id: crypto.randomUUID() };
  const next = [...events, event];
  await saveEvents(next, sha, `Add event: ${event.title}`, token);
  return next;
}

// Same idea as addEvent, but appends many events in a single commit —
// used by the CSV bulk import so importing 40 old events is one write to
// GitHub instead of 40.
export async function bulkAddEvents(
  newEvents: Omit<EventItem, "id">[],
  token: string
): Promise<EventItem[]> {
  const { events, sha } = await loadEventsForAdmin(token);
  const withIds: EventItem[] = newEvents.map((e) => ({ ...e, id: crypto.randomUUID() }));
  const next = [...events, ...withIds];
  await saveEvents(next, sha, `Bulk import ${withIds.length} events from CSV`, token);
  return next;
}

export async function updateEvent(
  id: string,
  patch: Partial<EventItem>,
  token: string
): Promise<EventItem[]> {
  const { events, sha } = await loadEventsForAdmin(token);
  const next = events.map((e) => (e.id === id ? { ...e, ...patch } : e));
  const title = next.find((e) => e.id === id)?.title ?? id;
  await saveEvents(next, sha, `Update event: ${title}`, token);
  return next;
}

export async function deleteEvent(id: string, token: string): Promise<EventItem[]> {
  const { events, sha } = await loadEventsForAdmin(token);
  const target = events.find((e) => e.id === id);
  const next = events.filter((e) => e.id !== id);
  await saveEvents(next, sha, `Delete event: ${target?.title ?? id}`, token);
  return next;
}
