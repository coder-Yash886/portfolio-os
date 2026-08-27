"use client";

import { useRef } from "react";
import { useIsMobile } from "@/hooks/useMedia";
import type { WindowState } from "@/store/desktopStore";
import { useDesktopStore } from "@/store/desktopStore";

type Props = {
  window: WindowState;
  children: React.ReactNode;
};

export function WindowFrame({ window: win, children }: Props) {
  const isMobile = useIsMobile();
  const focusWindow = useDesktopStore((s) => s.focusWindow);
  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);
  const toggleMaximize = useDesktopStore((s) => s.toggleMaximize);
  const moveWindow = useDesktopStore((s) => s.moveWindow);
  const focusedId = useDesktopStore((s) => s.focusedId);

  const dragRef = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(
    null,
  );

  const isFocused = focusedId === win.id;
  const isFullscreen = win.maximized || isMobile;

  const style: React.CSSProperties = isFullscreen
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: win.zIndex,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  function onPointerDownTitle(e: React.PointerEvent) {
    if (isFullscreen || isMobile) return;
    if ((e.target as HTMLElement).closest("button")) return;
    focusWindow(win.id);
    dragRef.current = {
      ox: e.clientX,
      oy: e.clientY,
      sx: win.x,
      sy: win.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMoveTitle(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.ox;
    const dy = e.clientY - dragRef.current.oy;
    moveWindow(win.id, dragRef.current.sx + dx, dragRef.current.sy + dy);
  }

  function onPointerUpTitle() {
    dragRef.current = null;
  }

  return (
    <section
      role="dialog"
      aria-label={win.title}
      onMouseDown={() => focusWindow(win.id)}
      className={`pointer-events-auto absolute flex flex-col overflow-hidden shadow-2xl transition-[box-shadow] ${
        isMobile ? "rounded-lg" : "rounded-xl"
      } border ${
        isFocused
          ? "border-[color:var(--accent)]/25 shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
          : "border-[color:var(--border-subtle)] opacity-[0.97]"
      } bg-[color:var(--window)]`}
      style={style}
    >
      <header
        onPointerDown={onPointerDownTitle}
        onPointerMove={onPointerMoveTitle}
        onPointerUp={onPointerUpTitle}
        className={`flex shrink-0 items-center justify-between border-b border-[color:var(--border-subtle)] bg-[color:var(--window-title)] px-2 sm:px-3 ${
          isMobile ? "h-9 cursor-default" : "h-10 cursor-grab active:cursor-grabbing"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-white/90 sm:text-sm">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent)]" />
          <span className="truncate">{win.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {!isMobile && (
            <button
              type="button"
              aria-label="Minimize"
              onClick={() => minimizeWindow(win.id)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-white/70 hover:bg-white/10 sm:h-7 sm:w-7"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect y="5" width="12" height="2" rx="1" />
              </svg>
            </button>
          )}
          {!isMobile && (
            <button
              type="button"
              aria-label="Maximize"
              onClick={() => toggleMaximize(win.id)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-white/70 hover:bg-white/10 sm:h-7 sm:w-7"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" />
              </svg>
            </button>
          )}
          <button
            type="button"
            aria-label="Close"
            onClick={() => closeWindow(win.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/70 hover:bg-red-500/80 hover:text-white sm:h-7 sm:w-7"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M2 2l8 8M10 2L2 10" />
            </svg>
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto text-[color:var(--window-fg)]">
        {children}
      </div>
    </section>
  );
}
