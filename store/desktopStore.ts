"use client";

import { create } from "zustand";
import { APPS, type AppId } from "@/lib/apps";
import {
  clampWindowPosition,
  clampWindowSize,
  getWindowLayout,
} from "@/lib/windowLayout";

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
  restoreBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
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

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: [],
  focusedId: null,
  nextZ: 10,

  openApp: (appId) => {
    const existing = get().windows.find(
      (w) => w.appId === appId && !w.minimized,
    );
    if (existing) {
      if (get().focusedId === existing.id) {
        get().closeWindow(existing.id);
      } else {
        get().focusWindow(existing.id);
      }
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
    const layout = getWindowLayout(app);
    const id = `${appId}-${Date.now()}`;
    const zIndex = get().nextZ;

    set((state) => ({
      windows: [
        ...state.windows,
        {
          id,
          appId,
          title: app.title,
          x: layout.x,
          y: layout.y,
          width: layout.width,
          height: layout.height,
          minimized: false,
          maximized: layout.maximized,
          zIndex,
          restoreBounds: null,
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
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;

        if (!w.maximized) {
          return {
            ...w,
            maximized: true,
            minimized: false,
            restoreBounds: {
              x: w.x,
              y: w.y,
              width: w.width,
              height: w.height,
            },
          };
        }

        const restore = w.restoreBounds;
        return {
          ...w,
          maximized: false,
          minimized: false,
          x: restore?.x ?? w.x,
          y: restore?.y ?? w.y,
          width: restore?.width ?? w.width,
          height: restore?.height ?? w.height,
          restoreBounds: null,
        };
      }),
      focusedId: id,
    })),

  moveWindow: (id, x, y) =>
    set((state) => {
      const win = state.windows.find((w) => w.id === id);
      if (!win || win.maximized) return state;
      const pos = clampWindowPosition(win.width, win.height, x, y);
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, x: pos.x, y: pos.y } : w,
        ),
      };
    }),

  resizeWindow: (id, width, height) =>
    set((state) => {
      const win = state.windows.find((w) => w.id === id);
      if (!win || win.maximized) return state;
      const app = APPS[win.appId];
      const bounds = clampWindowSize(
        win.x,
        win.y,
        width,
        height,
        app.minSize.width,
        app.minSize.height,
      );
      return {
        windows: state.windows.map((w) =>
          w.id === id
            ? {
                ...w,
                x: bounds.x,
                y: bounds.y,
                width: bounds.width,
                height: bounds.height,
              }
            : w,
        ),
      };
    }),
}));
