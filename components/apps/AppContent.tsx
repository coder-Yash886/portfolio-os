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
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Projects
      </h1>
      <div className="mt-5 space-y-4 sm:mt-6">
        {profile.projects.map((project) => (
          <article
            key={project.name}
            className="rounded-xl border border-[color:var(--border-subtle)] bg-white/5 p-4"
          >
            <h2 className="text-base font-semibold text-white">{project.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[color:var(--accent)]/15 px-2 py-0.5 text-[11px] text-[color:var(--accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
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
      <p className="text-white/80">{profile.fullName} — {profile.title}</p>
      <p className="mt-2 whitespace-pre-wrap break-all">
        <span className="text-white/50">guest@{host}-os</span>
        <span className="text-white/30">:</span>
        <span className="text-[#93c5fd]">~</span>
        <span className="text-white/50">$ </span>
        cat college.txt
      </p>
      <p className="text-white/70">{profile.college} · {profile.year}</p>
      <p className="mt-2 whitespace-pre-wrap break-all">
        <span className="text-white/50">guest@{host}-os</span>
        <span className="text-white/30">:</span>
        <span className="text-[#93c5fd]">~</span>
        <span className="text-white/50">$ </span>
        ls projects/
      </p>
      <p className="text-white/70">nexora-ai  brain-dock  owasp-cve-lite-cli</p>
      <p className="mt-2 whitespace-pre-wrap break-all">
        <span className="text-white/50">guest@{host}-os</span>
        <span className="text-white/30">:</span>
        <span className="text-[#93c5fd]">~</span>
        <span className="text-white/50">$ </span>
        echo &quot;250+ LeetCode | 2★ CodeChef&quot;
      </p>
      <p className="text-white/80">250+ LeetCode | 2★ CodeChef (1458)</p>
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
        Interactive desktop portfolio for {profile.fullName} — {profile.title}.
        Explore projects, experience, and contact info from the dock.
      </p>
      <p className="text-xs text-white/40">{profile.college}</p>
    </div>
  );
}
