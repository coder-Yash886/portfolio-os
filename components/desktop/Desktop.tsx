"use client";

import { useEffect } from "react";
import { Dock } from "@/components/desktop/Dock";
import { TopBar } from "@/components/desktop/TopBar";
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
    <div className="desktop-root relative h-dvh w-full overflow-hidden select-none">
      <div className="desktop-wallpaper absolute inset-0" aria-hidden />
      <div className="desktop-grain absolute inset-0 opacity-[0.35]" aria-hidden />

      <TopBar />

      <main className="absolute inset-0 pt-8 pb-24">
        <div className="pointer-events-none absolute left-8 top-16 max-w-sm">
          <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white/90 drop-shadow-lg md:text-5xl">
            {profile.name}
          </p>
          <p className="mt-2 text-sm text-white/65 drop-shadow md:text-base">
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

      <Dock />
    </div>
  );
}
