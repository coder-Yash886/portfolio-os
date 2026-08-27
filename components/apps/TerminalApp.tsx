"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

type HistoryLine = { type: "in" | "out"; text: string };

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
      "  resume     — open resume PDF",
      "  clear      — clear terminal",
    ].join("\n"),
  whoami: () => `${profile.fullName} — ${profile.title}\n${profile.college} (${profile.year})`,
  skills: () => profile.skills.join("  ·  "),
  projects: () =>
    profile.projects.map((p) => `• ${p.name} — ${p.tags.slice(0, 3).join(", ")}`).join("\n"),
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
  resume: () => `Resume: ${profile.resumeUrl} (open in Chrome app → Resume bookmark)`,
  clear: () => "",
};

export function TerminalApp() {
  const host = profile.name.toLowerCase().replace(/\s+/g, "-");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: "out", text: `Welcome to ${profile.name} OS Terminal. Type 'help' to begin.` },
    { type: "out", text: "Try: whoami · projects · skills · contact" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

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
      next.push({ type: "out", text: `command not found: ${name}. Type 'help'.` });
    }

    setHistory((h) => [...h, ...next]);
    setInput("");
  }

  return (
    <div className="flex h-full min-h-[200px] flex-col bg-[#0b1220] font-[family-name:var(--font-mono)] text-xs sm:text-sm">
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {history.map((line, i) =>
          line.type === "in" ? (
            <p key={i} className="whitespace-pre-wrap break-all text-[#7dd3c7]">
              <span className="text-white/50">guest@{host}-os</span>
              <span className="text-white/30">:</span>
              <span className="text-[#93c5fd]">~</span>
              <span className="text-white/50">$ </span>
              {line.text}
            </p>
          ) : (
            <p key={i} className="mb-2 whitespace-pre-wrap break-all text-white/80">
              {line.text}
            </p>
          ),
        )}
        <div ref={bottomRef} />
      </div>
      <form
        className="flex items-center gap-2 border-t border-white/10 px-3 py-2 sm:px-4"
        onSubmit={(e) => {
          e.preventDefault();
          runCommand(input);
        }}
      >
        <span className="shrink-0 text-white/50">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[#7dd3c7] outline-none placeholder:text-white/30"
          placeholder="Type a command..."
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
