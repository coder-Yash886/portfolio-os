import type { AppDefinition } from "@/lib/apps";

export const TOP_BAR = 32;
export const DOCK_MOBILE = 130;
export const DOCK_DESKTOP = 110;

export function getMaximizedInsets() {
  const { isMobile } = getViewport();
  return {
    top: TOP_BAR,
    left: 0,
    right: 0,
    bottom: isMobile ? DOCK_MOBILE : DOCK_DESKTOP,
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
  const pad = isMobile ? 6 : 12;
  const dock = isMobile ? DOCK_MOBILE : DOCK_DESKTOP;
  const maxW = vw - pad * 2;
  const maxH = vh - TOP_BAR - dock - pad;

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
    ? Math.min(app.defaultSize.width, vw * 0.92)
    : app.defaultSize.width;
  const defaultH = isTablet
    ? Math.min(app.defaultSize.height, vh * 0.78)
    : app.defaultSize.height;

  const width = Math.min(Math.max(defaultW, app.minSize.width), maxW);
  const height = Math.min(Math.max(defaultH, app.minSize.height), maxH);
  const x = Math.max(pad, Math.round((vw - width) / 2));
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
  const dock = isMobile ? DOCK_MOBILE : DOCK_DESKTOP;
  const maxX = vw - winWidth - pad;
  const maxY = vh - winHeight - dock;

  return {
    x: Math.min(Math.max(pad, x), Math.max(pad, maxX)),
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
  const dock = isMobile ? DOCK_MOBILE : DOCK_DESKTOP;
  const maxW = vw - x - pad;
  const maxH = vh - y - dock;

  const w = Math.min(Math.max(width, minWidth), Math.max(minWidth, maxW));
  const h = Math.min(Math.max(height, minHeight), Math.max(minHeight, maxH));
  const pos = clampWindowPosition(w, h, x, y);

  return { x: pos.x, y: pos.y, width: w, height: h };
}
