"use client";

import { profile } from "@/data/profile";
import { APPS, DOCK_ORDER } from "@/lib/apps";

const TOOLS = [
  { name: "VS Code", category: "Editor", desc: "Primary IDE" },
  { name: "Postman", category: "API", desc: "API testing" },
  { name: "Docker", category: "DevOps", desc: "Containerization" },
  { name: "Git & GitHub", category: "Version Control", desc: "Code collaboration" },
  { name: "MongoDB Atlas", category: "Database", desc: "Cloud NoSQL" },
  { name: "Vercel", category: "Deploy", desc: "Frontend hosting" },
  { name: "Render", category: "Deploy", desc: "Backend hosting" },
  { name: "Figma", category: "Design", desc: "UI mockups" },
];

export function StoreApp() {
  return (
    <div className="h-full overflow-auto p-4 sm:p-6">
      <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white sm:text-2xl">
        App Library
      </h1>
      <p className="mt-1 text-sm text-white/50">Tools & apps I use daily</p>

      <section className="mt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Portfolio Apps
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {DOCK_ORDER.map((id) => {
            const app = APPS[id];
            return (
              <div
                key={id}
                className="rounded-xl border border-[color:var(--border-subtle)] bg-white/5 p-4"
              >
                <p className="font-medium text-white">{app.title}</p>
                <p className="mt-1 text-xs text-white/50">{app.dockLabel}</p>
                <p className="mt-2 text-sm text-white/60">
                  Open from the dock to explore {profile.name}&apos;s portfolio.
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Dev Tools
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="rounded-xl border border-[color:var(--border-subtle)] bg-white/5 p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--accent)]">
                {tool.category}
              </p>
              <p className="mt-1 font-medium text-white">{tool.name}</p>
              <p className="mt-1 text-xs text-white/50">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Certifications
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-white/70">
          <li className="flex gap-2">
            <span className="text-[color:var(--accent)]">•</span>
            Linux Foundation LFC102 — Open Source Community Orientation
          </li>
          <li className="flex gap-2">
            <span className="text-[color:var(--accent)]">•</span>
            Shaastra 2026 E-Contest — IIT Madras
          </li>
        </ul>
      </section>
    </div>
  );
}
