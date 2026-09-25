import type { AppDefinition } from "@/lib/apps";

export const TOP_BAR = 32;
export const DOCK_MOBILE = 68;
export const DOCK_DESKTOP_WIDTH = 72;

export function getMaximizedInsets() {
  const { isMobile } = getViewport();
  return {
    top: TOP_BAR,
    left: isMobile ? 0 : DOCK_DESKTOP_WIDTH,
    right: 0,
    bottom: isMobile ? DOCK_MOBILE : 0,
  };
}

export type ViewportInfo = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
};

export function getViewport(): ViewportInfo {
  if (typeof window === "undefined") {
    return { width: 1280, height: 800, isMobile: false, isTablet: false };
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    width,
    height,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
  };
}

export function getWindowLayout(app: AppDefinition) {
  const { width: vw, height: vh, isMobile, isTablet } = getViewport();
  const pad = isMobile ? 6 : 16;
  const leftPad = isMobile ? pad : DOCK_DESKTOP_WIDTH + pad;
  const maxW = vw - leftPad - pad;
  const maxH = vh - TOP_BAR - (isMobile ? DOCK_MOBILE : pad * 2);

  if (isMobile) {
    return {
      x: pad,
      y: TOP_BAR + pad / 2,
      width: maxW,
      height: maxH,
      maximized: false,
    };
  }

  const defaultW = isTablet
    ? Math.min(app.defaultSize.width, maxW * 0.95)
    : Math.min(app.defaultSize.width, maxW);
  const defaultH = isTablet
    ? Math.min(app.defaultSize.height, maxH * 0.85)
    : Math.min(app.defaultSize.height, maxH);

  const width = Math.min(Math.max(defaultW, app.minSize.width), maxW);
  const height = Math.min(Math.max(defaultH, app.minSize.height), maxH);
  const x = Math.max(leftPad, Math.round(leftPad + (vw - leftPad - width) / 2 - pad));
  const y = Math.max(TOP_BAR + pad / 2, Math.round((vh - height) / 2 - 8));

  return { x, y, width, height, maximized: false };
}

export function clampWindowPosition(
  winWidth: number,
  winHeight: number,
  x: number,
  y: number,
) {
  const { width: vw, height: vh, isMobile } = getViewport();
  const pad = isMobile ? 6 : 12;
  const minX = isMobile ? pad : DOCK_DESKTOP_WIDTH + pad;
  const maxX = vw - winWidth - pad;
  const maxY = vh - winHeight - (isMobile ? DOCK_MOBILE : pad);

  return {
    x: Math.min(Math.max(minX, x), Math.max(minX, maxX)),
    y: Math.min(Math.max(TOP_BAR, y), Math.max(TOP_BAR, maxY)),
  };
}

export function clampWindowSize(
  x: number,
  y: number,
  width: number,
  height: number,
  minWidth: number,
  minHeight: number,
) {
  const { width: vw, height: vh, isMobile } = getViewport();
  const pad = isMobile ? 6 : 12;
  const maxW = vw - x - pad;
  const maxH = vh - y - (isMobile ? DOCK_MOBILE : pad);

  const w = Math.min(Math.max(width, minWidth), Math.max(minWidth, maxW));
  const h = Math.min(Math.max(height, minHeight), Math.max(minHeight, maxH));
  const pos = clampWindowPosition(w, h, x, y);

  return { x: pos.x, y: pos.y, width: w, height: h };
}

