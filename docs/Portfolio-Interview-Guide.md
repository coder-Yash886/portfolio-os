# Yash Kumar — Portfolio OS
## Complete Interview Guide & Technical Documentation

**Author:** Yash Kumar  
**Project:** Ubuntu-inspired Desktop Portfolio  
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Zustand  
**Date:** August 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [Folder Structure](#3-folder-structure)
4. [System Architecture](#4-system-architecture)
5. [How the Portfolio Works (End-to-End Flow)](#5-how-the-portfolio-works-end-to-end-flow)
6. [Window Manager Deep Dive](#6-window-manager-deep-dive)
7. [Chrome Browser — How It Was Built](#7-chrome-browser--how-it-was-built)
8. [File Explorer (Main Portfolio)](#8-file-explorer-main-portfolio)
9. [Other Desktop Apps](#9-other-desktop-apps)
10. [State Management](#10-state-management)
11. [Styling & UI Design Decisions](#11-styling--ui-design-decisions)
12. [Hard Parts & Challenges](#12-hard-parts--challenges)
13. [Future Features to Add](#13-future-features-to-add)
14. [How to Explain This in an Interview (2-Min Pitch)](#14-how-to-explain-this-in-an-interview-2-min-pitch)
15. [Interview Questions & Answers](#15-interview-questions--answers)
16. [Frontend-Specific Questions](#16-frontend-specific-questions)
17. [System Design Questions](#17-system-design-questions)
18. [Behavioral / Project Questions](#18-behavioral--project-questions)

---

## 1. Executive Summary

This portfolio is **not a traditional multi-page website**. It is a **single-page application (SPA)** that mimics an **Ubuntu/GNOME Linux desktop**. When a recruiter opens the site, they see:

- A live wallpaper (HLS video)
- A top status bar (clock, Wi-Fi, volume, battery)
- A dock at the bottom (like Ubuntu)
- Draggable, resizable, minimizable **windows**
- Six desktop apps: **File Explorer, Chrome, VS Code, Terminal, App Store, About**

The **File Explorer** is the actual portfolio (About Me, Projects, Experience, Contributions, Contact). Other apps are interactive shells that showcase the same data in creative ways (terminal commands, browser bookmarks, code editor view).

**Key idea:** One `profile.ts` data file powers everything. Apps are presentation layers.

---

## 2. Technology Stack

| Layer | Technology | Why I Chose It |
|-------|-----------|----------------|
| Framework | **Next.js 16** (App Router) | React framework, fast builds (Turbopack), easy deployment on Vercel |
| UI Library | **React 19** | Component-based UI, hooks for local state |
| Language | **TypeScript** | Type safety for window state, app registry, profile data |
| Styling | **Tailwind CSS v4** | Utility-first, fast iteration, responsive design |
| Global State | **Zustand** | Lightweight window manager state (lighter than Redux) |
| Video | **hls.js** | Live/streaming wallpaper support |
| Fonts | Outfit, Sora, JetBrains Mono | Body, headings, code/terminal |
| Deployment | Vercel (static) | No backend needed |

**What I did NOT use (and why):**
- No database — all content is static in `profile.ts`
- No Redux — overkill for window management only
- No CSS-in-JS library — Tailwind + CSS variables is enough
- Framer Motion — installed for future animations, currently using CSS animations

---

## 3. Folder Structure

```
Portfolio/
├── app/
│   ├── layout.tsx          # Root HTML, fonts, metadata
│   ├── page.tsx            # Renders <Desktop /> (entire OS)
│   └── globals.css         # Design tokens, wallpaper, animations
│
├── components/
│   ├── desktop/
│   │   ├── Desktop.tsx     # Main shell — wallpaper, windows, dock
│   │   ├── WindowFrame.tsx # Window chrome (drag, resize, maximize)
│   │   ├── Dock.tsx        # App launcher bar
│   │   ├── TopBar.tsx      # Status bar + quick settings
│   │   ├── WindowTabs.tsx  # Mobile window switcher
│   │   └── LiveWallpaper.tsx
│   └── apps/
│       ├── AppContent.tsx  # Routes to each app + Files/About UI
│       ├── BrowserApp.tsx  # Chrome-like browser
│       ├── EditorApp.tsx   # VS Code-style viewer
│       ├── TerminalApp.tsx # Interactive CLI
│       └── StoreApp.tsx    # App Center parody
│
├── store/
│   └── desktopStore.ts     # Zustand — window manager
│
├── lib/
│   ├── apps.ts             # App registry (sizes, titles, dock order)
│   ├── windowLayout.ts     # Viewport math (clamp, maximize insets)
│   └── wallpaper.ts        # HLS URL, poster image
│
├── data/
│   └── profile.ts          # ALL portfolio content (single source of truth)
│
├── hooks/
│   └── useMedia.ts         # Mobile breakpoint detection
│
├── public/
│   ├── resume.pdf
│   └── wallpaper/poster.jpg
│
└── docs/
    └── Portfolio-Interview-Guide.md  # This document
```

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        app/page.tsx                          │
│                         <Desktop />                          │
├─────────────────────────────────────────────────────────────┤
│  LiveWallpaper │ TopBar │ Desktop Workspace │ Dock │ Tabs   │
├─────────────────────────────────────────────────────────────┤
│                    desktopStore (Zustand)                    │
│   windows[] · focusedId · zIndex · open/close/move/resize     │
├─────────────────────────────────────────────────────────────┤
│              WindowFrame × N  →  AppContent(appId)           │
├─────────────────────────────────────────────────────────────┤
│  files │ browser │ editor │ terminal │ store │ about         │
├─────────────────────────────────────────────────────────────┤
│                    data/profile.ts                           │
│         name, skills, projects, experience, links...         │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns Used

1. **App Registry Pattern** — `lib/apps.ts` defines all apps centrally
2. **Single Source of Truth** — `profile.ts` feeds all apps
3. **Thin Global State** — Zustand only for windows; each app has local `useState`
4. **Presentation/Data Separation** — Apps don't duplicate data; they read from profile
5. **Viewport-Aware Layout** — Pure functions clamp window position/size

---

## 5. How the Portfolio Works (End-to-End Flow)

### Step 1: User opens website
- `app/page.tsx` renders `<Desktop />`
- `Desktop.tsx` runs `useEffect(() => openApp("files"), [])` — File Explorer opens automatically

### Step 2: Desktop shell loads
- `LiveWallpaper` plays HLS video (or shows poster if reduced-motion)
- `TopBar` shows clock and system tray
- `Dock` shows 6 app icons
- Name/tagline from `profile.ts` floats on wallpaper

### Step 3: User interacts
- **Dock click** → `openApp(appId)` in Zustand
- **Window drag** → `moveWindow(id, x, y)` with clamping
- **Window resize** → `resizeWindow(id, w, h)` respecting min sizes
- **Maximize** → window fills area between top bar and dock
- **Close** → `closeWindow(id)`

### Step 4: App content renders
- `WindowFrame` wraps children
- `AppContent` switches on `appId` and renders the correct app component
- Each app reads from `profile.ts` or has its own UI state

### Step 5: Mobile behavior
- `useIsMobile()` (< 640px) disables drag/resize/maximize
- `WindowTabs` appears above dock for switching windows
- File Explorer uses horizontal tabs instead of sidebar

---

## 6. Window Manager Deep Dive

**File:** `store/desktopStore.ts`

Each window is an object:
```typescript
{
  id: "files-1724851234567",
  appId: "files",
  title: "File Explorer",
  x: 120, y: 80,
  width: 920, height: 580,
  minimized: false,
  maximized: false,
  zIndex: 12,
  restoreBounds: null  // saved when maximized
}
```

### Smart `openApp` behavior (macOS-like)
1. If app is already open and focused → **close it** (toggle)
2. If app is open but not focused → **focus it**
3. If app is minimized → **restore it**
4. Otherwise → **create new window** with layout from `getWindowLayout()`

### Drag & Resize (`WindowFrame.tsx`)
- Uses **Pointer Events API** (`onPointerDown`, `setPointerCapture`)
- Drag: track offset from title bar mousedown
- Resize: document-level `pointermove` listeners on SE corner
- Maximized windows: drag/resize disabled

### Layout Math (`windowLayout.ts`)
- Reserves space for top bar (32px) and dock (110px desktop / 130px mobile)
- Centers new windows on screen
- Clamps so windows never go under dock or off-screen

---

## 7. Chrome Browser — How It Was Built

**File:** `components/apps/BrowserApp.tsx`

### Features Implemented
- Multi-tab bar (add, close, switch tabs)
- Address bar with back/forward/reload (back/forward disabled — visual only)
- Bookmark shortcuts in toolbar (GitHub, LinkedIn, LeetCode, CodeChef)
- New Tab page with bookmark cards

### Address Resolution Logic (`resolveAddress`)
```
Input                    → Result
─────────────────────────────────────────────────────
(empty)                  → New Tab page
"github.com"             → https://github.com
"striver a to z"         → Google Search (spaces = search query)
"https://..."            → Direct URL
"/resume.pdf"            → Local file iframe
```

**Why Google search?** If user types text with spaces, it's not a valid URL. We redirect to:
`https://www.google.com/search?igu=1&q=encoded_query`

The `igu=1` parameter allows Google to embed in iframe.

### iframe Embedding Strategy
| URL Type | Behavior |
|----------|----------|
| `portfolio://newtab` | Custom React start page |
| `google.com` | Sandboxed iframe (works) |
| `/resume.pdf` | Local iframe |
| GitHub, LinkedIn, etc. | **Cannot embed** (X-Frame-Options) → Show "Open in Browser" page |

**Interview answer:** "Most sites block iframe embedding for security. I detect non-embeddable URLs and show a fallback UI with a button that calls `window.open()` to open in a real tab."

### Tab State
- Local `useState` — not in Zustand (browser is self-contained)
- Each tab: `{ id, title, url }`
- Active tab drives iframe/content rendering

---

## 8. File Explorer (Main Portfolio)

**File:** `components/apps/AppContent.tsx` — `FilesApp` function

### Sections
| Section | Data Source |
|---------|-------------|
| About Me | `profile.about`, `profile.skills` |
| Projects | `profile.projects[]` — folder grid → detail view |
| Experience | `profile.experience[]` |
| Contributions | `profile.contributions[]` |
| Contact | `profile.email`, links |

### UX Features
- **Resizable sidebar** — pointer drag on separator (120px–320px)
- **Collapsible sidebar** — chevron toggle, saves width
- **Download Resume** — `<a download>` to `/resume.pdf`
- **OSS link** — prominent green button in Experience section

### Why File Explorer metaphor?
Recruiters are familiar with "folders = projects". It feels native on a desktop OS and is more memorable than a standard scroll page.

---

## 9. Other Desktop Apps

### Terminal (`TerminalApp.tsx`)
- Fake Ubuntu terminal with purple background
- Commands: `help`, `whoami`, `skills`, `projects`, `experience`, `contact`, `resume`, `clear`
- All output reads from `profile.ts`
- Shows CLI skills indirectly

### Editor (`EditorApp.tsx`)
- VS Code dark theme
- Read-only code viewer with syntax highlighting
- Shows meta code: `profile.ts`, `api.ts`, `page.tsx`
- File tree + tabs (local state)

### App Store (`StoreApp.tsx`)
- Ubuntu Snap Store parody
- Categories, search, tool cards (VS Code, Docker, Postman, etc.)
- Featured section lists actual portfolio dock apps
- Display only — no real install

### About (`AboutApp` in AppContent.tsx)
- Meta page about building the portfolio
- Open-source plans, journey story

---

## 10. State Management

| What | Where | Why |
|------|-------|-----|
| Windows, focus, z-index | Zustand (`desktopStore`) | Shared across Desktop, Dock, WindowFrame, Tabs |
| Browser tabs | `useState` in BrowserApp | Self-contained, no other component needs it |
| Terminal history | `useState` in TerminalApp | Local to terminal |
| Files sidebar width | `useState` in FilesApp | Local UI preference |
| Quick settings | `useState` in TopBar | Decorative, no global effect |
| Portfolio data | Static `profile.ts` import | No fetching, no CMS |

**Zustand selector pattern:**
```typescript
const windows = useDesktopStore((s) => s.windows);
```
Only re-renders when `windows` changes — not on every store update.

---

## 11. Styling & UI Design Decisions

### Design System
- CSS variables in `globals.css`: `--accent` (Ubuntu green `#78a203`), `--window`, `--dock`, etc.
- Tailwind v4 with `@theme inline` mapping

### Per-App Themes
Each app mimics its real counterpart:
- Chrome: `#202124` dark gray
- VS Code: `#1e1e1e`
- Terminal: `#300a24` Ubuntu purple
- File Explorer: translucent dark with green accents

### Responsive Strategy
- Mobile: full-width windows, horizontal tabs, no drag
- Desktop: free-floating windows, sidebar, resize handles

### Accessibility
- `role="dialog"` on windows
- `aria-label` on icon buttons
- `prefers-reduced-motion` disables video wallpaper

---

## 12. Hard Parts & Challenges

### 1. Window Drag & Resize Without a Library
**Problem:** Making windows draggable and resizable with pointer events, while keeping them inside viewport bounds.

**Solution:** `setPointerCapture` on title bar, document-level listeners for resize, `clampWindowPosition` / `clampWindowSize` pure functions.

### 2. iframe Embedding (Browser)
**Problem:** GitHub, LinkedIn block iframes → "refused to connect" error.

**Solution:** `canEmbedInFrame()` check + `ExternalPage` fallback with `window.open()`. Google search uses `igu=1` for embeddable results.

### 3. Maximize Within Desktop Chrome
**Problem:** Fullscreen `top:0; bottom:0` covers dock and top bar.

**Solution:** `getMaximizedInsets()` — maximize between top bar (32px) and dock (110px).

### 4. Sidebar Resize vs Download Button
**Problem:** Resize handle overlapped Download Resume → wrong cursor (`col-resize` instead of `pointer`).

**Solution:** Resize handle only on nav area; download button on separate layer with `z-index`.

### 5. Mobile vs Desktop UX
**Problem:** Drag/resize doesn't work on touch; small screens need different layout.

**Solution:** `useIsMobile()` disables window chrome; `WindowTabs` for multitasking; horizontal section tabs in Files app.

### 6. Z-Index / Focus Management
**Problem:** Clicking a window should bring it to front.

**Solution:** `focusWindow` increments global `nextZ` and assigns to clicked window.

### 7. Single Data Source for 6 Apps
**Problem:** Avoid duplicating portfolio content across terminal, files, browser.

**Solution:** Central `profile.ts` — every app imports and reads from it.

---

## 13. Future Features to Add

| Feature | Description | Difficulty |
|---------|-------------|------------|
| **Framer Motion** | Window open/close animations, dock bounce | Medium |
| **Persistence** | Save window positions to `localStorage` | Easy |
| **Themes** | Light mode toggle (quick settings already has UI) | Medium |
| **Notifications** | Toast when "downloading" resume | Easy |
| **Right-click desktop** | Context menu (New Folder, Change Wallpaper) | Medium |
| **Keyboard shortcuts** | Alt+Tab window switch, Super key for dock | Hard |
| **PWA / Install** | Install as desktop app | Easy |
| **CMS integration** | Sanity/Contentful for profile data | Medium |
| **Analytics** | Track which sections recruiters view most | Easy |
| **Open source** | Publish repo, contribution guide | Easy |
| **Multi-monitor** | Fake second monitor drag | Hard |
| **Sound effects** | Ubuntu login/click sounds | Easy |

---

## 14. How to Explain This in an Interview (2-Min Pitch)

> "I built an Ubuntu-inspired desktop portfolio using Next.js and React. Instead of a traditional scroll website, recruiters land on a simulated OS with a live wallpaper, dock, and draggable windows.
>
> The main app is a File Explorer containing my About, Projects, Experience, and Contact sections. I also built a Chrome browser with tabs and Google search, a Terminal where you can type commands like `skills` and `projects`, a VS Code editor showing my code structure, and an App Store showcasing my tech stack.
>
> Architecturally, I used Zustand as a lightweight window manager — handling open, close, focus, drag, resize, and maximize. All content lives in a single `profile.ts` file, and each app is a presentation layer over that data.
>
> The hardest parts were iframe security for the browser, viewport-aware window clamping, and making it responsive on mobile. It's deployed on Vercel as a static site with no backend."

---

## 15. Interview Questions & Answers

### Q1: Why did you build a desktop OS portfolio instead of a normal website?
**A:** I wanted to stand out and demonstrate frontend skills beyond a template. A desktop metaphor lets me show state management, drag-and-drop, multi-window UX, and creativity — all things I'd use in real product UIs. It also reflects my Ubuntu/Linux background.

### Q2: What is the tech stack?
**A:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand for window state, hls.js for video wallpaper. Deployed on Vercel. No backend, no database.

### Q3: How does the window system work?
**A:** Zustand store holds an array of window objects with position, size, z-index, and state (minimized/maximized). `WindowFrame` handles pointer events for drag and resize. `windowLayout.ts` has pure functions to clamp windows inside the viewport, accounting for the top bar and dock.

### Q4: How do you manage state?
**A:** Global window state in Zustand. Each app manages its own local state with React hooks. Portfolio content is a static TypeScript file — no API calls. This keeps the architecture simple and the site fast.

### Q5: Why Zustand over Redux or Context?
**A:** I only needed global state for windows. Zustand is ~1KB, has no boilerplate, and supports selective subscriptions. Redux would be overkill; Context would cause unnecessary re-renders across the tree.

### Q6: How does the Chrome browser work?
**A:** It's a React component with local tab state. The address bar uses `resolveAddress()` — domains get `https://`, text with spaces becomes a Google search, and blocked sites show an "Open in Browser" fallback because of X-Frame-Options headers.

### Q7: Why can't GitHub load inside the browser?
**A:** GitHub sends `X-Frame-Options: DENY` and CSP `frame-ancestors` headers to prevent clickjacking. I detect non-embeddable URLs and show a fallback page with `window.open()` instead.

### Q8: How is the portfolio content structured?
**A:** Single file `data/profile.ts` with typed objects for skills, projects, experience, contributions, bookmarks, and about text. Every app imports this file. To update my portfolio, I edit one file.

### Q9: Is it responsive?
**A:** Yes. Below 640px, windows go full-width, drag/resize is disabled, and a tab bar above the dock replaces free-floating windows. File Explorer uses horizontal scroll tabs instead of a sidebar.

### Q10: How would you scale this project?
**A:** Move `profile.ts` to a headless CMS (Sanity/Contentful), add `localStorage` for window persistence, implement Framer Motion animations, add PWA support, and open-source the repo for contributions.

### Q11: What was the hardest bug you fixed?
**A:** The browser tried to load `https://striver a to z` as a URL when users searched with spaces. I built `resolveAddress()` to detect search queries vs URLs. Also fixed iframe overlap on the Download Resume button causing the wrong mouse cursor.

### Q12: How do you handle performance?
**A:** Static site — no API latency. Zustand selectors prevent unnecessary re-renders. Video wallpaper respects `prefers-reduced-motion`. Next.js static generation for fast first paint. Only active app content renders inside each window.

### Q13: Can you walk me through adding a new app?
**A:** 
1. Add app id to `lib/apps.ts` (title, defaultSize, minSize, dock order)
2. Create component in `components/apps/`
3. Add case in `AppContent.tsx` switch
4. Add dock icon in `Dock.tsx`
Done — the window manager handles the rest automatically.

### Q14: Why Next.js for a client-only app?
**A:** App Router, Turbopack dev speed, `next/font` optimization, easy Vercel deployment, and SEO metadata in `layout.tsx`. Even though the desktop is client-rendered, Next.js gives production-grade tooling.

### Q15: What would you do differently?
**A:** Add tests for `windowLayout.ts` and `resolveAddress()`. Use Framer Motion from the start. Extract Files app into its own file (it's large). Add Storybook for window components.

---

## 16. Frontend-Specific Questions

### Q: Explain the component hierarchy.
```
page.tsx → Desktop → WindowFrame → AppContent → [BrowserApp | FilesApp | ...]
                  → Dock, TopBar, LiveWallpaper, WindowTabs
```

### Q: How does drag-and-drop work?
Pointer Events API. On `pointerdown` in title bar, save start offset. On `pointermove`, compute new x/y and call `moveWindow`. `setPointerCapture` ensures we get events even if cursor leaves the element. On `pointerup`, release.

### Q: How do CSS variables enable theming?
`:root` defines `--accent`, `--window`, etc. Components use `bg-[color:var(--accent)]`. Changing one variable updates the entire theme. Quick settings "Dark Style" toggle could flip these in future.

### Q: What is Tailwind v4 difference from v3?
Uses `@import "tailwindcss"` instead of `@tailwind` directives. `@theme inline` maps CSS variables to Tailwind tokens. Same utility classes, new configuration approach.

### Q: How do you prevent memory leaks in resize listeners?
Resize adds `pointermove` and `pointerup` on `window` in `pointerdown`, and removes them in `pointerup`. Never leave dangling listeners.

### Q: What is `use client` and where is it used?
Next.js App Router defaults to Server Components. Any component using hooks, state, or browser APIs needs `"use client"` at the top. All desktop and app components are client components.

### Q: How would you add SSR for SEO?
The desktop itself doesn't need SSR for content indexing. Could add a `/resume` or `/about` plain HTML route for crawlers, or render meta tags from `profile.ts` in `layout.tsx` (already done for title/description).

---

## 17. System Design Questions

### Q: If 1 million users visit simultaneously?
Static site on Vercel CDN — scales automatically. No server state. Each user gets the same JS bundle. Video wallpaper is the main bandwidth cost — could use a lighter poster-only fallback.

### Q: How would you add user accounts?
Would need a backend (Next.js API routes + database). Users could customize wallpaper, save window layouts. Currently out of scope for a portfolio.

### Q: How would you add real-time collaboration?
WebSockets (Socket.io/Pusher) for shared desktop state. CRDT for window positions. Far beyond current scope — good discussion point for senior roles.

---

## 18. Behavioral / Project Questions

### Q: How long did it take?
Several hours over multiple sessions. Iterative — started with basic windows, then added apps one by one, then polished UI (Ubuntu green theme, quick settings, browser search fix).

### Q: What did you learn?
- Pointer Events for custom drag UX
- iframe security limitations
- Zustand for minimal global state
- Designing for both mobile and desktop in one codebase
- How real window managers think about z-index and focus

### Q: Why should we hire you based on this project?
It shows I can ship a creative, polished frontend product end-to-end. I understand state management, responsive design, browser security, and UX details (cursor states, maximize insets, collapse/restore sidebar). I don't just follow tutorials — I solve real interaction problems.

---

## Quick Reference Card

| App | File | Purpose |
|-----|------|---------|
| Files | AppContent.tsx | Main portfolio |
| Chrome | BrowserApp.tsx | Bookmarks + search |
| Code | EditorApp.tsx | VS Code showcase |
| Terminal | TerminalApp.tsx | CLI over profile data |
| App Store | StoreApp.tsx | Tech stack display |
| About | AppContent.tsx | Meta story |

| Store Action | What it does |
|-------------|-------------|
| openApp | Open/focus/close/toggle app |
| moveWindow | Drag window |
| resizeWindow | Resize from corner |
| toggleMaximize | Fill between topbar & dock |
| focusWindow | Bring to front (z-index) |

---

**End of Document**

*Built by Yash Kumar — B.Tech CSIT, AKGEC*  
*GitHub: @coder-Yash886*
