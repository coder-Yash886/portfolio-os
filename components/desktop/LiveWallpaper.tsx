"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Hls from "hls.js";
import { wallpaper } from "@/lib/wallpaper";

export function LiveWallpaper() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const markReady = () => setReady(true);

    const tryPlay = () => {
      markReady();
      video.play().catch(() => markReady());
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = wallpaper.hlsUrl;
      video.addEventListener("loadeddata", tryPlay, { once: true });
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, maxBufferLength: 30 });
      hls.loadSource(wallpaper.hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) markReady();
      });
      return () => hls?.destroy();
    }

    markReady();
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
