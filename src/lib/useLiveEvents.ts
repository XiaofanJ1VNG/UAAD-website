"use client";

import { useEffect, useState } from "react";
import { EventItem } from "./types";
import { RAW_BASE, EVENTS_PATH } from "./githubConfig";
import { EVENTS as SAMPLE_EVENTS } from "@/data/events";

interface State {
  events: EventItem[];
  loading: boolean;
  isLive: boolean; // false while showing the bundled sample data
}

// Fetches the live events file straight from GitHub on every page load —
// no rebuild needed for content to show up. Falls back to the bundled
// sample data if the live file doesn't exist yet or the fetch fails, so
// the page never looks broken.
export function useLiveEvents(): State {
  const [state, setState] = useState<State>({
    events: SAMPLE_EVENTS,
    loading: true,
    isLive: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch(`${RAW_BASE}/${EVENTS_PATH}?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("no live events file yet");
        const data = (await res.json()) as EventItem[];
        if (!cancelled) {
          setState({
            events: data.filter((e) => !e.archived),
            loading: false,
            isLive: true,
          });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
