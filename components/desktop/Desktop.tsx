"use client";

import { useEffect } from "react";
import { Dock } from "@/components/desktop/Dock";
import { LiveWallpaper } from "@/components/desktop/LiveWallpaper";
import { TopBar } from "@/components/desktop/TopBar";
import { WindowTabs } from "@/components/desktop/WindowTabs";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { AppContent } from "@/components/apps/AppContent";
import { useDesktopStore } from "@/store/desktopStore";
import { profile } from "@/data/profile";

export function Desktop() {
  const windows = useDesktopStore((s) => s.windows);
  const openApp = useDesktopStore((s) => s.openApp);

  useEffect(() => {
    openApp("files");
  }, [openApp]);

  return (
    <div className="desktop-root relative h-dvh w-full max-w-[100dvw] overflow-hidden select-none">
      <LiveWallpaper />
      <div className="desktop-vignette absolute inset-0" aria-hidden />
      <div className="desktop-grain absolute inset-0 opacity-[0.28]" aria-hidden />

      <TopBar />

      <main className="desktop-workspace absolute inset-0 pt-8">
        <div className="pointer-events-none absolute left-4 top-12 max-w-[min(100%,280px)] sm:left-8 sm:top-16 sm:max-w-sm">
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white/90 drop-shadow-lg sm:text-4xl md:text-5xl">
            {profile.name}
          </p>
          <p className="mt-1 text-xs text-white/65 drop-shadow sm:mt-2 sm:text-sm md:text-base">
            {profile.tagline}
          </p>
        </div>

        {windows.map((win) =>
          win.minimized ? null : (
            <WindowFrame key={win.id} window={win}>
              <AppContent appId={win.appId} />
            </WindowFrame>
          ),
        )}
      </main>

      <WindowTabs />
      <Dock />
    </div>
  );
}
