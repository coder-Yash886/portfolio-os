export type WallpaperPreset = {
  id: string;
  name: string;
  videoUrl: string;
  poster: string;
  dominantColor: string;
  focusX: string;
  focusY: string;
  rainOverlay: boolean;
};

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: "tokyo-night-gtr",
    name: "Tokyo Neon GT-R (Anime Aesthetic Rain)",
    videoUrl: "/wallpaper/tokyo-night.mp4",
    poster: "/wallpaper/tokyo-night.jpg",
    dominantColor: "#08090f",
    focusX: "50%",
    focusY: "50%",
    rainOverlay: true,
  },
  {
    id: "garage-night",
    name: "Retro Garage GT-R (Neon Glow)",
    videoUrl: "/wallpaper/tokyo-night.mp4",
    poster: "/wallpaper/garage-night.jpg",
    dominantColor: "#12090b",
    focusX: "50%",
    focusY: "50%",
    rainOverlay: true,
  },
  {
    id: "porsche-night",
    name: "Porsche 911 (Moody Red Dusk)",
    videoUrl: "/wallpaper/live-wallpaper.mp4",
    poster: "/wallpaper/live-poster.jpg",
    dominantColor: "#09090d",
    focusX: "50%",
    focusY: "50%",
    rainOverlay: true,
  },
];

/** Live wallpaper — dynamic aesthetic Tokyo night loop */
export const wallpaper = WALLPAPER_PRESETS[0];


