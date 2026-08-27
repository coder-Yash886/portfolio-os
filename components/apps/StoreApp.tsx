"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import { APPS, DOCK_ORDER } from "@/lib/apps";

type Category = "explore" | "featured" | "productivity" | "development" | "games";

const NAV: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "explore", label: "Explore", icon: <CompassIcon /> },
  { id: "featured", label: "Featured", icon: <StarIcon /> },
  { id: "productivity", label: "Productivity", icon: <ClockIcon /> },
  { id: "development", label: "Development", icon: <DevIcon /> },
  { id: "games", label: "Games", icon: <GridIcon /> },
];

const SNAP_APPS = [
  {
    name: "VS Code",
    author: "Microsoft",
    desc: "Powerful, lightweight code editor.",
    color: "#0078d4",
    letter: "VS",
    category: "development" as const,
  },
  {
    name: "Docker",
    author: "Docker Inc.",
    desc: "Build, share and run container apps.",
    color: "#2496ed",
    letter: "D",
    category: "development" as const,
  },
  {
    name: "Postman",
    author: "Postman",
    desc: "API platform for building and testing.",
    color: "#ff6c37",
    letter: "P",
    category: "productivity" as const,
  },
  {
    name: "MongoDB",
    author: "MongoDB",
    desc: "General purpose, document-based database.",
    color: "#00ed64",
    letter: "M",
    category: "development" as const,
  },
  {
    name: "Figma",
    author: "Figma",
    desc: "Collaborative interface design tool.",
    color: "#a259ff",
    letter: "F",
    category: "productivity" as const,
  },
  {
    name: "Vercel",
    author: "Vercel",
    desc: "Develop, preview, ship web experiences.",
    color: "#000000",
    letter: "▲",
    category: "development" as const,
  },
  {
    name: "Git",
    author: "Git SCM",
    desc: "Distributed version control system.",
    color: "#f05032",
    letter: "G",
    category: "development" as const,
  },
  {
    name: "LeetCode",
    author: "LeetCode",
    desc: "Practice coding & prepare for interviews.",
    color: "#ffa116",
    letter: "LC",
    category: "games" as const,
  },
];

export function StoreApp() {
  const [active, setActive] = useState<Category>("explore");
  const [query, setQuery] = useState("");

  const filtered = SNAP_APPS.filter((app) => {
    const matchesCat =
      active === "explore" || active === "featured" || app.category === active;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      app.name.toLowerCase().includes(q) ||
      app.desc.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex h-full min-h-0 bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      <aside className="hidden w-44 shrink-0 flex-col border-r border-white/8 bg-[#2b2b2b] sm:flex md:w-52">
        <p className="px-4 py-4 text-sm font-semibold text-white">App Center</p>
        <nav className="flex flex-col gap-0.5 px-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                active === item.id
                  ? "bg-[#3584e4]/25 text-[#62a0ea]"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              <span className={active === item.id ? "text-[#62a0ea]" : "text-white/50"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile category strip */}
        <div className="flex gap-1 overflow-x-auto border-b border-white/8 bg-[#2b2b2b] p-2 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                active === item.id
                  ? "bg-[#3584e4] text-white"
                  : "bg-white/8 text-white/70"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="shrink-0 border-b border-white/8 px-3 py-3 sm:px-5">
          <div className="flex items-center gap-2 rounded-xl bg-[#3d3d3d] px-3 py-2.5">
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for apps"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 sm:p-5">
          {(active === "explore" || active === "featured") && (
            <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c71d8] via-[#3584e4] to-[#62a0ea] p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Featured Snaps
                  </h2>
                  <p className="mt-1 text-sm text-white/80">
                    Tools {profile.name} uses to build & ship.
                  </p>
                  <button
                    type="button"
                    className="mt-4 rounded-full border border-white/60 px-4 py-1.5 text-sm text-white hover:bg-white/10"
                  >
                    Discover more
                  </button>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-14 w-14 rounded-xl bg-white/15 backdrop-blur sm:h-16 sm:w-16"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === "featured" && (
            <section className="mb-5">
              <h3 className="mb-3 text-sm font-semibold text-white/60">
                Portfolio Apps
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {DOCK_ORDER.map((id) => {
                  const app = APPS[id];
                  return (
                    <SnapCard
                      key={id}
                      name={app.title}
                      author="Portfolio OS"
                      desc={`Open ${app.dockLabel} from the dock.`}
                      color="#3584e4"
                      letter={app.dockLabel.charAt(0)}
                    />
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-3 text-sm font-semibold text-white/60">
              {active === "explore" ? "Editor's choice" : NAV.find((n) => n.id === active)?.label}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {filtered.map((app) => (
                <SnapCard key={app.name} {...app} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-white/40">No apps found.</p>
            )}
          </section>

          <section className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-white/60">Certifications</h3>
            <div className="space-y-2 rounded-xl bg-[#2b2b2b] p-4 text-sm text-white/75">
              <p>Linux Foundation LFC102 — Open Source Community Orientation</p>
              <p>Shaastra 2026 E-Contest — IIT Madras</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SnapCard({
  name,
  author,
  desc,
  color,
  letter,
}: {
  name: string;
  author: string;
  desc: string;
  color: string;
  letter: string;
}) {
  return (
    <article className="flex gap-3 rounded-xl bg-[#2b2b2b] p-3 transition-colors hover:bg-[#333]">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {letter}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-white">{name}</p>
        <p className="truncate text-xs text-white/45">{author}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-white/55">{desc}</p>
      </div>
    </article>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/40" aria-hidden>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

function DevIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
    </svg>
  );
}
