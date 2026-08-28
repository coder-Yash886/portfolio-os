"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

type Panel = "wifi" | "volume" | "battery" | null;

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
  const [panel, setPanel] = useState<Panel>(null);
  const [volume, setVolume] = useState(72);
  const [muted, setMuted] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!trayRef.current?.contains(e.target as Node)) {
        setPanel(null);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function togglePanel(next: Panel) {
    setPanel((current) => (current === next ? null : next));
  }

  return (
    <header className="pointer-events-auto absolute inset-x-0 top-0 z-50 flex h-8 items-center justify-between bg-[color:var(--topbar)] px-2 text-xs text-[color:var(--topbar-fg)] backdrop-blur-md sm:px-3 sm:text-[13px]">
      <div className="flex min-w-0 items-center gap-1.5 font-medium tracking-wide sm:min-w-28 sm:gap-2">
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[color:var(--accent)] text-[10px] font-bold text-[color:var(--accent-fg)]">
          Y
        </span>
        <span className="hidden truncate sm:inline">{profile.name} OS</span>
      </div>
      <time className="absolute left-1/2 -translate-x-1/2 tabular-nums tracking-wide">
        {now}
      </time>
      <div
        ref={trayRef}
        className="relative flex min-w-0 shrink-0 items-center justify-end gap-1 text-[color:var(--topbar-muted)] sm:min-w-28 sm:gap-2"
      >
        <TrayButton
          label="Network"
          active={panel === "wifi"}
          onClick={() => togglePanel("wifi")}
        >
          <WifiIcon />
        </TrayButton>
        <TrayButton
          label="Volume"
          active={panel === "volume"}
          onClick={() => togglePanel("volume")}
          className="hidden sm:inline-flex"
        >
          <VolumeIcon muted={muted} />
        </TrayButton>
        <TrayButton
          label="Battery"
          active={panel === "battery"}
          onClick={() => togglePanel("battery")}
        >
          <BatteryIcon />
        </TrayButton>

        {panel === "wifi" ? (
          <TrayPanel title="Network">
            <p className="text-sm font-medium text-white">Connected</p>
            <p className="mt-1 text-xs text-white/55">Wi-Fi · Online</p>
            <p className="mt-2 text-xs text-white/40">Portfolio network is active</p>
          </TrayPanel>
        ) : null}

        {panel === "volume" ? (
          <TrayPanel title="Sound">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-white/55">{muted ? "Muted" : `${volume}%`}</span>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className="cursor-pointer rounded-md px-2 py-1 text-xs text-[color:var(--accent)] hover:bg-white/10"
              >
                {muted ? "Unmute" : "Mute"}
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setMuted(false);
                setVolume(Number(e.target.value));
              }}
              className="mt-3 w-full cursor-pointer accent-[color:var(--accent)]"
              aria-label="Volume"
            />
          </TrayPanel>
        ) : null}

        {panel === "battery" ? (
          <TrayPanel title="Power">
            <p className="text-sm font-medium text-white">87% remaining</p>
            <p className="mt-1 text-xs text-white/55">Plugged in · Charging</p>
            <p className="mt-2 text-xs text-white/40">Estimated 2h 15m until full</p>
          </TrayPanel>
        ) : null}
      </div>
    </header>
  );
}

function TrayButton({
  label,
  children,
  onClick,
  active,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/10 hover:text-white ${active ? "bg-white/10 text-white" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

function TrayPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="absolute top-[calc(100%+6px)] right-0 z-50 w-52 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--window)] p-3 shadow-xl">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
        {title}
      </p>
      {children}
    </div>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0-4.2c1.9 0 3.6.8 4.8 2l-1.4 1.4a5 5 0 0 0-6.8 0L7.2 16.3a6.8 6.8 0 0 1 4.8-2Zm0-4.3c3.1 0 5.9 1.3 7.9 3.3l-1.4 1.4a9.1 9.1 0 0 0-13 0L4.1 13.3A11.1 11.1 0 0 1 12 10Z" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {muted ? (
        <path d="M4 9v6h3.5L12 19.5V4.5L7.5 9H4Zm14.3 3 2.9 2.9-1.4 1.4L15 13.4l-2.9 2.9-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4 2.9 2.9 2.9-2.9 1.4 1.4-2.9 2.9Z" />
      ) : (
        <path d="M4 9v6h3.5L12 19.5V4.5L7.5 9H4Zm11.5 1.5a3.5 3.5 0 0 1 0 3l1.4 1.4a5.5 5.5 0 0 0 0-5.8l-1.4 1.4Z" />
      )}
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
