"use client";

import { useState } from "react";

const FILES = {
  "profile.ts": `export const developer = {
  name: "Yash Kumar",
  role: "Full Stack Developer",
  college: "AKGEC",
  skills: ["TypeScript", "Next.js", "Node.js"],
  leetcode: "250+",
  codechef: "2★ (1458)",
};`,
  "api.ts": `import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.post("/api/auth/login", async (req, res) => {
  // JWT authentication
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!);
  res.json({ token });
});

app.get("/api/projects", async (_req, res) => {
  res.json({ projects: ["Nexora AI", "Brain-Dock"] });
});`,
  "page.tsx": `export default function Portfolio() {
  return (
  <Desktop>
    <Window app="files" />
    <Window app="terminal" />
    <Dock />
  </Desktop>
  );
}`,
} as const;

type FileName = keyof typeof FILES;

export function EditorApp() {
  const [active, setActive] = useState<FileName>("profile.ts");
  const lines = FILES[active].split("\n");

  return (
    <div className="flex h-full min-h-0 bg-[#1e1e1e] font-[family-name:var(--font-mono)] text-xs sm:text-sm">
      <aside className="hidden w-36 shrink-0 border-r border-white/10 bg-[#252526] p-2 sm:block md:w-44">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Explorer
        </p>
        {(Object.keys(FILES) as FileName[]).map((file) => (
          <button
            key={file}
            type="button"
            onClick={() => setActive(file)}
            className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
              active === file
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5"
            }`}
          >
            {file}
          </button>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex gap-1 overflow-x-auto border-b border-white/10 bg-[#2d2d2d] px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(Object.keys(FILES) as FileName[]).map((file) => (
            <button
              key={file}
              type="button"
              onClick={() => setActive(file)}
              className={`shrink-0 border-b-2 px-3 py-2 text-xs ${
                active === file
                  ? "border-[#007acc] text-white"
                  : "border-transparent text-white/50"
              }`}
            >
              {file}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          <pre className="leading-6">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 w-6 shrink-0 select-none text-right text-white/25">
                  {i + 1}
                </span>
                <code className="text-[#d4d4d4]">
                  <ColorizedLine line={line} />
                </code>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

function ColorizedLine({ line }: { line: string }) {
  if (line.includes("//")) {
    const [code, comment] = line.split("//");
    return (
      <>
        <ColorizedCode text={code} />
        <span className="text-[#6a9955]">//{comment}</span>
      </>
    );
  }
  return <ColorizedCode text={line} />;
}

function ColorizedCode({ text }: { text: string }) {
  const parts = text.split(/("[^"]*"|'[^']*'|\b(?:export|const|import|from|return|async|await|default|function)\b)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^"/.test(part) || /^'/.test(part))
          return (
            <span key={i} className="text-[#ce9178]">
              {part}
            </span>
          );
        if (/^(export|const|import|from|return|async|await|default|function)$/.test(part))
          return (
            <span key={i} className="text-[#569cd6]">
              {part}
            </span>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
