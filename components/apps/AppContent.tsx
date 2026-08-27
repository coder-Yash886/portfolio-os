"use client";

import type { AppId } from "@/lib/apps";
import { profile } from "@/data/profile";

type Props = {
  appId: AppId;
};

export function AppContent({ appId }: Props) {
  switch (appId) {
    case "files":
      return <FilesPlaceholder />;
    case "terminal":
      return <TerminalPlaceholder />;
    case "about-portfolio":
      return <AboutPlaceholder />;
    default:
      return (
        <div className="flex h-full items-center justify-center p-8 text-center text-white/60">
          <div>
            <p className="text-lg font-medium text-white/85">{appId}</p>
            <p className="mt-2 text-sm">Coming in the next commit.</p>
          </div>
        </div>
      );
  }
}

function FilesPlaceholder() {
  return (
    <div className="flex h-full">
      <aside className="flex w-52 shrink-0 flex-col border-r border-white/8 bg-black/25 p-3">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-white/45">
          Sections
        </p>
        <nav className="mt-2 flex flex-col gap-1">
          {["About Me", "Projects", "Experience", "Contact"].map((label, i) => (
            <button
              key={label}
              type="button"
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                i === 0
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
          className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-3 py-2.5 text-sm font-semibold text-[color:var(--accent-fg)] transition-opacity hover:opacity-90"
        >
          Download Resume
        </a>
      </aside>
      <div className="flex-1 overflow-auto p-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white">
          About Me
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
          {profile.bio}
        </p>
        <div className="mt-6 space-y-2 text-sm text-white/70">
          <p>
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
          <p>
            <span className="text-white/45">Email · </span>
            {profile.email}
          </p>
        </div>
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45">
            Ideas I work by
          </h2>
          <ul className="mt-3 space-y-2 text-[15px] text-white/75">
            {profile.beliefs.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[color:var(--accent)]">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TerminalPlaceholder() {
  return (
    <div className="h-full bg-[#0b1220] p-4 font-[family-name:var(--font-mono)] text-sm leading-6 text-[#7dd3c7]">
      <p>
        <span className="text-white/50">guest@{profile.name.toLowerCase()}-os</span>
        <span className="text-white/30">:</span>
        <span className="text-[#93c5fd]">~</span>
        <span className="text-white/50">$ </span>
        whoami
      </p>
      <p className="text-white/80">{profile.fullName}</p>
      <p className="mt-2">
        <span className="text-white/50">guest@{profile.name.toLowerCase()}-os</span>
        <span className="text-white/30">:</span>
        <span className="text-[#93c5fd]">~</span>
        <span className="text-white/50">$ </span>
        echo &quot;{profile.tagline}&quot;
      </p>
      <p className="text-white/80">{profile.tagline}</p>
      <p className="mt-2 animate-pulse text-white/50">█</p>
    </div>
  );
}

function AboutPlaceholder() {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-3 p-8">
      <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
        Portfolio OS
      </p>
      <p className="max-w-md text-sm leading-relaxed text-white/70">
        An interactive desktop-style portfolio. Open apps from the dock, drag
        windows, and explore — built fresh for {profile.name}, not a clone of
        anyone else&apos;s site.
      </p>
      <p className="text-xs text-white/40">Step 1 foundation · more apps soon</p>
    </div>
  );
}
