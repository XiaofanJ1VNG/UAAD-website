"use client";

import { motion } from "framer-motion";
import { EventItem } from "@/lib/types";

interface Props {
  event: EventItem;
  active: boolean;
  isDesktop: boolean;
  isFirstOfYear: boolean;
  lineColor: string;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}

export default function EventStop({
  event,
  active,
  isDesktop,
  isFirstOfYear,
  lineColor,
  onEnter,
  onLeave,
  onToggle,
}: Props) {
  const year = event.date.slice(0, 4);

  const handlers = isDesktop
    ? { onMouseEnter: onEnter, onMouseLeave: onLeave }
    : { onClick: onToggle };

  // Card width vs. slot width are kept separate on purpose: the connecting
  // line spans the FULL slot (so it stays unbroken from stop to stop, with
  // no gaps), while the card itself is narrower, leaving the gap as empty
  // space after the card. This is what makes the line read as one
  // continuous subway line instead of disconnected segments.
  const GAP = 32;
  const cardWidth = active
    ? isDesktop
      ? 600
      : "min(calc(100vw - 4rem), 420px)"
    : 176;
  const cardStyle: React.CSSProperties = { width: cardWidth };
  const slotStyle: React.CSSProperties = {
    width: typeof cardWidth === "number" ? cardWidth + GAP : `calc(${cardWidth} + ${GAP}px)`,
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="flex flex-shrink-0 flex-col items-start"
      style={slotStyle}
    >
      {/* line + dot + date/location/year label — spans the full slot
          (including the trailing gap) so it connects seamlessly with the
          next stop's line */}
      <div className="relative h-14 w-full flex-shrink-0">
        <div
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
          style={{ backgroundColor: lineColor, opacity: 0.45 }}
        />
        <div
          className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ring-4 ring-ink"
          style={{ backgroundColor: lineColor }}
        />
        <div className="absolute bottom-full left-0 mb-2 whitespace-nowrap font-offbit">
          {isFirstOfYear && (
            <div className="text-sm font-bold tracking-wide" style={{ color: lineColor }}>
              {year}
            </div>
          )}
          <div className="text-xs tracking-wide text-white/60">
            {event.displayDate}, {event.location}
          </div>
        </div>
      </div>

      {/* flyer card — narrower than the slot, so the gap after it stays
          visually open even though the line above runs through it */}
      <div
        className="mt-3 cursor-pointer overflow-hidden rounded-2xl bg-white/5 outline outline-1 outline-white/10"
        style={cardStyle}
        role="button"
        tabIndex={0}
        aria-expanded={active}
        aria-label={`${event.title} — ${active ? "collapse" : "expand"} details`}
        {...handlers}
      >
        {!active && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.coverImage}
            alt={`${event.title} flyer`}
            className="h-44 w-full object-cover"
          />
        )}

        {active && isDesktop && (
          <div className="flex h-[220px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.coverImage}
              alt={`${event.title} flyer`}
              className="h-full w-[220px] flex-shrink-0 object-cover"
            />
            <DetailPanel event={event} />
          </div>
        )}

        {active && !isDesktop && (
          <div className="flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.coverImage}
              alt={`${event.title} flyer`}
              className="h-56 w-full object-cover"
            />
            <DetailPanel event={event} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DetailPanel({ event }: { event: EventItem }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.2 }}
      className="flex min-w-0 flex-1 flex-col gap-1.5 overflow-y-auto p-5"
    >
      <h3 className="text-lg font-semibold leading-snug">{event.title}</h3>
      <p className="text-xs uppercase tracking-wide text-white/50">
        {event.organizers}
      </p>
      <dl className="mt-1 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 font-offbit text-xs tracking-wide text-white/70">
        <dt className="text-white/40">When</dt>
        <dd>{event.time}</dd>
        <dt className="text-white/40">Where</dt>
        <dd>{event.address}</dd>
        <dt className="text-white/40">Artists</dt>
        <dd>{event.artists.join(", ")}</dd>
      </dl>
      <p className="mt-2 text-sm leading-relaxed text-white/80">
        {event.description}
      </p>
    </motion.div>
  );
}
