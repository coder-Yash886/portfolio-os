"use client";

import { useState } from "react";
import type { AppId } from "@/lib/apps";
import { profile } from "@/data/profile";

const FILE_SECTIONS = ["About Me", "Projects", "Experience", "Contact"] as const;

type Props = {
  appId: AppId;
};

export function AppContent({ appId }: Props) {
  switch (appId) {
    case "files":
      return <FilesApp />;
    case "terminal":
      return <TerminalApp />;
    case "about-portfolio":
      return <AboutApp />;
    default:
      return (
        <div className="flex h-full min-h-[200px] items-center justify-center p-4 text-center text-white/60 sm:p-8">
          <div>
            <p className="text-base font-medium text-white/85 sm:text-lg">{appId}</p>
            <p className="mt-2 text-sm">Coming in the next commit.</p>
          </div>
        </div>
      );
  }
}

function FilesApp() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <aside className="shrink-0 border-b border-[color:var(--border-subtle)] bg-black/25 md:w-52 md:border-b-0 md:border-r">
        <p className="hidden px-3 pt-3 text-[11px] font-semibold uppercase tracking-wider text-white/45 md:block">
          Sections
        </p>
        <nav
          className="flex gap-1 overflow-x-auto p-2 md:mt-2 md:flex-col md:overflow-x-visible md:p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Portfolio sections"
        >
          {FILE_SECTIONS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-lg px-3 py-2 text-left text-xs transition-colors sm:text-sm md:w-full ${
                i === active
                  ? "bg-[color:var(--accent)] font-medium text-[color:var(--accent-fg)]"
                  : "text-white/75 hover:bg-white/8"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <a
          href={profile.resumeUrl}
          className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-3 py-2 text-xs font-semibold text-[color:var(--accent-fg)] transition-opacity hover:opacity-90 sm:text-sm md:mx-3 md:mb-3 md:py-2.5"
        >
          Download Resume
        </a>
      </aside>
      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {FILE_SECTIONS[active]}
        </h1>
        {active === 0 ? (
          <>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-[15px]">
              {profile.bio}
            </p>
            <div className="mt-4 space-y-2 text-xs text-white/70 sm:mt-6 sm:text-sm">
              <p className="break-all">
                <span className="text-white/45">GitHub · </span>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--accent)] hover:underline"
                >
                  {profile.githubHandle}
                </a>
              </p>
              <p className="break-all">
                <span className="text-white/45">Email · </span>
                {profile.email}
              </p>
            </div>
            <div className="mt-6 sm:mt-8">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-white/45 sm:text-sm">
                Ideas I work by
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-white/75 sm:text-[15px]">
                {profile.beliefs.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-[color:var(--accent)]">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-white/60 sm:text-[15px]">
            {FILE_SECTIONS[active]} content — coming soon.
          </p>
        )}
      </div>
    </div>
  );
}

function TerminalApp() {
  const host = profile.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="h-full min-h-[180px] overflow-x-auto bg-[#0b1220] p-3 font-[family-name:var(--font-mono)] text-xs leading-6 text-[#7dd3c7] sm:p-4 sm:text-sm">
      <p className="whitespace-pre-wrap break-all">
        <span className="text-white/50">guest@{host}-os</span>
        <span className="text-white/30">:</span>
        <span className="text-[#93c5fd]">~</span>
        <span className="text-white/50">$ </span>
        whoami
      </p>
      <p className="text-white/80">{profile.fullName}</p>
      <p className="mt-2 whitespace-pre-wrap break-all">
        <span className="text-white/50">guest@{host}-os</span>
        <span className="text-white/30">:</span>
        <span className="text-[#93c5fd]">~</span>
        <span className="text-white/50">$ </span>
        echo &quot;{profile.tagline}&quot;
      </p>
      <p className="text-white/80">{profile.tagline}</p>
      <p className="mt-2 whitespace-pre-wrap break-all">
        <span className="text-white/50">guest@{host}-os</span>
        <span className="text-white/30">:</span>
        <span className="text-[#93c5fd]">~</span>
        <span className="text-white/50">$ </span>
        ls projects/
      </p>
      <p className="text-white/70">portfolio-os  web-apps  experiments</p>
      <p className="mt-2 animate-pulse text-white/50">█</p>
    </div>
  );
}

function AboutApp() {
  return (
    <div className="flex h-full min-h-[160px] flex-col items-start justify-center gap-2 p-4 sm:gap-3 sm:p-8">
      <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-white sm:text-2xl">
        Portfolio OS
      </p>
      <p className="max-w-md text-sm leading-relaxed text-white/70">
        An interactive desktop-style portfolio. Open apps from the dock, drag
        windows, and explore — built fresh for {profile.name}.
      </p>
      <p className="text-xs text-white/40">Responsive on all devices</p>
    </div>
  );
}
