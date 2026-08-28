"use client";

import { useRef, useState } from "react";
import type { AppId } from "@/lib/apps";
import { BrowserApp } from "@/components/apps/BrowserApp";
import { EditorApp } from "@/components/apps/EditorApp";
import { StoreApp } from "@/components/apps/StoreApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { profile } from "@/data/profile";

const FILE_SECTIONS = [
  "About Me",
  "Projects",
  "Experience",
  "Contributions",
  "Contact",
] as const;

type Props = {
  appId: AppId;
};

export function AppContent({ appId }: Props) {
  const content = (() => {
    switch (appId) {
      case "files":
        return <FilesApp />;
      case "browser":
        return <BrowserApp />;
      case "editor":
        return <EditorApp />;
      case "terminal":
        return <TerminalApp />;
      case "store":
        return <StoreApp />;
      case "about-portfolio":
        return <AboutApp />;
      default:
        return null;
    }
  })();

  return <div className="h-full w-full">{content}</div>;
}

function FilesApp() {
  const [active, setActive] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(208);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const savedSidebarWidth = useRef(208);
  const sidebarDrag = useRef<{ startX: number; startW: number } | null>(null);

  function toggleSidebar() {
    if (sidebarCollapsed) {
      setSidebarWidth(savedSidebarWidth.current);
      setSidebarCollapsed(false);
      return;
    }
    savedSidebarWidth.current = sidebarWidth;
    setSidebarCollapsed(true);
  }

  function onSidebarResizeStart(e: React.PointerEvent) {
    if (sidebarCollapsed) return;
    e.preventDefault();
    e.stopPropagation();
    sidebarDrag.current = { startX: e.clientX, startW: sidebarWidth };

    function onMove(ev: PointerEvent) {
      if (!sidebarDrag.current) return;
      const dx = ev.clientX - sidebarDrag.current.startX;
      const next = Math.min(320, Math.max(120, sidebarDrag.current.startW + dx));
      setSidebarWidth(next);
      savedSidebarWidth.current = next;
    }

    function onUp() {
      sidebarDrag.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div className="relative flex h-full w-full min-h-0 flex-col md:flex-row">
      <aside
        className={`files-sidebar relative hidden shrink-0 flex-col overflow-hidden border-b border-[color:var(--border-subtle)] md:flex md:border-b-0 md:border-r ${
          sidebarCollapsed ? "md:w-0 md:border-r-0" : ""
        }`}
        style={sidebarCollapsed ? undefined : { width: sidebarWidth }}
      >
        <div className="flex h-full flex-col" style={{ width: sidebarWidth }}>
          <p className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-wider text-white/45">
            Sections
          </p>
          <nav
            className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Portfolio sections"
          >
            {FILE_SECTIONS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setActive(i)}
                className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs transition-colors sm:text-sm ${
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
            download="Yash_Kumar_Resume.pdf"
            className="files-download-btn mx-3 mb-3 flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[color:var(--accent-fg)] sm:text-sm"
          >
            <DownloadIcon />
            Download Resume
          </a>
          <div
            role="separator"
            aria-label="Resize sidebar"
            onPointerDown={onSidebarResizeStart}
            className="absolute top-0 -right-1 z-10 hidden h-[calc(100%-3.5rem)] w-3 cursor-col-resize touch-none md:block"
          >
            <div className="absolute inset-y-0 right-1 w-0.5 bg-transparent transition-colors hover:bg-[color:var(--accent)]/50" />
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!sidebarCollapsed}
        className="absolute top-3 z-30 hidden h-7 w-5 -translate-x-1/2 cursor-pointer items-center justify-center rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--window)] text-white/70 shadow-sm transition-[left] duration-200 ease-in-out hover:bg-white/10 hover:text-white md:flex"
        style={{ left: sidebarCollapsed ? 10 : sidebarWidth }}
      >
        {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>

      <nav
        className="flex gap-1 overflow-x-auto border-b border-[color:var(--border-subtle)] bg-black/25 p-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Portfolio sections"
      >
        {FILE_SECTIONS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            className={`shrink-0 cursor-pointer rounded-lg px-3 py-2 text-xs transition-colors ${
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
        download="Yash_Kumar_Resume.pdf"
        className="files-download-btn mx-2 mb-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[color:var(--accent-fg)] md:hidden"
      >
        <DownloadIcon />
        Download Resume
      </a>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div key={active} className="files-section-enter">
          {active === 0 && <AboutSection />}
          {active === 1 && <ProjectsSection />}
          {active === 2 && <ExperienceSection />}
          {active === 3 && <ContributionsSection />}
          {active === 4 && <ContactSection />}
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="w-full max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        About Me
      </h1>

      <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/75 sm:text-[15px]">
        <p>{profile.about.intro}</p>
        <p>{profile.about.body}</p>
        <p>{profile.about.achievements}</p>

        <div className="space-y-1.5 pt-2">
          <p>
            <span className="text-white/45">Email · </span>
            <a
              href={`mailto:${profile.email}`}
              className="cursor-pointer text-[color:var(--accent)] hover:underline"
            >
              {profile.email}
            </a>
          </p>
          <p>
            <span className="text-white/45">GitHub · </span>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer text-[color:var(--accent)] hover:underline"
            >
              {profile.githubHandle}
            </a>
          </p>
          <p>
            <span className="text-white/45">LinkedIn · </span>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer text-[color:var(--accent)] hover:underline"
            >
              yash-kumar
            </a>
          </p>
        </div>

        <div className="pt-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/45 sm:text-sm">
            Skills
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-[color:var(--border-subtle)] bg-white/5 px-2.5 py-1 text-xs text-white/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const project = profile.projects.find((p) => p.slug === selected);

  if (project) {
    return (
      <div className="w-full max-w-3xl">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> Back to Projects
        </button>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {project.name}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-[15px]">
          {project.description}
        </p>
        <h2 className="mt-6 text-sm font-semibold text-white sm:text-base">Tech Stack</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[color:var(--accent)]/20 px-3 py-1 text-xs text-[color:var(--highlight)] sm:text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-semibold text-[color:var(--accent-fg)] hover:opacity-90"
          >
            <GitHubIcon />
            View Code
          </a>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-4 py-2.5 text-sm font-semibold text-[color:var(--highlight)] hover:bg-[color:var(--accent)]/20"
            >
              <ExternalIcon />
              Live Demo
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Projects
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {profile.projects.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setSelected(item.slug)}
            className="group flex cursor-pointer flex-col items-center gap-2 text-center transition-transform hover:scale-[1.03]"
          >
            <FolderIcon />
            <span className="max-w-full truncate px-1 text-xs text-white/85 group-hover:text-white sm:text-sm">
              {item.folderLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FolderIcon() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" aria-hidden className="drop-shadow-md">
      <path d="M6 18h24l4 5h32v27H6V18z" fill="#b8b8b8" />
      <path d="M6 12h24l4 5h32v6H6v-11z" fill="#78a203" />
      <rect x="22" y="30" width="28" height="3" rx="1.5" fill="#e8e8e8" opacity="0.9" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
    </svg>
  );
}

function ExperienceSection() {
  return (
    <div className="w-full max-w-3xl space-y-8">
      <h1 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        <BriefcaseIcon />
        Experience
      </h1>

      {profile.experience.map((job) => (
        <article key={`${job.org}-${job.role}`}>
          <h2 className="text-lg font-semibold text-white sm:text-xl">{job.role}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-white/55">
            <span>{job.org}</span>
            <span>·</span>
            <span>{job.location}</span>
          </p>
          {job.orgUrl ? (
            <a
              href={job.orgUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[color:var(--accent)]/35 bg-[color:var(--accent)]/10 px-3.5 py-2 text-sm font-semibold text-[color:var(--accent)] transition-colors hover:border-[color:var(--accent)]/60 hover:bg-[color:var(--accent)]/20 hover:text-[color:var(--highlight)] sm:text-base"
            >
              <LinkIcon />
              {job.org === "Open Source Society"
                ? "Visit OSS Website · oss.akgec.ac.in"
                : `Visit ${job.org} Website`}
              <ExternalIcon />
            </a>
          ) : null}
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/55">
            <CalendarIcon />
            {job.period}
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/70 sm:text-[15px]">
            {job.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}

      <article className="border-t border-[color:var(--border-subtle)] pt-6">
        <h2 className="text-lg font-semibold text-white sm:text-xl">Education</h2>
        <p className="mt-1 text-sm text-white/70">{profile.college}</p>
        <p className="text-sm text-white/55">
          {profile.education} · CGPA {profile.cgpa}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/55">
          <CalendarIcon />
          {profile.educationYears}
        </p>
      </article>
    </div>
  );
}

function ContributionsSection() {
  return (
    <div className="w-full max-w-4xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Open Source Contributions
      </h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {profile.contributions.map((item) => (
          <article
            key={item.repo}
            className="rounded-xl border border-[color:var(--border-subtle)] bg-white/5 p-4"
          >
            <div className="flex items-center gap-2">
              <GitHubIcon />
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer font-semibold text-white hover:text-[color:var(--highlight)] hover:underline"
              >
                {item.repo}
              </a>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
            <a
              href={item.prUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[color:var(--highlight)] hover:underline"
            >
              <LinkIcon />
              View PR{item.repo.includes("cve-lite") ? "s" : ""}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-[color:var(--accent)]" aria-hidden>
      <path d="M10 2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2Zm4 4V4h-4v2h4ZM6 10v2h12v-2H6Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-white/45" aria-hidden>
      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm12 8H5v10h14V10Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden>
      <path d="M3.9 12a5 5 0 0 1 1.46-3.54l2.83-2.83a5 5 0 0 1 7.07 7.07l-.88.88-1.41-1.41.88-.88a3 3 0 0 0-4.24-4.24l-2.83 2.83a3 3 0 0 0 0 4.24 1.41 1.41 0 0 1-1.42 2.12ZM20.1 12a5 5 0 0 1-1.46 3.54l-2.83 2.83a5 5 0 0 1-7.07-7.07l.88-.88 1.41 1.41-.88.88a3 3 0 0 0 4.24 4.24l2.83-2.83a3 3 0 0 0 0-4.24 1.41-1.41 1.42-2.12Z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3a1 1 0 0 1 1 1v8.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.71 6.71a1 1 0 0 0-1.42 0L8.71 11.3a1 1 0 0 0 0 1.42l4.58 4.58a1 1 0 0 0 1.42-1.42L10.83 12l3.88-3.88a1 1 0 0 0 0-1.41Z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.29 6.71a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-4.58 4.58a1 1 0 0 1-1.42-1.42L13.17 12 9.29 8.12a1 1 0 0 1 0-1.41Z" />
    </svg>
  );
}

function ContactSection() {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Contact
      </h1>
      <div className="mt-5 space-y-3 text-sm sm:mt-6 sm:text-[15px]">
        <p className="break-all">
          <span className="text-white/45">Email · </span>
          <a href={`mailto:${profile.email}`} className="cursor-pointer text-[color:var(--accent)] hover:underline">
            {profile.email}
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">Phone · </span>
          <a href={`tel:${profile.phone}`} className="cursor-pointer text-white/80 hover:underline">
            {profile.phone}
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">GitHub · </span>
          <a href={profile.github} target="_blank" rel="noreferrer" className="cursor-pointer text-[color:var(--accent)] hover:underline">
            {profile.githubHandle}
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">LinkedIn · </span>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="cursor-pointer text-[color:var(--accent)] hover:underline">
            yash-kumar
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">LeetCode · </span>
          <a href={profile.leetcode} target="_blank" rel="noreferrer" className="cursor-pointer text-[color:var(--accent)] hover:underline">
            coder-Yash886
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">CodeChef · </span>
          <a href={profile.codechef} target="_blank" rel="noreferrer" className="cursor-pointer text-[color:var(--accent)] hover:underline">
            coder_yash886
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">Location · </span>
          <span className="text-white/80">{profile.location}</span>
        </p>
        <a
          href={profile.resumeUrl}
          download="Yash_Kumar_Resume.pdf"
          className="files-download-btn mt-4 inline-flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-semibold text-[color:var(--accent-fg)] hover:opacity-90"
        >
          View Resume (PDF)
        </a>
      </div>
    </div>
  );
}

function AboutApp() {
  return (
    <div className="flex h-full min-h-[200px] flex-col gap-5 overflow-auto p-5 sm:gap-6 sm:p-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
        {profile.aboutPortfolio.title}
      </h1>
      <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-white/75 sm:text-base">
        <p>{profile.aboutPortfolio.welcome}</p>
        <p>{profile.aboutPortfolio.journey}</p>
        <p>{profile.aboutPortfolio.future}</p>
      </div>
      <p className="text-sm text-white/40">
        Built by {profile.fullName} · {profile.college}
      </p>
    </div>
  );
}
