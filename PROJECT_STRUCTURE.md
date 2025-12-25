# Git-Aura Project Structure

```
Git-Aura/
├── public/                     # Static assets  
│   └── favicon.svg            # Cyan gradient checkmark favicon
├── src/
│   ├── app/                   # Next.js 16 App Router
│   │   ├── [username]/        # Dynamic user route
│   │   │   └── page.tsx       # User stats page (SSR, async params)
│   │   ├── globals.css        # Global styles + CSS variables
│   │   ├── layout.tsx         # Root layout with fonts & metadata
│   │   └── page.tsx           # Homepage with username input
│   ├── components/
│   │   ├── slides/            # Story slide components (11 files)
│   │   │   ├── CommitGraphSlide.tsx   # Velocity chart (bright green)
│   │   │   ├── FinalSlide.tsx         # Celebration + home button
│   │   │   ├── HeatmapSlide.tsx       # Contribution heatmap (orange)
│   │   │   ├── InsightSlide.tsx       # Persona analysis (teal)
│   │   │   ├── ProfileSlide.tsx       # Bento box profile (blue)
│   │   │   ├── SlideCommits.tsx       # Commit matrix
│   │   │   ├── SlideDeck.tsx          # Main container (3D animations)
│   │   │   ├── SlideIntro.tsx         # Welcome slide (sky blue)
│   │   │   ├── SlideLayout.tsx        # Glassmorphic wrapper
│   │   │   ├── SlideRepos.tsx         # Repository list
│   │   │   └── TechStackSlide.tsx     # Top repos bar chart
│   │   └── ui/                
│   │       └── ProgressBar.tsx        # Auto-advance progress
│   ├── hooks/
│   │   └── use-cyber-sound.ts # Audio feedback (Web Audio API)
│   ├── lib/
│   │   ├── data-service.ts    # Server Actions (GitHub GraphQL)
│   │   ├── github-query.ts    # GraphQL query definitions
│   │   └── utils.ts           # Utilities (cn helper)
│   ├── store/
│   │   └── slide-store.ts     # Zustand state (navigation)
│   └── types/
│       └── github.ts          # Zod schemas + TypeScript types
├── .env.local                  # GITHUB_TOKEN environment variable
├── .env.local.example          # Environment template
├── package.json                # Dependencies & scripts
├── tailwind.config.ts          # Tailwind + custom colors
└── tsconfig.json               # TypeScript configuration
```

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| **Next.js** | 16.1.0 | Framework (Turbopack) |
| **React** | 19.0.0 | UI library (stable) |
| **TypeScript** | 5.7.2 | Type safety |
| **Framer Motion** | 11.15.0 | Animations |
| **Zustand** | 5.0.2 | State management |
| **TanStack Query** | 5.62.0 | Data fetching |
| **Tailwind CSS** | 3.4.17 | Styling |
| **Zod** | 3.24.1 | Validation |
| **Octokit** | 4.0.2 | GitHub API |
| **Recharts** | 3.6.0 | Charts/graphs |

## Total Files: ~21 TypeScript/TSX source files
