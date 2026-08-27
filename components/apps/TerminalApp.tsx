"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

type HistoryLine = { type: "in" | "out"; text: string };

const HOST = `${profile.name.split(" ")[0].toLowerCase()}@yash-portfolio-os`;

const COMMANDS: Record<string, (args: string[]) => string> = {
  help: () =>
    [
      "Available commands:",
      "  help       — show this list",
      "  whoami     — about me",
      "  skills     — tech stack",
      "  projects   — list projects",
      "  experience — work & open source",
      "  contact    — email & socials",
      "  resume     — resume link",
      "  clear      — clear terminal",
    ].join("\n"),
  whoami: () => `${profile.fullName} — ${profile.title}\n${profile.college} (${profile.year})`,
  skills: () => profile.skills.join("  ·  "),
  projects: () =>
    profile.projects.map((p) => `• ${p.name}`).join("\n"),
  experience: () =>
    profile.experience
      .map((job) => `• ${job.role} @ ${job.org}\n  ${job.period}`)
      .join("\n"),
  contact: () =>
    [
      `Email:    ${profile.email}`,
      `Phone:    ${profile.phone}`,
      `GitHub:   ${profile.github}`,
      `LinkedIn: ${profile.linkedin}`,
      `LeetCode: ${profile.leetcode}`,
    ].join("\n"),
  resume: () => `Resume: ${profile.resumeUrl}`,
  clear: () => "",
};

export function TerminalApp() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: "out", text: "Welcome! Type 'help' to get started." },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, input]);

  function runCommand(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const [name, ...args] = trimmed.split(/\s+/);
    const key = name.toLowerCase();
    const next: HistoryLine[] = [{ type: "in", text: trimmed }];

    if (key === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const handler = COMMANDS[key];
    if (handler) {
      const out = handler(args);
      if (out) next.push({ type: "out", text: out });
    } else {
      next.push({ type: "out", text: `${name}: command not found. Type 'help'.` });
    }

    setHistory((h) => [...h, ...next]);
    setInput("");
  }

  return (
    <div
      className="flex h-full min-h-[200px] flex-col bg-[#300a24] font-[family-name:var(--font-mono)] text-[13px] leading-relaxed text-[#eeeeec] sm:text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Ubuntu terminal header */}
      <div className="flex shrink-0 items-center justify-between border-b border-black/25 bg-[#2c001e] px-3 py-1.5">
        <span className="truncate text-xs text-white/80 sm:text-sm">{HOST}</span>
        <div className="flex shrink-0 items-center gap-2 text-white/50">
          <button type="button" aria-label="Search" className="hover:text-white/80">
            <SearchIcon />
          </button>
          <button type="button" aria-label="Menu" className="hover:text-white/80">
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Terminal body */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 sm:p-4">
        {history.map((line, i) =>
          line.type === "in" ? (
            <div key={i} className="whitespace-pre-wrap break-all">
              <Prompt />
              <span className="text-white">{line.text}</span>
            </div>
          ) : (
            <p key={i} className="mb-2 whitespace-pre-wrap break-all text-[#eeeeec]">
              {line.text}
            </p>
          ),
        )}

        <form
          className="flex items-center whitespace-pre-wrap break-all"
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(input);
          }}
        >
          <Prompt />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-white outline-none caret-white"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}

function Prompt() {
  return (
    <>
      <span className="text-[#33d17a]">{HOST}</span>
      <span className="text-white">:</span>
      <span className="text-[#33d17a]">~</span>
      <span className="text-white">$ </span>
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
    </svg>
  );
}
