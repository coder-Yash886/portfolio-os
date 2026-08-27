"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

function formatClock(date: Date, short: boolean) {
  if (short) {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function TopBar() {
  const [now, setNow] = useState(() => formatClock(new Date(), false));
  const [shortClock, setShortClock] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setShortClock(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const tick = () => setNow(formatClock(new Date(), shortClock));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [shortClock]);

  return (
    <header className="pointer-events-auto absolute inset-x-0 top-0 z-50 flex h-8 items-center justify-between bg-[color:var(--topbar)] px-2 text-xs text-[color:var(--topbar-fg)] backdrop-blur-md sm:px-3 sm:text-[13px]">
      <div className="flex min-w-0 items-center gap-1.5 font-medium tracking-wide sm:gap-2 sm:min-w-28">
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[color:var(--accent)] text-[10px] font-bold text-[color:var(--accent-fg)]">
          Y
        </span>
        <span className="hidden truncate sm:inline">{profile.name} OS</span>
      </div>
      <time className="absolute left-1/2 -translate-x-1/2 tabular-nums tracking-wide">
        {now}
      </time>
      <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 text-[color:var(--topbar-muted)] sm:min-w-28 sm:gap-3">
        <span aria-label="Network" title="Online">
          <WifiIcon />
        </span>
        <span className="hidden sm:inline" aria-label="Volume" title="Volume">
          <VolumeIcon />
        </span>
        <span aria-label="Battery" title="Battery">
          <BatteryIcon />
        </span>
      </div>
    </header>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0-4.2c1.9 0 3.6.8 4.8 2l-1.4 1.4a5 5 0 0 0-6.8 0L7.2 16.3a6.8 6.8 0 0 1 4.8-2Zm0-4.3c3.1 0 5.9 1.3 7.9 3.3l-1.4 1.4a9.1 9.1 0 0 0-13 0L4.1 13.3A11.1 11.1 0 0 1 12 10Z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 9v6h3.5L12 19.5V4.5L7.5 9H4Zm11.5 1.5a3.5 3.5 0 0 1 0 3l1.4 1.4a5.5 5.5 0 0 0 0-5.8l-1.4 1.4Z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h11A2.5 2.5 0 0 1 19 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 3 15.5v-7Zm16.5 2h1.2c.4 0 .8.4.8.8v1.4c0 .4-.4.8-.8.8h-1.2v-3ZM6 9.5v5h9v-5H6Z" />
    </svg>
  );
}
