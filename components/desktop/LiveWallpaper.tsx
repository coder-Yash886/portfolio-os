"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { wallpaper } from "@/lib/wallpaper";

export function LiveWallpaper() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [usePosterOnly, setUsePosterOnly] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setUsePosterOnly(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => setUsePosterOnly(true));
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = wallpaper.hlsUrl;
      video.addEventListener("loadeddata", tryPlay, { once: true });
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        maxBufferLength: 30,
      });
      hls.loadSource(wallpaper.hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setUsePosterOnly(true);
          hls.destroy();
        }
      });
      return () => hls.destroy();
    }

    setUsePosterOnly(true);
  }, []);

  if (usePosterOnly) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${wallpaper.poster})` }}
        aria-hidden
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover scale-[1.02]"
      poster={wallpaper.poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
    />
  );
}
