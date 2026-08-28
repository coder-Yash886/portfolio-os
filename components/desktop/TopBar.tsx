"use client";

import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
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
        setOpen(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

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
        <TrayButton label="Open quick settings" active={open} onClick={() => setOpen((v) => !v)}>
          <WifiIcon />
        </TrayButton>
        <TrayButton label="Open quick settings" active={open} onClick={() => setOpen((v) => !v)}>
          <VolumeIcon />
        </TrayButton>
        <TrayButton label="Open quick settings" active={open} onClick={() => setOpen((v) => !v)}>
          <BatteryIcon level={100} />
        </TrayButton>

        {open ? <QuickSettingsPanel onClose={() => setOpen(false)} /> : null}
      </div>
    </header>
  );
}

function QuickSettingsPanel({ onClose }: { onClose: () => void }) {
  const [volume, setVolume] = useState(72);
  const [brightness, setBrightness] = useState(68);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [powerMode, setPowerMode] = useState(false);
  const [darkStyle, setDarkStyle] = useState(true);
  const [nightLight, setNightLight] = useState(false);
  const [airplane, setAirplane] = useState(false);

  return (
    <div className="quick-settings-panel absolute top-[calc(100%+8px)] right-0 z-50 w-[min(100vw-1rem,320px)] overflow-hidden rounded-2xl border border-white/10 bg-[#3d3d3d] p-3 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <BatteryIcon level={100} />
          <span>100%</span>
        </div>
        <div className="flex items-center gap-1">
          <IconAction label="Settings" onClick={onClose}>
            <SettingsIcon />
          </IconAction>
          <IconAction label="Lock" onClick={onClose}>
            <LockIcon />
          </IconAction>
          <IconAction label="Power" onClick={onClose}>
            <PowerIcon />
          </IconAction>
        </div>
      </div>

      {/* Sliders */}
      <div className="mt-3 space-y-2.5">
        <QuickSlider
          icon={<VolumeIcon />}
          value={volume}
          onChange={setVolume}
          ariaLabel="Volume"
        />
        <QuickSlider
          icon={<BrightnessIcon />}
          value={brightness}
          onChange={setBrightness}
          ariaLabel="Brightness"
        />
      </div>

      {/* Toggle grid */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <ToggleTile
          active={wifi}
          onClick={() => setWifi((v) => !v)}
          icon={<WifiIcon />}
          label="Wi-Fi"
          sublabel="Connected"
          showChevron
        />
        <ToggleTile
          active={bluetooth}
          onClick={() => setBluetooth((v) => !v)}
          icon={<BluetoothIcon />}
          label="Bluetooth"
          showChevron
        />
        <ToggleTile
          active={powerMode}
          onClick={() => setPowerMode((v) => !v)}
          icon={<PowerModeIcon />}
          label="Power Mode"
          showChevron
        />
        <ToggleTile
          active={darkStyle}
          onClick={() => setDarkStyle((v) => !v)}
          icon={<DarkStyleIcon />}
          label="Dark Style"
        />
        <ToggleTile
          active={nightLight}
          onClick={() => setNightLight((v) => !v)}
          icon={<NightLightIcon />}
          label="Night Light"
        />
        <ToggleTile
          active={airplane}
          onClick={() => setAirplane((v) => !v)}
          icon={<AirplaneIcon />}
          label="Airplane Mode"
          dimmed
        />
      </div>
    </div>
  );
}

function QuickSlider({
  icon,
  value,
  onChange,
  ariaLabel,
}: {
  icon: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-[#4a4a4a] px-3 py-2.5">
      <span className="shrink-0 text-white/90">{icon}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="quick-slider w-full cursor-pointer"
        style={{ "--slider-pct": `${value}%` } as React.CSSProperties}
      />
    </div>
  );
}

function ToggleTile({
  active,
  onClick,
  icon,
  label,
  sublabel,
  showChevron,
  dimmed,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  showChevron?: boolean;
  dimmed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[4.25rem] cursor-pointer items-stretch overflow-hidden rounded-2xl text-left transition-colors ${
        active
          ? "bg-[color:var(--accent)] text-white"
          : dimmed
            ? "bg-[#4a4a4a]/70 text-white/45"
            : "bg-[#4a4a4a] text-white/85 hover:bg-[#525252]"
      }`}
    >
      <span className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <span className={active ? "text-white" : "text-white/80"}>{icon}</span>
        <span>
          <span className="block text-xs font-medium leading-tight">{label}</span>
          {sublabel ? (
            <span className={`mt-0.5 block text-[10px] ${active ? "text-white/85" : "text-white/50"}`}>
              {sublabel}
            </span>
          ) : null}
        </span>
      </span>
      {showChevron ? (
        <span
          className={`flex w-8 shrink-0 items-center justify-center border-l ${
            active ? "border-white/20 bg-black/10" : "border-white/8"
          }`}
        >
          <ChevronIcon />
        </span>
      ) : null}
    </button>
  );
}

function IconAction({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}

function TrayButton({
  label,
  children,
  onClick,
  active,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/10 hover:text-white ${active ? "bg-white/10 text-white" : ""}`}
    >
      {children}
    </button>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.29 6.71a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-4.58 4.58a1 1 0 0 1-1.42-1.42L13.17 12 9.29 8.12a1 1 0 0 1 0-1.41Z" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0-4.2c1.9 0 3.6.8 4.8 2l-1.4 1.4a5 5 0 0 0-6.8 0L7.2 16.3a6.8 6.8 0 0 1 4.8-2Zm0-4.3c3.1 0 5.9 1.3 7.9 3.3l-1.4 1.4a9.1 9.1 0 0 0-13 0L4.1 13.3A11.1 11.1 0 0 1 12 10Z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 9v6h3.5L12 19.5V4.5L7.5 9H4Zm11.5 1.5a3.5 3.5 0 0 1 0 3l1.4 1.4a5.5 5.5 0 0 0 0-5.8l-1.4 1.4Z" />
    </svg>
  );
}

function BrightnessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 4V2h-1v2h1Zm0 18v2h-1v-2h1ZM4 12H2v-1h2v1Zm18 0h2v-1h-2v1ZM5.64 5.64 4.22 4.22l-.7.71 1.41 1.41.71-.7ZM19.78 19.78l-.71.71 1.41 1.41.71-.71-1.41-1.41ZM5.64 18.36l-1.41 1.41.71.71 1.41-1.41-.71-.71ZM18.36 5.64l1.41-1.41-.71-.71-1.41 1.41.71.71ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
    </svg>
  );
}

function BatteryIcon({ level = 100 }: { level?: number }) {
  const fill = level >= 95 ? 9 : Math.round((level / 100) * 9);
  return (
    <svg width="18" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h11A2.5 2.5 0 0 1 19 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 3 15.5v-7Zm16.5 2h1.2c.4 0 .8.4.8.8v1.4c0 .4-.4.8-.8.8h-1.2v-3Z" />
      <rect x="6" y="9.5" width={fill} height="5" rx="0.5" />
    </svg>
  );
}

function BluetoothIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m14.24 6.41-4.24 4.24 4.24 4.24-1.41 1.41L7.17 12l5.66-5.59 1.41 1.41Zm-2.83 11.18 1.41 1.41L17.83 12l-5.01-4.99 1.41-1.41L20.66 12l-9.25 5.59Z" />
    </svg>
  );
}

function PowerModeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.95 6.95 0 0 1 19 12a7 7 0 0 1-7 7 7 7 0 0 1-7-7c0-2.05.89-3.9 2.3-5.19L5.88 5.39A8.96 8.96 0 0 0 3 12a9 9 0 0 0 9 9 9 9 0 0 0 9-9c0-2.4-.94-4.58-2.47-6.2Z" />
    </svg>
  );
}

function DarkStyleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.5 5.5 0 0 1-7.54-7.54A9.06 9.06 0 0 0 12 3Z" />
    </svg>
  );
}

function NightLightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5Zm-9 5h2v2H3v-2Zm16 0h2v2h-2v-2ZM5.64 5.64l1.41 1.41-1.41 1.41-1.41-1.41 1.41-1.41Zm12.73 12.73 1.41 1.41-1.41 1.41-1.41-1.41 1.41-1.41ZM12 1h2v2h-2V1Zm0 18h2v2h-2v-2Z" />
    </svg>
  );
}

function AirplaneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10.18 9 4.83 4.65l1.41-1.41L12 9l5.76-5.76 1.41 1.41L13.82 9l5.35 5.35-1.41 1.41L12 11.83l-5.76 5.93-1.41-1.41L10.18 15l-5.35-5.35 1.41-1.41L10.18 9Z" transform="rotate(45 12 12)" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm8.94 3.5a7.94 7.94 0 0 0-.12-1l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a8.07 8.07 0 0 0-1.73-1l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a8.07 8.07 0 0 0-1.73 1l-2.39-.96a.5.5 0 0 0-.6.22L2.01 8.78a.5.5 0 0 0 .12.64L4.16 11a7.94 7.94 0 0 0 0 2l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.54.43 1.12.77 1.73 1l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.61-.23 1.19-.57 1.73-1l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64L20.94 12Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2Z" />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.95 6.95 0 0 1 19 12a7 7 0 0 1-7 7 7 7 0 0 1-7-7c0-2.05.89-3.9 2.3-5.19L5.88 5.39A8.96 8.96 0 0 0 3 12a9 9 0 0 0 9 9 9 9 0 0 0 9-9c0-2.4-.94-4.58-2.47-6.2Z" />
    </svg>
  );
}
