"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent, type EventName } from "@/lib/analytics";

export type TrackSpec = {
  event: EventName;
  props?: Record<string, string | number>;
};

/** Link interno que dispara un evento en onClick, sin bloquear la navegación. */
export function TrackedLink({
  track,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { track: TrackSpec }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(track.event, track.props);
        onClick?.(e);
      }}
    />
  );
}

/** <a> (mailto, externos, archivos) que dispara un evento en onClick. */
export function TrackedAnchor({
  track,
  onClick,
  ...props
}: ComponentProps<"a"> & { track: TrackSpec }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(track.event, track.props);
        onClick?.(e);
      }}
    />
  );
}
