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
  leetcode: "https://leetcode.com/u/coder-Yash886/",
  codechef: "https://www.codechef.com/users/coder_yash886",
  resumeUrl: "/resume.pdf",
  bookmarks: [
    { title: "GitHub", url: "https://github.com/coder-Yash886", desc: "Projects & open source" },
    { title: "LinkedIn", url: "https://www.linkedin.com/in/yash-kumar-2a7076325/", desc: "Professional profile" },
    { title: "LeetCode", url: "https://leetcode.com/u/coder-Yash886/", desc: "250+ DSA problems" },
    { title: "CodeChef", url: "https://www.codechef.com/users/coder_yash886", desc: "2★ · 270+ problems" },
    { title: "Resume", url: "/resume.pdf", desc: "Download PDF" },
  ],
  location: "Ghaziabad, U.P., India",
  college: "Ajay Kumar Garg Engineering College",
  education: "B.Tech Information Technology",
  educationYears: "Aug 2024 – May 2028",
  cgpa: "8.23",
  year: "3rd-year",
  about: {
    whoAmI:
      "I'm a 3rd-year B.Tech IT student at Ajay Kumar Garg Engineering College, with hands-on experience in backend and full-stack development.",
    whatDone:
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
      name: "Nexora AI",
      description:
        "AI-powered video meeting platform with secure auth, real-time video, AI summaries, and transcription via Stream SDK & Google Gemini.",
      tags: ["Next.js", "Stream SDK", "Gemini", "Inngest", "Vercel"],
    },
    {
      name: "Brain-Dock",
      description:
        "Full-stack second-brain app to organize and share tweets, videos, links, and documents with JWT auth and MongoDB Atlas.",
      tags: ["React", "Node.js", "MongoDB", "JWT", "Vercel", "Render"],
    },
    {
      name: "OWASP cve-lite-cli",
      description:
        "Open-source contributions — bug fixes, feature improvements, and merged PRs for CVE search CLI tool.",
      tags: ["Open Source", "OWASP", "CLI", "GitHub"],
    },
  ],
  experience: [
    {
      role: "Backend Developer",
      org: "Open Source Society (College Technical Society)",
      period: "Jan 2025 – Present",
      location: "Ghaziabad, U.P.",
      points: [
        "Developed backend APIs using Node.js, Express.js, and MongoDB for event registration systems.",
        "Implemented JWT authentication, CRUD operations, and REST APIs for secure user management.",
        "Collaborated with team using Git, GitHub, and Postman for development and API testing.",
      ],
    },
    {
      role: "Open Source Contributor",
      org: "OWASP – cve-lite-cli",
      period: "May 2025 – Present",
      location: "Remote",
      points: [
        "Contributed to OWASP cve-lite-cli for searching CVEs.",
        "Submitted and merged multiple pull requests through GitHub code reviews.",
      ],
    },
  ],
} as const;
