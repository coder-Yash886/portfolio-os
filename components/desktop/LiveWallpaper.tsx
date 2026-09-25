"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { wallpaper } from "@/lib/wallpaper";

export function LiveWallpaper() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Video playback
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

  // Atmospheric rain & neon particle overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wallpaper.rainOverlay) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const dropCount = Math.min(80, Math.floor(width / 16));
    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 22 + 10,
      speed: Math.random() * 8 + 12,
      opacity: Math.random() * 0.4 + 0.15,
      width: Math.random() * 1.2 + 0.6,
      color: Math.random() > 0.6 ? "rgba(100, 230, 255, " : "rgba(255, 120, 160, ",
    }));

    // Splashes for ground puddles
    const splashes: { x: number; y: number; r: number; maxR: number; opacity: number }[] = [];

    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Draw raindrops
      for (const d of drops) {
        d.y += d.speed * (dt * 60);
        d.x += d.speed * 0.15 * (dt * 60); // subtle wind angle

        if (d.y > height) {
          // Trigger splash occasionally near bottom
          if (Math.random() < 0.25) {
            splashes.push({
              x: d.x,
              y: height - Math.random() * 80,
              r: 1,
              maxR: Math.random() * 10 + 6,
              opacity: 0.5,
            });
          }
          d.y = -d.length;
          d.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 2, d.y + d.length);
        ctx.strokeStyle = `${d.color}${d.opacity})`;
        ctx.lineWidth = d.width;
        ctx.stroke();
      }

      // Draw puddle splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.r += 0.8;
        s.opacity -= 0.035;

        if (s.opacity <= 0 || s.r >= s.maxR) {
          splashes.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r * 1.8, s.r * 0.7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 230, 255, ${s.opacity * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
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
        onCanPlay={() => setReady(true)}
        onLoadedData={() => setReady(true)}
      >
        <source src={wallpaper.videoUrl} type="video/mp4" />
      </video>

      {/* Atmospheric rain overlay */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full opacity-85"
      />
    </div>
  );
}

