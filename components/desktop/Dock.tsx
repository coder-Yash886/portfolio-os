"use client";

import type { ReactNode } from "react";
import { DOCK_ORDER, APPS, type AppId } from "@/lib/apps";
import { useDesktopStore } from "@/store/desktopStore";

const ICONS: Record<AppId, ReactNode> = {
  files: <FolderIcon />,
  browser: <BrowserIcon />,
  editor: <CodeIcon />,
  terminal: <TerminalIcon />,
  store: <StoreIcon />,
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
      className="pointer-events-auto absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-end gap-1.5 rounded-2xl border border-white/10 bg-[color:var(--dock)] px-2.5 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
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
            className="group relative flex h-12 w-12 flex-col items-center justify-center rounded-xl transition-transform duration-200 hover:-translate-y-1.5 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-white/15 to-white/5 text-[color:var(--dock-icon)] shadow-inner">
              {ICONS[appId]}
            </span>
            <span
              className={`mt-1 h-1 w-1 rounded-full transition-opacity ${
                isRunning ? "bg-[color:var(--accent)] opacity-100" : "opacity-0"
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

function FolderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l1.5 2H18.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z" />
    </svg>
  );
}

function BrowserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13ZM6 7v1.5h12V7H6Zm0 3.5V18h12v-7.5H6Z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m8.2 7.2 1.4 1.4L6.8 12l2.8 3.4-1.4 1.4L4 12l4.2-4.8Zm7.6 0L20 12l-4.2 4.8-1.4-1.4 2.8-3.4-2.8-3.4 1.4-1.4ZM13.2 6l-2.2 12h-1.6l2.2-12h1.6Z" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13Zm3.2 3.3 3.3 2.7-3.3 2.7 1.2 1.5 5-4.2-5-4.2-1.2 1.5ZM12 16h5v2h-5v-2Z" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 3h10l1.5 4.5V8a4 4 0 0 1-8 0 4 4 0 0 1-8 0V7.5L7 3Zm-2 7.1a5.9 5.9 0 0 0 5 0 5.9 5.9 0 0 0 5 0V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8.9Z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 13.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm0-9.4c-2 0-3.4 1.2-3.4 3h1.7c0-.8.6-1.4 1.7-1.4 1 0 1.6.5 1.6 1.3 0 .7-.3 1.1-1.3 1.7-.1.1-1.5.8-1.5 2.3v.4h1.7v-.3c0-.7.3-1.1 1.3-1.7 1.3-.8 2.1-1.7 2.1-3.2 0-2-1.6-3.1-3.9-3.1Z" />
    </svg>
  );
}
