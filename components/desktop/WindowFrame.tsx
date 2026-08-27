"use client";

import { useRef } from "react";
import { useIsMobile } from "@/hooks/useMedia";
import { APPS } from "@/lib/apps";
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
  const resizeWindow = useDesktopStore((s) => s.resizeWindow);
  const focusedId = useDesktopStore((s) => s.focusedId);

  const dragRef = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(
    null,
  );

  const isFocused = focusedId === win.id;
  const isMaximized = win.maximized && !isMobile;

  const style: React.CSSProperties = isMaximized
    ? {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: "auto",
        height: "auto",
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
    if (isMaximized || isMobile) return;
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

  function onResizePointerDown(e: React.PointerEvent) {
    if (isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    const start = { ox: e.clientX, oy: e.clientY, sw: win.width, sh: win.height };

    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - start.ox;
      const dy = ev.clientY - start.oy;
      resizeWindow(win.id, start.sw + dx, start.sh + dy);
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const minSize = APPS[win.appId].minSize;

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
        className={`relative z-10 flex shrink-0 items-center justify-between border-b border-[color:var(--border-subtle)] bg-[color:var(--window-title)] px-2 sm:px-3 ${
          isMobile ? "h-11 cursor-default" : "h-10 cursor-grab active:cursor-grabbing"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-white/90 sm:text-sm">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent)]" />
          <span className="truncate">{win.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-black/20 p-0.5 sm:gap-1">
          {!isMobile && (
            <button
              type="button"
              aria-label="Minimize"
              onClick={() => minimizeWindow(win.id)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-white/80 hover:bg-white/15"
            >
              <MinimizeIcon />
            </button>
          )}
          {!isMobile && (
            <button
              type="button"
              aria-label={isMaximized ? "Restore" : "Maximize"}
              onClick={() => toggleMaximize(win.id)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-white/80 hover:bg-white/15"
            >
              {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
            </button>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={() => closeWindow(win.id)}
              className="mr-1 flex h-8 items-center justify-center rounded-lg bg-red-500/90 px-3 text-xs font-semibold text-white hover:bg-red-500"
            >
              Close
            </button>
          )}
          <button
            type="button"
            aria-label="Close"
            onClick={() => closeWindow(win.id)}
            className={`flex items-center justify-center rounded-md text-white/80 hover:bg-red-500/80 hover:text-white ${
              isMobile ? "h-9 w-9" : "h-7 w-7"
            }`}
          >
            <CloseIcon />
          </button>
        </div>
      </header>
      <div className="relative min-h-0 flex-1 overflow-auto text-[color:var(--window-fg)]">
        {children}
      </div>
      {!isMaximized && !isMobile && (
        <div
          role="separator"
          aria-label="Resize window"
          onPointerDown={onResizePointerDown}
          className="absolute right-0 bottom-0 z-20 h-5 w-5 cursor-se-resize touch-none"
          title={`Drag to resize (min ${minSize.width}×${minSize.height})`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="absolute right-1 bottom-1 text-white/35"
            aria-hidden
          >
            <path
              d="M12 12H8V10H10V8H12V12ZM12 8H10V6H8V4H10V6H12V8ZM8 8H6V6H8V8Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </section>
  );
}

function MinimizeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <rect y="5" width="12" height="2" rx="1" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="1.5" y="1.5" width="9" height="9" rx="1" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="3" y="1.5" width="7" height="7" rx="0.75" />
      <rect x="1.5" y="3.5" width="7" height="7" rx="0.75" fill="var(--window-title)" />
      <rect x="1.5" y="3.5" width="7" height="7" rx="0.75" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M2 2l8 8M10 2L2 10" />
    </svg>
  );
}
