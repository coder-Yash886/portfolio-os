"use client";

import type { ReactNode } from "react";
import { DOCK_ORDER, APPS, type AppId } from "@/lib/apps";
import { useDesktopStore } from "@/store/desktopStore";

const ICONS: Record<AppId, ReactNode> = {
  files: <FilesIcon />,
  browser: <ChromeIcon />,
  editor: <VSCodeIcon />,
  terminal: <TerminalIcon />,
  store: <AppCenterIcon />,
  "about-portfolio": <HelpIcon />,
};

export function Dock() {
  const windows = useDesktopStore((s) => s.windows);
  const openApp = useDesktopStore((s) => s.openApp);
  const focusedId = useDesktopStore((s) => s.focusedId);

  const running = new Set(
    windows.filter((w) => !w.minimized).map((w) => w.appId),
  );

  return (
    <>
      {/* Desktop: Left-side Vertical Dock */}
      <aside
        aria-label="Application dock"
        className="pointer-events-auto fixed left-0 top-8 bottom-0 z-50 hidden md:flex w-18 md:w-20 flex-col items-center py-3.5 space-y-2 border-r border-white/10 bg-[#16171d]/90 backdrop-blur-xl shadow-[8px_0_30px_rgba(0,0,0,0.5)] select-none"
      >
        <div className="flex flex-col items-center gap-2.5 w-full px-2">
          {DOCK_ORDER.map((appId) => {
            const app = APPS[appId];
            const isRunning = running.has(appId);
            const isFocused = windows.find((w) => w.id === focusedId)?.appId === appId;

            return (
              <div key={appId} className="group relative flex w-full justify-center">
                <button
                  type="button"
                  onClick={() => openApp(appId)}
                  aria-label={app.dockLabel}
                  className={`relative flex h-14 w-14 md:h-15 md:w-15 items-center justify-center rounded-xl transition-all duration-200 hover:scale-108 hover:bg-white/12 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] ${
                    isFocused
                      ? "bg-white/15 shadow-md shadow-white/5 ring-1 ring-white/20"
                      : isRunning
                        ? "bg-white/5"
                        : "opacity-90 hover:opacity-100"
                  }`}
                >
                  <span className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center">
                    {ICONS[appId]}
                  </span>

                  {/* Active Indicator Dot on the Left edge */}
                  {isRunning && (
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#ff3366] shadow-[0_0_8px_#ff3366]" />
                  )}
                </button>

                {/* Tooltip popping to the RIGHT (inside screen) */}
                <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#1b1c24]/95 px-3 py-1.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-150">
                  {app.dockLabel}
                  {isRunning && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff3366]" />
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1 w-full" />

        {/* Show Apps / Ubuntu Launcher Button at Bottom */}
        <div className="group relative flex w-full justify-center px-2 pb-3.5">
          <button
            type="button"
            onClick={() => openApp("store")}
            aria-label="Show Applications"
            className="flex h-14 w-14 md:h-15 md:w-15 items-center justify-center rounded-xl transition-all duration-200 hover:scale-108 hover:bg-white/12 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]"
          >
            <UbuntuIcon />
          </button>
          <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:flex items-center rounded-xl border border-white/15 bg-[#1b1c24]/95 px-3 py-1.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md whitespace-nowrap z-50">
            Show Applications
          </span>
        </div>
      </aside>

      {/* Mobile: Bottom Floating Dock */}
      <nav
        aria-label="Application dock mobile"
        className="pointer-events-auto fixed bottom-2 left-1/2 -translate-x-1/2 z-50 flex md:hidden max-w-[calc(100dvw-1rem)] items-center gap-1 overflow-x-auto rounded-2xl border border-white/15 bg-[#16171d]/90 px-2 py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {DOCK_ORDER.map((appId) => {
          const app = APPS[appId];
          const isRunning = running.has(appId);
          const isFocused = windows.find((w) => w.id === focusedId && !w.minimized)?.appId === appId;
          return (
            <button
              key={appId}
              type="button"
              onClick={() => openApp(appId)}
              title={app.dockLabel}
              aria-label={app.dockLabel}
              className={`relative flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl transition-all active:scale-90 ${
                isFocused
                  ? "bg-white/20 ring-1 ring-white/30 shadow-md"
                  : isRunning
                    ? "bg-white/5"
                    : "hover:bg-white/10"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center">
                {ICONS[appId]}
              </span>
              <span
                className={`mt-0.5 h-1 w-1 rounded-full transition-opacity ${
                  isRunning ? "bg-[#ff3366] opacity-100 shadow-[0_0_6px_#ff3366]" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => openApp("store")}
          title="Show Applications"
          aria-label="Show Applications"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-90"
        >
          <UbuntuIcon />
        </button>
      </nav>
    </>
  );
}

function UbuntuIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#e95420" />
      <circle cx="24" cy="24" r="14.5" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="24" cy="9.5" r="3.2" fill="#fff" />
      <circle cx="11.5" cy="31" r="3.2" fill="#fff" />
      <circle cx="36.5" cy="31" r="3.2" fill="#fff" />
      <path d="M24 16v16" stroke="#e95420" strokeWidth="2.5" />
      <path d="M17 28l14-8" stroke="#e95420" strokeWidth="2.5" />
      <path d="M31 28l-14-8" stroke="#e95420" strokeWidth="2.5" />
    </svg>
  );
}

function LauncherIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="14" cy="14" r="4.5" fill="#ff3366" />
      <circle cx="24" cy="14" r="4.5" fill="#e8edf5" />
      <circle cx="34" cy="14" r="4.5" fill="#e8edf5" />
      <circle cx="14" cy="24" r="4.5" fill="#e8edf5" />
      <circle cx="24" cy="24" r="4.5" fill="#ff3366" />
      <circle cx="34" cy="24" r="4.5" fill="#e8edf5" />
      <circle cx="14" cy="34" r="4.5" fill="#e8edf5" />
      <circle cx="24" cy="34" r="4.5" fill="#e8edf5" />
      <circle cx="34" cy="34" r="4.5" fill="#ff3366" />
    </svg>
  );
}

function FilesIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden>
      <path d="M8 14h14l3 3h19v23H8V14z" fill="#9a9a9a" />
      <path d="M8 10h14l3 3h19v4H8v-7z" fill="#7cba3d" />
      <path d="M8 17h32v20H8V17z" fill="#c4c4c4" opacity="0.3" />
    </svg>
  );
}

function ChromeIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#fff" />
      <path d="M24 4a20 20 0 0 1 17.32 10H24V4z" fill="#ea4335" />
      <path d="M6.68 14A20 20 0 0 0 4 24a20 20 0 0 0 2.68 10h17.32L24 24 6.68 14z" fill="#34a853" />
      <path d="M41.32 34A20 20 0 0 0 44 24a20 20 0 0 0-2.68-10H24l8.66 15 8.66 5z" fill="#fbbc04" />
      <path d="M24 44a20 20 0 0 0 17.32-10H24V44z" fill="#ea4335" opacity="0" />
      <circle cx="24" cy="24" r="9" fill="#4285f4" />
      <circle cx="24" cy="24" r="6" fill="#fff" />
      <circle cx="24" cy="24" r="4.5" fill="#4285f4" />
    </svg>
  );
}

function VSCodeIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden>
      <path
        d="M6 6l28 18-28 18V6z"
        fill="#0065a9"
      />
      <path
        d="M18 6l24 18-24 18V6z"
        fill="#007acc"
      />
      <path
        d="M18 6l10 6.5L18 19V6z"
        fill="#1f9cf0"
      />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden>
      <rect x="6" y="8" width="36" height="32" rx="6" fill="#3d3d3d" />
      <path
        d="M14 20l6 4-6 4"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="22" y="27" width="12" height="2.5" rx="1" fill="#fff" />
    </svg>
  );
}

function AppCenterIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden>
      <path
        d="M10 14c0-2.2 1.8-4 4-4h20c2.2 0 4 1.8 4 4v22c0 2.2-1.8 4-4 4H14c-2.2 0-4-1.8-4-4V14z"
        fill="#3584e4"
      />
      <path
        d="M14 10h20l3 6H11l3-6z"
        fill="#62a0ea"
      />
      <text
        x="24"
        y="33"
        textAnchor="middle"
        fill="#fff"
        fontSize="16"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        A
      </text>
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="20" fill="#62a0ea" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fill="#fff"
        fontSize="22"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        ?
      </text>
    </svg>
  );
}


