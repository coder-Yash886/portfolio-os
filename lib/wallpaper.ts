/** Live wallpaper from Pinterest pin — warm cinematic iPhone-style loop */
export const wallpaper = {
  /** HLS stream (live loop) */
  hlsUrl:
    "https://v1.pinimg.com/videos/iht/hls/70/e6/c4/70e6c42ab3b2fadcf5160f69deb56f9a.m3u8",
  poster: "/wallpaper/poster.jpg",
  /** Pin dominant tone — used for theme tokens */
  dominantColor: "#4b3b34",
  /** Focal point — keeps Spider-Man face/body in frame when cover fills screen */
  focusX: "72%",
  focusY: "28%",
  source: "https://pin.it/1TwQLwq6G",
} as const;
