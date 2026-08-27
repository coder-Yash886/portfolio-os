export type AppId =
  | "files"
  | "browser"
  | "editor"
  | "terminal"
  | "store"
  | "about-portfolio";

export type AppDefinition = {
  id: AppId;
  title: string;
  dockLabel: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
};

export const APPS: Record<AppId, AppDefinition> = {
  files: {
    id: "files",
    title: "Files",
    dockLabel: "Files",
    defaultSize: { width: 920, height: 580 },
    minSize: { width: 640, height: 420 },
  },
  browser: {
    id: "browser",
    title: "Browser",
    dockLabel: "Browser",
    defaultSize: { width: 980, height: 640 },
    minSize: { width: 720, height: 480 },
  },
  editor: {
    id: "editor",
    title: "Code",
    dockLabel: "Code",
    defaultSize: { width: 1000, height: 640 },
    minSize: { width: 720, height: 480 },
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    dockLabel: "Terminal",
    defaultSize: { width: 720, height: 440 },
    minSize: { width: 480, height: 280 },
  },
  store: {
    id: "store",
    title: "App Library",
    dockLabel: "Apps",
    defaultSize: { width: 860, height: 560 },
    minSize: { width: 640, height: 420 },
  },
  "about-portfolio": {
    id: "about-portfolio",
    title: "About Portfolio OS",
    dockLabel: "About",
    defaultSize: { width: 520, height: 360 },
    minSize: { width: 400, height: 280 },
  },
};

export const DOCK_ORDER: AppId[] = [
  "files",
  "browser",
  "editor",
  "terminal",
  "store",
  "about-portfolio",
];
