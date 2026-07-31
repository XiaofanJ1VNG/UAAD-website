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
    <section aria-label="What's On" className="py-24 md:py-36">
      <div className="px-9 text-center md:px-[60px]">
        <h2 className="font-offbit text-[53px] font-bold md:text-[85px]">What&apos;s On</h2>
        <p className="mt-3 text-[21px] text-white/50">
          <span className="hidden md:inline">
            Hover a flyer to preview the event. Scroll or click-and-drag to explore the timeline.
          </span>
          <span className="md:hidden">
            Tap a flyer to expand it — tap again to close. Swipe to explore the timeline.
          </span>
        </p>
        {!isLive && (
          <p className="mt-2 text-[15px] text-white/30">
            Showing sample data — connect the GitHub content file to replace this.
          </p>
        )}
      </div>

      {/* pt-[120px] reserves room for the (now larger) date/year labels,
          which sit ABOVE the line via negative positioning. Without this,
          they'd get silently clipped: setting overflow-x to "auto" forces
          overflow-y to "auto" too (a CSS quirk), so anything overflowing
          upward out of this box was being cut off invisibly.

          Horizontal padding (px-9 / md:px-[60px]) intentionally matches
          the Header/hero/Footer padding so the subway line's frame lines
          up with the rest of the page instead of feeling offset. */}
      <div
        ref={scrollRef}
        className="no-scrollbar mt-16 cursor-grab overflow-x-auto px-9 pb-6 pt-[120px] active:cursor-grabbing md:px-[60px]"
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        {/* items-start (not items-end) so every stop's line row stays
            pinned to the same top edge — otherwise, when one card grows
            taller, the whole row re-aligns to the bottom and the
            connecting line breaks out of position for every other stop.

            justify-[safe_center] (not plain justify-center) is the fix for
            two bugs at once:
            1. Plain `justify-center` on an overflowing flex row makes the
               overflow on the START side unreachable by scrolling/dragging
               (scrollLeft can never go negative), which clipped the left
               end of the line with no way to reveal it.
            2. It also caused the whole row to visually re-center itself
               every time a card expanded, making expansion look like it
               was growing from the middle instead of pinned to the card's
               own top-left corner.
            `safe` alignment falls back to flex-start whenever centering
            would cause exactly this kind of clipping — so with 12 stops
            (which overflow almost any viewport) it behaves like a normal
            left-aligned, scrollable row, and only truly centers if the
            content is ever narrow enough to fit without overflowing.
            min-w-full keeps the row from collapsing narrower than the
            scroll viewport, which is what lets the centered case work at
            all. */}
        <div className="flex min-w-full select-none items-start [justify-content:safe_center]">
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
