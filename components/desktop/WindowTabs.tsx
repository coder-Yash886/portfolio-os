"use client";

import { useMemo } from "react";
import { useDesktopStore } from "@/store/desktopStore";

export function WindowTabs() {
  const allWindows = useDesktopStore((s) => s.windows);
  const windows = useMemo(
    () => allWindows.filter((w) => !w.minimized),
    [allWindows],
  );
  const focusedId = useDesktopStore((s) => s.focusedId);
  const focusWindow = useDesktopStore((s) => s.focusWindow);
  const closeWindow = useDesktopStore((s) => s.closeWindow);

  if (windows.length === 0) return null;

  return (
    <div
      className="pointer-events-auto absolute inset-x-0 z-50 flex justify-center px-2"
      style={{ bottom: "calc(4.25rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div
        className="flex max-w-[calc(100dvw-0.5rem)] gap-1.5 overflow-x-auto rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--dock)] p-1.5 shadow-lg backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-w-2xl sm:gap-2 sm:p-2"
        role="tablist"
        aria-label="Open windows"
      >
        {windows.map((win) => {
          const isActive = win.id === focusedId;
          return (
            <div
              key={win.id}
              role="tab"
              aria-selected={isActive}
              className={`flex shrink-0 items-center gap-1 rounded-xl border pl-2.5 pr-1 py-1 transition-colors sm:pl-3 sm:pr-1.5 sm:py-1.5 ${
                isActive
                  ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/15"
                  : "border-transparent bg-white/5"
              }`}
            >
              <button
                type="button"
                onClick={() => focusWindow(win.id)}
                className="max-w-[120px] truncate text-xs font-medium text-white/90 sm:max-w-[160px] sm:text-sm"
              >
                {win.title}
              </button>
              <button
                type="button"
                aria-label={`Close ${win.title}`}
                onClick={() => closeWindow(win.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-red-500/80 hover:text-white sm:h-6 sm:w-6"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <path d="M2 2l8 8M10 2L2 10" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
