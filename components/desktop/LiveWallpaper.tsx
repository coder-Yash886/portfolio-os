"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { wallpaper } from "@/lib/wallpaper";

export function LiveWallpaper() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const video = videoRef.current;
    if (!video) return;

    const markReady = () => setReady(true);

    const tryPlay = () => {
      markReady();
      video.play().catch(() => markReady());
    };

    video.src = wallpaper.videoUrl;
    video.addEventListener("loadeddata", tryPlay, { once: true });
    video.addEventListener("error", markReady, { once: true });

    if (video.readyState >= 2) tryPlay();

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("error", markReady);
    };
  }, []);

  const stageStyle: CSSProperties = {
    "--wallpaper-focus-x": wallpaper.focusX,
    "--wallpaper-focus-y": wallpaper.focusY,
  } as CSSProperties;

  return (
    <div className="wallpaper-stage absolute inset-0" style={stageStyle} aria-hidden>
      <img src={wallpaper.poster} alt="" className="wallpaper-poster" />
      <video
        ref={videoRef}
        className={`wallpaper-video ${ready ? "wallpaper-video--ready" : ""}`}
        poster={wallpaper.poster}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />
    </div>
  );
}
