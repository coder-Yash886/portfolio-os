"use client";

import { create } from "zustand";
import { APPS, type AppId } from "@/lib/apps";

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
};

type DesktopStore = {
  windows: WindowState[];
  focusedId: string | null;
  nextZ: number;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
};

function centeredPosition(width: number, height: number) {
  if (typeof window === "undefined") {
    return { x: 120, y: 80 };
  }
  const x = Math.max(72, Math.round((window.innerWidth - width) / 2));
  const y = Math.max(48, Math.round((window.innerHeight - height) / 2) - 24);
  return { x, y };
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: [],
  focusedId: null,
  nextZ: 10,

  openApp: (appId) => {
    const existing = get().windows.find(
      (w) => w.appId === appId && !w.minimized,
    );
    if (existing) {
      get().focusWindow(existing.id);
      return;
    }

    const minimized = get().windows.find(
      (w) => w.appId === appId && w.minimized,
    );
    if (minimized) {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === minimized.id
            ? { ...w, minimized: false, zIndex: state.nextZ }
            : w,
        ),
        focusedId: minimized.id,
        nextZ: state.nextZ + 1,
      }));
      return;
    }

    const app = APPS[appId];
    const { x, y } = centeredPosition(app.defaultSize.width, app.defaultSize.height);
    const id = `${appId}-${Date.now()}`;
    const zIndex = get().nextZ;

    set((state) => ({
      windows: [
        ...state.windows,
        {
          id,
          appId,
          title: app.title,
          x,
          y,
          width: app.defaultSize.width,
          height: app.defaultSize.height,
          minimized: false,
          maximized: false,
          zIndex,
        },
      ],
      focusedId: id,
      nextZ: zIndex + 1,
    }));
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      focusedId: state.focusedId === id ? null : state.focusedId,
    })),

  focusWindow: (id) => {
    const zIndex = get().nextZ;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex } : w,
      ),
      focusedId: id,
      nextZ: zIndex + 1,
    }));
  },

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w,
      ),
      focusedId: state.focusedId === id ? null : state.focusedId,
    })),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w,
      ),
      focusedId: id,
    })),

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  resizeWindow: (id, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width, height } : w,
      ),
    })),
}));
