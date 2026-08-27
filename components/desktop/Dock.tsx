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

  const running = new Set(
    windows.filter((w) => !w.minimized).map((w) => w.appId),
  );

  return (
    <nav
      aria-label="Application dock"
      className="pointer-events-auto absolute bottom-2 left-1/2 z-50 flex max-w-[calc(100dvw-0.75rem)] -translate-x-1/2 items-end gap-1 overflow-x-auto rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--dock)] px-1.5 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:bottom-4 sm:gap-1.5 sm:px-2.5 sm:py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      {DOCK_ORDER.map((appId) => {
        const app = APPS[appId];
        const isRunning = running.has(appId);
        return (
          <button
            key={appId}
            type="button"
            onClick={() => openApp(appId)}
            title={app.dockLabel}
            className="group relative flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)] sm:h-12 sm:w-12 sm:hover:-translate-y-1.5"
          >
            <span className="flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9">
              {ICONS[appId]}
            </span>
            <span
              className={`mt-0.5 h-1 w-1 rounded-full transition-opacity ${
                isRunning ? "bg-[#62a0ea] opacity-100" : "opacity-0"
              }`}
            />
            <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-0.5 text-[11px] text-white group-hover:block">
              {app.dockLabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function FilesIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden>
      <path d="M8 14h14l3 3h19v23H8V14z" fill="#9a9a9a" />
      <path d="M8 10h14l3 3h19v4H8v-7z" fill="#7cba3d" />
      <path d="M8 17h32v20H8V17z" fill="#c4c4c4" opacity="0.3" />
    </svg>
  );
}

function ChromeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden>
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
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden>
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
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden>
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
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden>
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
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden>
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
