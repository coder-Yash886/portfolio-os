export const profile = {
  name: "Yash Kumar",
  fullName: "Yash Kumar",
  title: "Full Stack Developer",
  tagline: "Full Stack Developer · Open Source Contributor",
  email: "yashkumar.967565@gmail.com",
  phone: "+91-8865872220",
  github: "https://github.com/coder-Yash886",
  githubHandle: "@coder-Yash886",
  linkedin: "https://www.linkedin.com/in/yash-kumar-2a7076325/",
  leetcode: "https://leetcode.com/u/Yk_coder886/",
  codechef: "https://www.codechef.com/users/yash886",
  resumeUrl: "/resume.pdf",
  ossSocietyUrl: "https://oss.akgec.ac.in",
  aboutPortfolio: {
    title: "About This Portfolio",
    welcome:
      "Welcome to my portfolio! This portfolio is my attempt at building a pixel-perfect UI inspired by my Ubuntu system. I'm trying to make it look and feel as close as possible to my actual desktop.",
    journey:
      "It took me several hours to create, and the journey of building it was both challenging and fun — I absolutely loved the process!",
    future:
      "There's still a lot of room for improvement, and I'm planning to make this project open source so that others can use it, contribute, and help it grow.",
  },
  bookmarks: [
    { title: "GitHub", url: "https://github.com/coder-Yash886", desc: "Projects & open source" },
    { title: "LinkedIn", url: "https://www.linkedin.com/in/yash-kumar-2a7076325/", desc: "Professional profile" },
    { title: "LeetCode", url: "https://leetcode.com/u/Yk_coder886/", desc: "250+ DSA problems" },
    { title: "CodeChef", url: "https://www.codechef.com/users/yash886", desc: "2★ · 270+ problems" },
    { title: "Resume", url: "/resume.pdf", desc: "Download PDF" },
  ],
  location: "Ghaziabad, U.P., India",
  college: "Ajay Kumar Garg Engineering College",
  education: "B.Tech Computer Science & Information Technology",
  educationYears: "Aug 2024 – May 2028",
  cgpa: "8.23",
  year: "3rd-year",
  about: {
    intro:
      "Hey! I am Yash. I am a 3rd-year B.Tech CSIT student at Ajay Kumar Garg Engineering College, with hands-on experience in backend and full-stack development.",
    body:
      "I've built projects like Nexora AI, an AI-powered video meeting platform, and Brain-Dock, a full-stack content management platform. I've also contributed to OWASP's cve-lite-cli and built scalable Node.js/Express APIs supporting 200+ concurrent participants.",
    achievements:
      "I've solved 250+ LeetCode problems, 270+ CodeChef problems, and achieved a 2★ CodeChef rating (1458).",
    closing:
      "I've attached my resume for your consideration. I'd love the opportunity to discuss how I can contribute to your team.",
    thankYou: "Thank You!",
  },
  skills: [
    "JavaScript",
    "TypeScript",
    "React.js",
    "Next.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
    "JWT",
    "Docker",
    "Git",
  ],
  projects: [
    {
      slug: "nexora-ai",
      name: "Nexora AI",
      folderLabel: "Nexora AI",
      description:
        "Nexora AI is your AI-powered video meeting platform. Create custom AI agents with tailored instructions, join HD video calls powered by Stream, ask questions by voice or text during meetings with Gemini, and get AI-generated summaries, transcripts, and recording playback after every call. Supports email, Google, and GitHub authentication.",
      github: "https://github.com/coder-Yash886/Nexora-AI",
      liveUrl: "https://nexora-ai-1qwb.vercel.app/",
      tags: [
        "Next.js",
        "TypeScript",
        "tRPC",
        "Drizzle ORM",
        "Neon PostgreSQL",
        "Stream SDK",
        "Google Gemini",
        "Inngest",
        "Vercel",
      ],
    },
    {
      slug: "brain-dock",
      name: "Brain-Dock",
      folderLabel: "Brain-Dock",
      description:
        "Brain-Dock is a full-stack second brain app to save, organize, and share your knowledge — tweets, links, videos, and documents — all in one place. Features JWT-based authentication, custom tags, shareable brain links, and a responsive UI deployed on Vercel with a Node.js/Express backend on Render.",
      github: "https://github.com/coder-Yash886/Brain-dock",
      liveUrl: "https://brain-dock-eosin.vercel.app/",
      tags: [
        "React 19",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "Node.js",
        "Express",
        "MongoDB",
        "JWT",
        "Vercel",
        "Render",
      ],
    },
    {
      slug: "resqmap",
      name: "ResQMap",
      folderLabel: "ResQMap",
      description:
        "ResQMap (AidSync) is a unified disaster relief and resource management system that helps agencies, volunteers, and victims coordinate during emergencies. Includes an interactive relief map with React Leaflet, emergency alerts, resource analytics dashboard with Recharts, and JWT-based authentication.",
      github: "https://github.com/coder-Yash886/ResQMap",
      liveUrl: "https://res-q-map.vercel.app/",
      tags: [
        "React",
        "Vite",
        "Tailwind CSS",
        "React Leaflet",
        "Recharts",
        "Node.js",
        "Express",
        "MongoDB",
        "JWT",
      ],
    },
    {
      slug: "oss-society",
      name: "OSS Society Website",
      folderLabel: "OSS Society",
      description:
        "Official website for the Open Source Society — the college technical society at Ajay Kumar Garg Engineering College. Built to showcase society events, team information, and registration flows with a modern responsive frontend and backend APIs for event management.",
      github: "https://github.com/coder-Yash886/oss-site",
      liveUrl: "https://oss.akgec.ac.in",
      tags: ["React", "Next.js", "Node.js", "Express", "MongoDB", "REST APIs", "JWT"],
    },
    {
      slug: "owasp-cve-lite",
      name: "OWASP cve-lite-cli",
      folderLabel: "cve-lite-cli",
      description:
        "Open-source contributions to OWASP's cve-lite-cli — a CLI tool for searching CVEs. Submitted and merged multiple pull requests including bug fixes and feature improvements through GitHub code reviews.",
      github: "https://github.com/OWASP/cve-lite-cli",
      liveUrl: "",
      tags: ["Open Source", "OWASP", "CLI", "TypeScript", "GitHub"],
    },
  ],
  experience: [
    {
      role: "Backend Developer",
      org: "Open Source Society",
      orgUrl: "https://oss.akgec.ac.in",
      period: "Jan 2025 — Present",
      location: "Ghaziabad, U.P.",
      points: [
        "Developed backend APIs using Node.js, Express.js, and MongoDB for event registration systems.",
        "Implemented JWT authentication, CRUD operations, and REST APIs for secure user management.",
        "Collaborated with team using Git, GitHub, and Postman for development and API testing.",
        "Built scalable APIs supporting 200+ concurrent participants for college technical events.",
      ],
    },
    {
      role: "Open Source Contributor",
      org: "OWASP",
      orgUrl: "https://github.com/OWASP",
      period: "May 2025 — Present",
      location: "Remote",
      points: [
        "Contributed to OWASP cve-lite-cli for searching CVEs through the command line.",
        "Submitted and merged multiple pull requests through GitHub code reviews.",
        "Fixed bugs and implemented feature improvements in the open-source security tooling.",
      ],
    },
  ],
  contributions: [
    {
      repo: "OWASP/cve-lite-cli",
      url: "https://github.com/OWASP/cve-lite-cli",
      prUrl:
        "https://github.com/OWASP/cve-lite-cli/pulls?q=is%3Apr+author%3ACoder-Yash886+is%3Aclosed",
      description:
        "14 merged PRs — bug fixes, lockfile fixtures, --fix/--debug flags, CVE report improvements, and dependency path reconstruction.",
    },
    {
      repo: "kubearmor/KubeArmor",
      url: "https://github.com/kubearmor/KubeArmor",
      prUrl: "https://github.com/kubearmor/KubeArmor/pull/2805",
      description:
        "Security fix PR: bump google.golang.org/grpc to v1.82.1 (GHSA-hrxh-6v49-42gf) across all KubeArmor modules.",
    },
  ],
} as const;
