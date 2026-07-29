"use client";

import { useMemo, useRef, useState } from "react";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { useLiveEvents } from "@/lib/useLiveEvents";
import EventStop from "./EventStop";
import { colorForYear } from "./lineColors";

export default function Timeline() {
  const isDesktop = useIsDesktop();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { events, isLive } = useLiveEvents();
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ isDown: false, startX: 0, startScroll: 0, moved: false });

  const sorted = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events]
  );

  const years = useMemo(
    () => Array.from(new Set(sorted.map((e) => e.date.slice(0, 4)))).map(Number),
    [sorted]
  );

  // Click-and-drag to pan the timeline horizontally with a mouse (in
  // addition to trackpad/touch scrolling), since expanded cards can push
  // other stops out of frame.
  function onPointerDown(e: React.MouseEvent) {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { isDown: true, startX: e.pageX, startScroll: el.scrollLeft, moved: false };
  }
  function onPointerMove(e: React.MouseEvent) {
    const el = scrollRef.current;
    if (!el || !drag.current.isDown) return;
    const delta = e.pageX - drag.current.startX;
    if (Math.abs(delta) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - delta;
  }
  function endDrag() {
    drag.current.isDown = false;
  }

  return (
    <section aria-label="What's On" className="py-16 md:py-24">
      <div className="px-6 text-center md:px-10">
        <h2 className="font-offbit text-3xl font-bold md:text-5xl">What&apos;s On</h2>
        <p className="mt-2 text-sm text-white/50">
          <span className="hidden md:inline">
            Hover a flyer to preview the event. Scroll or click-and-drag to explore the timeline.
          </span>
          <span className="md:hidden">
            Tap a flyer to expand it — tap again to close. Swipe to explore the timeline.
          </span>
        </p>
        {!isLive && (
          <p className="mt-1 text-xs text-white/30">
            Showing sample data — connect the GitHub content file to replace this.
          </p>
        )}
      </div>

      {/* pt-16 reserves room for the date/year labels, which sit ABOVE the
          line via negative positioning. Without this, they'd get silently
          clipped: setting overflow-x to "auto" forces overflow-y to "auto"
          too (a CSS quirk), so anything overflowing upward out of this box
          was being cut off invisibly. */}
      <div
        ref={scrollRef}
        className="no-scrollbar mt-10 cursor-grab overflow-x-auto px-6 pb-4 pt-16 active:cursor-grabbing md:px-10"
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        {/* items-start (not items-end) so every stop's line row stays
            pinned to the same top edge — otherwise, when one card grows
            taller, the whole row re-aligns to the bottom and the
            connecting line breaks out of position for every other stop. */}
        {/* No gap here on purpose — each stop's own slot already includes
            trailing spacing, so the connecting line stays unbroken. */}
        <div className="flex select-none items-start">
          {sorted.map((event, i) => {
            const year = Number(event.date.slice(0, 4));
            const isFirstOfYear =
              i === 0 || sorted[i - 1].date.slice(0, 4) !== event.date.slice(0, 4);

            return (
              <EventStop
                key={event.id}
                event={event}
                isDesktop={isDesktop}
                isFirstOfYear={isFirstOfYear}
                lineColor={colorForYear(year, years)}
                active={activeId === event.id}
                onEnter={() => setActiveId(event.id)}
                onLeave={() => setActiveId((cur) => (cur === event.id ? null : cur))}
                onToggle={() => {
                  if (drag.current.moved) return; // was a drag, not a tap
                  setActiveId((cur) => (cur === event.id ? null : event.id));
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
