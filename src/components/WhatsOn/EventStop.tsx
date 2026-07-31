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

const SPRING = { type: "spring", stiffness: 260, damping: 30 } as const;

// Dot diameter and connecting-line thickness are the same value on
// purpose (per brand spec: the line should read as exactly as thick as
// the stop marker, like a real subway map).
const DOT_SIZE = 21;

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
  const GAP = 48;
  const cardWidth = active
    ? isDesktop
      ? 1125
      : "min(calc(100vw - 6rem), 788px)"
    : 264;
  const cardStyle: React.CSSProperties = { width: cardWidth };
  const slotStyle: React.CSSProperties = {
    width: typeof cardWidth === "number" ? cardWidth + GAP : `calc(${cardWidth} + ${GAP}px)`,
  };

  return (
    <motion.div
      layout
      transition={SPRING}
      className="flex flex-shrink-0 flex-col items-start"
      style={slotStyle}
      data-event-id={event.id}
    >
      {/* line + dot + date/location/year label — spans the full slot
          (including the trailing gap) so it connects seamlessly with the
          next stop's line.

          This row itself has `layout` so it smoothly tracks the slot's
          width change (that's the whole row growing/shrinking). The dot
          and the date label ALSO get their own `layout` so Framer applies
          the same nested scale-correction trick used for the card/image
          elsewhere in this file: it cancels out the horizontal stretch
          the row's own resize-transform would otherwise impose on them,
          so they hold their true size and never look squashed/stretched.
          The line bar is deliberately left as a plain (non-layout) div —
          it's the one piece that SHOULD visibly stretch, since it's what
          reads as the line elongating to match the wider row. */}
      <motion.div layout transition={SPRING} className="relative h-24 w-full flex-shrink-0">
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
          style={{ backgroundColor: lineColor, opacity: 0.5, height: DOT_SIZE }}
        />
        <motion.div
          layout
          transition={SPRING}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full ring-[6px] ring-ink"
          style={{
            backgroundColor: lineColor,
            height: DOT_SIZE,
            width: DOT_SIZE,
          }}
        />
        <motion.div
          layout
          transition={SPRING}
          className="absolute bottom-full left-0 mb-[15px] whitespace-nowrap font-offbit"
        >
          {isFirstOfYear && (
            <div className="text-[24px] font-bold tracking-wide" style={{ color: lineColor }}>
              {year}
            </div>
          )}
          <div className="text-[21px] tracking-wide text-white/60">
            {event.displayDate}, {event.location}
          </div>
        </motion.div>
      </motion.div>

      {/* flyer card — narrower than the slot, so the gap after it stays
          visually open even though the line above runs through it. This is
          its own motion.div with `layout` so Framer Motion applies size
          corrections to it (and its children below) independently of the
          outer slot — without this, the resize animation stretches the
          image/text instead of smoothly reflowing them. */}
      <motion.div
        layout
        transition={SPRING}
        className="mt-[18px] cursor-pointer overflow-hidden rounded-2xl bg-white/5 outline outline-1 outline-white/10"
        style={cardStyle}
        role="button"
        tabIndex={0}
        aria-expanded={active}
        aria-label={`${event.title} — ${active ? "collapse" : "expand"} details`}
        {...handlers}
      >
        {!active && (
          <motion.img
            layout
            src={event.coverImage}
            alt={`${event.title} flyer`}
            className="h-[264px] w-full object-cover"
          />
        )}

        {active && isDesktop && (
          <motion.div layout className="flex h-[413px]">
            <motion.img
              layout
              src={event.coverImage}
              alt={`${event.title} flyer`}
              className="h-full w-[413px] flex-shrink-0 object-cover"
            />
            <DetailPanel event={event} />
          </motion.div>
        )}

        {active && !isDesktop && (
          <motion.div layout className="flex flex-col">
            <motion.img
              layout
              src={event.coverImage}
              alt={`${event.title} flyer`}
              className="h-[420px] w-full object-cover"
            />
            <DetailPanel event={event} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function DetailPanel({ event }: { event: EventItem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.2 }}
      className="flex min-w-0 flex-1 flex-col gap-[9px] overflow-y-auto p-[30px] font-display"
    >
      <h3 className="text-[20px] font-semibold leading-snug">{event.title}</h3>
      <p className="text-[18px] uppercase tracking-wide text-white/50">
        {event.organizers}
      </p>
      <dl className="mt-[6px] grid grid-cols-[auto,1fr] gap-x-[18px] gap-y-[6px] text-[18px] text-white/70">
        <dt className="text-white/40">When</dt>
        <dd>{event.time}</dd>
        <dt className="text-white/40">Where</dt>
        <dd>{event.address}</dd>
        <dt className="text-white/40">Artists</dt>
        <dd>{event.artists.join(", ")}</dd>
      </dl>
      <p className="mt-3 text-[14px] leading-relaxed text-white/80">
        {event.description}
      </p>
    </motion.div>
  );
}
