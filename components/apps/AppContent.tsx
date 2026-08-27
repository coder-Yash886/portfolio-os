"use client";

import { useState } from "react";
import type { AppId } from "@/lib/apps";
import { BrowserApp } from "@/components/apps/BrowserApp";
import { EditorApp } from "@/components/apps/EditorApp";
import { StoreApp } from "@/components/apps/StoreApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { profile } from "@/data/profile";

const FILE_SECTIONS = ["About Me", "Projects", "Experience", "Contact"] as const;

type Props = {
  appId: AppId;
};

export function AppContent({ appId }: Props) {
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
          target="_blank"
          rel="noreferrer"
          className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-3 py-2 text-xs font-semibold text-[color:var(--accent-fg)] transition-opacity hover:opacity-90 sm:text-sm md:mx-3 md:mb-3 md:py-2.5"
        >
          Download Resume
        </a>
      </aside>
      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        {active === 0 && <AboutSection />}
        {active === 1 && <ProjectsSection />}
        {active === 2 && <ExperienceSection />}
        {active === 3 && <ContactSection />}
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        About Me
      </h1>
      <p className="mt-1 text-sm text-[color:var(--accent)]">{profile.title}</p>

      <div className="mt-5 space-y-5 sm:mt-6">
        <section>
          <h2 className="text-sm font-semibold text-white sm:text-base">Who am I?</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75 sm:text-[15px]">
            {profile.about.whoAmI}
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-white sm:text-base">What have I done?</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75 sm:text-[15px]">
            {profile.about.whatDone}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-[15px]">
            {profile.about.achievements}
          </p>
        </section>

        <section>
          <p className="text-sm leading-relaxed text-white/75 sm:text-[15px]">
            {profile.about.closing}
          </p>
          <p className="mt-3 text-sm font-medium text-[color:var(--accent)]">
            {profile.about.thankYou}
          </p>
        </section>

        <section>
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
        </section>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const project = profile.projects.find((p) => p.slug === selected);

  if (project) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mb-5 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> Back to Projects
        </button>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {project.name}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
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
            className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-semibold text-[color:var(--accent-fg)] hover:opacity-90"
          >
            <GitHubIcon />
            View Code
          </a>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-4 py-2.5 text-sm font-semibold text-[color:var(--highlight)] hover:bg-[color:var(--accent)]/20"
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
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Projects
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {profile.projects.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setSelected(item.slug)}
            className="group flex flex-col items-center gap-2 text-center transition-transform hover:scale-[1.03]"
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
      <path d="M6 12h24l4 5h32v6H6v-11z" fill="#3584e4" />
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
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Experience
      </h1>
      <div className="mt-5 space-y-4 sm:mt-6">
        {profile.experience.map((job) => (
          <article
            key={`${job.org}-${job.role}`}
            className="rounded-xl border border-[color:var(--border-subtle)] bg-white/5 p-4"
          >
            <h2 className="text-base font-semibold text-white">{job.role}</h2>
            <p className="mt-1 text-sm text-[color:var(--accent)]">{job.org}</p>
            <p className="text-xs text-white/50">
              {job.period} · {job.location}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/70">
              {job.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-[color:var(--accent)]">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
        <article className="rounded-xl border border-[color:var(--border-subtle)] bg-white/5 p-4">
          <h2 className="text-base font-semibold text-white">Education</h2>
          <p className="mt-1 text-sm text-white/80">{profile.college}</p>
          <p className="text-sm text-white/60">
            {profile.education} · CGPA {profile.cgpa}
          </p>
          <p className="text-xs text-white/50">{profile.educationYears}</p>
        </article>
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Contact
      </h1>
      <div className="mt-5 space-y-3 text-sm sm:mt-6 sm:text-[15px]">
        <p className="break-all">
          <span className="text-white/45">Email · </span>
          <a
            href={`mailto:${profile.email}`}
            className="text-[color:var(--accent)] hover:underline"
          >
            {profile.email}
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">Phone · </span>
          <a href={`tel:${profile.phone}`} className="text-white/80 hover:underline">
            {profile.phone}
          </a>
        </p>
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
          <span className="text-white/45">LinkedIn · </span>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--accent)] hover:underline"
          >
            yash-kumar
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">LeetCode · </span>
          <a
            href={profile.leetcode}
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--accent)] hover:underline"
          >
            coder-Yash886
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">CodeChef · </span>
          <a
            href={profile.codechef}
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--accent)] hover:underline"
          >
            coder_yash886
          </a>
        </p>
        <p className="break-all">
          <span className="text-white/45">Location · </span>
          <span className="text-white/80">{profile.location}</span>
        </p>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-fg)] hover:opacity-90"
        >
          View Resume (PDF)
        </a>
      </div>
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
        Interactive desktop portfolio for {profile.fullName} — {profile.title}.
        Explore projects, experience, and contact info from the dock.
      </p>
      <p className="text-xs text-white/40">{profile.college}</p>
    </div>
  );
}
