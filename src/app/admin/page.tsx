"use client";

import { useEffect, useState } from "react";
import { EventItem } from "@/lib/types";
import {
  getToken,
  setToken as saveToken,
  clearToken,
  verifyToken,
} from "@/lib/githubApi";
import {
  loadEventsForAdmin,
  addEvent,
  updateEvent,
  deleteEvent,
  uploadCoverImage,
} from "@/lib/eventsStore";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";

function displayDateFrom(dateStr: string) {
  const [, m, d] = dateStr.split("-");
  return m && d ? `${m}/${d}` : "";
}

type FormState = {
  date: string;
  location: string;
  title: string;
  organizers: string;
  time: string;
  address: string;
  artists: string;
  description: string;
};

function emptyForm(): FormState {
  return {
    date: "",
    location: "",
    title: "",
    organizers: "",
    time: "",
    address: "",
    artists: "",
    description: "",
  };
}

function formFromEvent(ev: EventItem): FormState {
  return {
    date: ev.date,
    location: ev.location,
    title: ev.title,
    organizers: ev.organizers,
    time: ev.time,
    address: ev.address,
    artists: ev.artists.join(", "),
    description: ev.description,
  };
}

export default function AdminPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setTokenState(getToken());
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!token) {
    return <TokenGate onVerified={(t) => setTokenState(t)} />;
  }

  return (
    <Dashboard
      token={token}
      onLogout={() => {
        clearToken();
        setTokenState(null);
      }}
    />
  );
}

function TokenGate({ onVerified }: { onVerified: (token: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);
    const ok = await verifyToken(value.trim()).catch(() => false);
    setChecking(false);
    if (!ok) {
      setError(
        "That token didn't work — check it's a fine-grained token scoped to this repo with Contents: Read and write."
      );
      return;
    }
    saveToken(value.trim());
    onVerified(value.trim());
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold">UAAD Admin</h1>
      <p className="text-sm text-white/50">
        Paste your GitHub access token. It's stored only in this browser and
        used to read/write{" "}
        <code className="text-white/70">
          {GITHUB_OWNER}/{GITHUB_REPO}
        </code>
        .
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="github_pat_..."
          autoFocus
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={checking || !value.trim()}
          className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-ink disabled:opacity-50"
        >
          {checking ? "Checking..." : "Continue"}
        </button>
      </form>
    </main>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const { events } = await loadEventsForAdmin(token);
      setEvents(events);
    } catch (err: any) {
      setLoadError(err.message);
    }
  }

  async function handleCreate(form: FormState, imageFile: File | null) {
    let coverImage = "";
    if (imageFile) coverImage = await uploadCoverImage(imageFile, token);
    const next = await addEvent(
      {
        date: form.date,
        displayDate: displayDateFrom(form.date),
        location: form.location,
        title: form.title,
        organizers: form.organizers,
        time: form.time,
        address: form.address,
        artists: form.artists.split(",").map((s) => s.trim()).filter(Boolean),
        description: form.description,
        coverImage,
        archived: false,
      },
      token
    );
    setEvents(next);
  }

  async function handleUpdate(
    id: string,
    form: FormState,
    imageFile: File | null,
    existingCoverImage: string
  ) {
    const coverImage = imageFile
      ? await uploadCoverImage(imageFile, token)
      : existingCoverImage;
    const next = await updateEvent(
      id,
      {
        date: form.date,
        displayDate: displayDateFrom(form.date),
        location: form.location,
        title: form.title,
        organizers: form.organizers,
        time: form.time,
        address: form.address,
        artists: form.artists.split(",").map((s) => s.trim()).filter(Boolean),
        description: form.description,
        coverImage,
      },
      token
    );
    setEvents(next);
    setEditingEvent(null);
  }

  async function handleArchiveToggle(ev: EventItem) {
    const next = await updateEvent(ev.id, { archived: !ev.archived }, token);
    setEvents(next);
  }

  async function handleDelete(ev: EventItem) {
    if (!confirm(`Delete "${ev.title}" permanently?`)) return;
    const next = await deleteEvent(ev.id, token);
    setEvents(next);
    if (editingEvent?.id === ev.id) setEditingEvent(null);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">UAAD Admin — What&apos;s On</h1>
        <div className="flex gap-3 text-sm">
          <a href="/" target="_blank" className="text-white/50 underline">
            View live page
          </a>
          <button onClick={onLogout} className="text-red-400">
            Log out
          </button>
        </div>
      </div>

      {editingEvent ? (
        <EventForm
          key={editingEvent.id}
          initial={formFromEvent(editingEvent)}
          existingCoverImage={editingEvent.coverImage}
          heading={`Editing: ${editingEvent.title}`}
          submitLabel="Save changes"
          onCancel={() => setEditingEvent(null)}
          onSubmit={(form, imageFile) =>
            handleUpdate(editingEvent.id, form, imageFile, editingEvent.coverImage)
          }
        />
      ) : (
        <EventForm
          heading="Add an event"
          submitLabel="Add event"
          onSubmit={handleCreate}
        />
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-white/70">
          Events {events ? `(${events.length})` : ""}
        </h2>
        <p className="text-xs text-white/30">
          Archived events are hidden from the live page automatically — no
          extra step needed.
        </p>
        {loadError && <p className="text-sm text-red-400">{loadError}</p>}
        {!events && !loadError && (
          <p className="text-sm text-white/40">Loading from GitHub...</p>
        )}
        {events?.map((ev) => (
          <div
            key={ev.id}
            className={`flex items-center gap-3 rounded-xl border border-white/10 p-3 ${
              ev.archived ? "opacity-50" : ""
            } ${editingEvent?.id === ev.id ? "border-accent" : ""}`}
          >
            {ev.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ev.coverImage}
                alt=""
                className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-white/10" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {ev.title} {ev.archived && <span className="text-white/40">(archived)</span>}
              </p>
              <p className="truncate text-xs text-white/40">
                {ev.displayDate}, {ev.location}
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-1 text-xs">
              <button
                onClick={() => setEditingEvent(ev)}
                className="text-accent"
              >
                Edit
              </button>
              <button onClick={() => handleArchiveToggle(ev)} className="text-white/60">
                {ev.archived ? "Restore" : "Archive"}
              </button>
              <button onClick={() => handleDelete(ev)} className="text-red-400">
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function EventForm({
  initial,
  existingCoverImage,
  heading,
  submitLabel,
  onCancel,
  onSubmit,
}: {
  initial?: FormState;
  existingCoverImage?: string;
  heading: string;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit: (form: FormState, imageFile: File | null) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(initial ?? emptyForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(initial);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.location || !form.title) {
      setError("Date, location, and title are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form, imageFile);
      if (!isEditing) {
        setForm(emptyForm());
        setImageFile(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const previewImage = imageFile
    ? URL.createObjectURL(imageFile)
    : existingCoverImage || null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/70">{heading}</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-white/50 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent [color-scheme:dark]"
        />
        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Location (e.g. NYC, Online)"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <input
        value={form.organizers}
        onChange={(e) => setForm({ ...form, organizers: e.target.value })}
        placeholder="Organizers"
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          placeholder="Time (e.g. 7:00 PM – 11:00 PM)"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <input
        value={form.artists}
        onChange={(e) => setForm({ ...form, artists: e.target.value })}
        placeholder="Artists (comma separated)"
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
        rows={3}
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
      />

      <div className="flex items-center gap-3">
        {previewImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewImage}
            alt=""
            className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
          />
        )}
        <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
          <span className="rounded-lg border border-white/15 px-3 py-2">
            {imageFile
              ? imageFile.name
              : existingCoverImage
              ? "Replace cover image"
              : "Choose cover image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-ink disabled:opacity-50"
      >
        {saving ? "Saving to GitHub..." : submitLabel}
      </button>
    </form>
  );
}
