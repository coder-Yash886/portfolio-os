"use client";

import { useCallback, useState } from "react";
import { profile } from "@/data/profile";

type Tab = {
  id: string;
  title: string;
  url: string;
};

const START_URL = "portfolio://newtab";

function newTab(url = START_URL, title = "New Tab"): Tab {
  return { id: `tab-${Date.now()}-${Math.random()}`, title, url };
}

function resolveAddress(raw: string): { url: string; title: string } {
  const input = raw.trim();
  if (!input || input.toLowerCase() === "new tab") {
    return { url: START_URL, title: "New Tab" };
  }
  if (input === START_URL) {
    return { url: START_URL, title: "New Tab" };
  }
  if (input.startsWith("/")) {
    return { url: input, title: bookmarkTitle(input) };
  }

  if (/^https?:\/\//i.test(input)) {
    return { url: input, title: bookmarkTitle(input) };
  }

  const noSpaces = input.replace(/\s/g, "");
  const looksLikeDomain =
    /^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(noSpaces) ||
    /^localhost(:\d+)?(\/\S*)?$/i.test(noSpaces);

  if (looksLikeDomain && !input.includes(" ")) {
    const url = `https://${noSpaces}`;
    return { url, title: bookmarkTitle(url) };
  }

  const searchUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(input)}`;
  return { url: searchUrl, title: input };
}

function canEmbedInFrame(url: string) {
  if (url === START_URL || url.startsWith("/")) return false;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "google.com";
  } catch {
    return false;
  }
}

export function BrowserApp() {
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const first = newTab();
    return [first];
  });
  const [activeId, setActiveId] = useState(() => tabs[0]?.id ?? "");
  const [address, setAddress] = useState("");

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  const navigate = useCallback(
    (raw: string) => {
      const { url, title } = resolveAddress(raw);

      setTabs((prev) =>
        prev.map((t) => (t.id === activeId ? { ...t, url, title } : t)),
      );
      setAddress(url === START_URL ? "" : url);
    },
    [activeId],
  );

  function addTab() {
    const tab = newTab();
    setTabs((prev) => [...prev, tab]);
    setActiveId(tab.id);
    setAddress("");
  }

  function closeTab(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const idx = tabs.findIndex((t) => t.id === id);
    const next = tabs.filter((t) => t.id !== id);
    setTabs(next);
    if (id === activeId) {
      const fallback = next[Math.max(0, idx - 1)];
      setActiveId(fallback.id);
      setAddress(fallback.url === START_URL ? "" : fallback.url);
    }
  }

  function selectTab(tab: Tab) {
    setActiveId(tab.id);
    setAddress(tab.url === START_URL ? "" : tab.url);
  }

  function openExternal(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#202124] text-[#e8eaed]">
      {/* Tab strip */}
      <div className="flex shrink-0 items-end gap-0.5 bg-[#202124] px-1 pt-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab)}
              className={`group flex max-w-[180px] min-w-[100px] flex-1 items-center gap-1.5 rounded-t-lg px-2 py-1.5 text-xs sm:max-w-[220px] sm:px-3 sm:text-sm ${
                isActive
                  ? "bg-[#35363a] text-white"
                  : "bg-transparent text-white/60 hover:bg-white/5"
              }`}
            >
              <ChromeTabIcon />
              <span className="min-w-0 flex-1 truncate text-left">{tab.title}</span>
              {tabs.length > 1 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => closeTab(tab.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") closeTab(tab.id, e as unknown as React.MouseEvent);
                  }}
                  className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-0 hover:bg-white/15 group-hover:opacity-100"
                  aria-label="Close tab"
                >
                  <CloseIcon />
                </span>
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={addTab}
          aria-label="New tab"
          className="mb-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/60 hover:bg-white/10"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-1 border-b border-black/30 bg-[#35363a] px-2 py-1.5 sm:gap-2 sm:px-3">
        <div className="flex items-center gap-0.5 sm:gap-1">
          <ToolbarBtn label="Back" disabled>
            <BackIcon />
          </ToolbarBtn>
          <ToolbarBtn label="Forward" disabled>
            <ForwardIcon />
          </ToolbarBtn>
          <ToolbarBtn
            label="Reload"
            onClick={() => navigate(active.url === START_URL ? START_URL : active.url)}
          >
            <ReloadIcon />
          </ToolbarBtn>
        </div>

        <form
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#202124] px-3 py-1.5 sm:px-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(address || START_URL);
          }}
        >
          <LockIcon />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search Google or enter a URL"
            className="min-w-0 flex-1 bg-transparent text-xs text-white/90 outline-none placeholder:text-white/30 sm:text-sm"
            spellCheck={false}
          />
          <StarIcon />
        </form>

        <div className="hidden items-center gap-1 sm:flex">
          {profile.bookmarks.slice(0, 4).map((bm) => (
            <button
              key={bm.title}
              type="button"
              title={bm.title}
              onClick={() => navigate(bm.url)}
              className="cursor-pointer rounded px-2 py-1 text-[11px] text-white/50 hover:bg-white/10 hover:text-white/80"
            >
              {bm.title}
            </button>
          ))}
        </div>
      </div>

      {/* Page */}
      <div className="relative min-h-0 flex-1 bg-[#202124]">
        {active.url === START_URL ? (
          <StartPage onNavigate={navigate} onOpenExternal={openExternal} />
        ) : canEmbedInFrame(active.url) ? (
          <iframe
            key={active.url}
            title={active.title}
            src={active.url}
            className="absolute inset-0 h-full w-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : active.url.startsWith("/") ? (
          <iframe
            key={active.url}
            title={active.title}
            src={active.url}
            className="absolute inset-0 h-full w-full border-0 bg-white"
          />
        ) : (
          <ExternalPage
            url={active.url}
            title={active.title}
            onOpen={() => openExternal(active.url)}
          />
        )}
      </div>
    </div>
  );
}

function StartPage({
  onNavigate,
  onOpenExternal,
}: {
  onNavigate: (url: string) => void;
  onOpenExternal: (url: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-auto p-6">
      <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white/90">
        {profile.name}
      </p>
      <p className="mt-1 text-sm text-white/45">{profile.tagline}</p>

      <div className="mt-8 grid w-full max-w-lg gap-3 sm:grid-cols-2">
        {profile.bookmarks.map((bm) => (
          <button
            key={bm.title}
            type="button"
            onClick={() => {
              if (bm.url.startsWith("/") || canEmbedInFrame(bm.url)) {
                onNavigate(bm.url);
              } else {
                onOpenExternal(bm.url);
              }
            }}
            className="flex cursor-pointer flex-col items-start rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-white/20 hover:bg-white/8"
          >
            <span className="text-sm font-semibold text-white/90">{bm.title}</span>
            <span className="mt-1 text-xs text-white/45">{bm.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ExternalPage({
  url,
  title,
  onOpen,
}: {
  url: string;
  title: string;
  onOpen: () => void;
}) {
  const bookmark = profile.bookmarks.find((b) => b.url === url);
  let hostname = url;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    /* keep url */
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/8">
        <GlobeIcon />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">{title || hostname}</h2>
        <p className="mt-1 text-sm text-white/45">{hostname}</p>
      </div>
      <p className="max-w-sm text-sm text-white/50">
        {bookmark?.desc ??
          "This site can't be shown here. Click below to open it in your browser."}
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="cursor-pointer rounded-full bg-[#8ab4f8] px-6 py-2.5 text-sm font-medium text-[#202124] transition-opacity hover:opacity-90"
      >
        Open {title || hostname}
      </button>
    </div>
  );
}

function bookmarkTitle(url: string) {
  if (url === START_URL) return "New Tab";
  const hit = profile.bookmarks.find((b) => b.url === url);
  if (hit) return hit.title;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("google.com") && parsed.pathname === "/search") {
      return parsed.searchParams.get("q") || "Google Search";
    }
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "New Tab";
  }
}

function ToolbarBtn({
  label,
  children,
  disabled,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10 disabled:cursor-default disabled:opacity-30 sm:h-8 sm:w-8"
    >
      {children}
    </button>
  );
}

function GlobeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white/60" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.93 9h-3.4a15.9 15.9 0 0 0-1.14-4.58A8.03 8.03 0 0 1 19.93 11ZM12 4c.95 1.6 1.6 3.5 1.87 5.5H10.13C10.4 7.5 11.05 5.6 12 4ZM4.07 13h3.4c.2 1.58.6 3.1 1.14 4.58A8.03 8.03 0 0 1 4.07 13Zm3.4-2h-3.4a8.03 8.03 0 0 1 2.54-4.58A15.9 15.9 0 0 0 7.47 11ZM12 20c-.95-1.6-1.6-3.5-1.87-5.5h3.74C13.6 16.5 12.95 18.4 12 20Zm4.39-1.42c.54-1.48.94-3 .14-4.58h3.4a8.03 8.03 0 0 1-2.54 4.58ZM14.53 11c-.27-2-.92-3.9-1.87-5.5.95 1.6 1.6 3.5 1.87 5.5Z" />
    </svg>
  );
}

function ChromeTabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <circle cx="12" cy="12" r="10" fill="#4285F4" />
      <circle cx="12" cy="12" r="4" fill="#fff" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
  );
}

function ReloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-white/50" aria-hidden>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-white/50" aria-hidden>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
