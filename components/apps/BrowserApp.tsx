"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

type Bookmark = (typeof profile.bookmarks)[number];

export function BrowserApp() {
  const [active, setActive] = useState<Bookmark>(profile.bookmarks[0]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#1a1a1e]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#252529] px-2 py-2 sm:px-3">
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#1a1a1e] px-3 py-1.5 text-xs text-white/70 sm:text-sm">
          <span className="text-white/40">🔒</span>
          <span className="truncate">{active.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <aside className="shrink-0 border-b border-white/10 p-3 md:w-48 md:border-b-0 md:border-r">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Bookmarks
          </p>
          <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-x-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {profile.bookmarks.map((link) => (
              <button
                key={link.title}
                type="button"
                onClick={() => setActive(link)}
                className={`shrink-0 rounded-lg px-3 py-2 text-left text-xs transition-colors md:w-full sm:text-sm ${
                  active.title === link.title
                    ? "bg-[color:var(--accent)]/20 text-[color:var(--accent)]"
                    : "text-white/70 hover:bg-white/8"
                }`}
              >
                {link.title}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-white/10 px-4 py-4 text-center sm:py-6">
            <p className="text-lg font-semibold text-white sm:text-xl">{active.title}</p>
            <p className="mt-1 text-sm text-white/50">{active.desc}</p>
            <a
              href={active.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-lg bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-[color:var(--accent-fg)] hover:opacity-90"
            >
              Open in new tab →
            </a>
          </div>
          <div className="relative min-h-[200px] flex-1 bg-[#111]">
            {active.url.startsWith("/") ? (
              <iframe
                title={active.title}
                src={active.url}
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-sm text-white/50">
                  Preview not available — external sites open in a new tab.
                </p>
                <a
                  href={active.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Visit {active.title}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
