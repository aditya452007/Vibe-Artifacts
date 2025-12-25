# 🏗️ Architecture: Git-Aura

Git-Aura is a **Cyberpunk Developer Analytics Dashboard** designed to visualize GitHub activity with high-performance animations and a sleek UI. It leverages modern web technologies to deliver a fast, interactive, and visually stunning experience.

## 🛠️ Tech Stack

The project is built on a cutting-edge stack focused on performance and developer experience:

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | [Next.js](https://nextjs.org/) | 16.1.0 | React Framework with Turbopack & App Router |
| **UI Library** | [React](https://react.dev/) | 19.0.0 | Component-based UI building (Stable) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 3.4.17 | Utility-first CSS framework |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | 11.15.0 | Production-ready animation library |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | 5.0.2 | Small, fast, and scalable bearbones state management |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query/latest) | 5.62.0 | Asynchronous state management |
| **API Client** | [Octokit](https://github.com/octokit) | 4.0.2 | Official GitHub API client |
| **Validation** | [Zod](https://zod.dev/) | 3.24.1 | TypeScript-first schema declaration and validation |
| **Charts** | [Recharts](https://recharts.org/) | 3.6.0 | Composable charting library built on React components |

## 📂 Project Structure

The codebase is organized to separate concerns effectively, utilizing the Next.js App Router structure.

```bash
git-aura/
├── public/                     # Static assets (favicons, images)
├── src/
│   ├── app/                    # Next.js App Router (Routing & Layouts)
│   │   ├── [username]/         # Dynamic route for user statistics
│   │   ├── globals.css         # Global styles & Tailwind directives
│   │   └── page.tsx            # Landing page
│   ├── components/             # Reusable UI components
│   │   ├── slides/             # Individual story slides (The core visualization)
│   │   └── ui/                 # Generic UI elements (ProgressBar, etc.)
│   ├── hooks/                  # Custom React Hooks
│   │   └── use-cyber-sound.ts  # Audio feedback logic
│   ├── lib/                    # Core business logic & utilities
│   │   ├── data-service.ts     # Data fetching logic (Server Actions)
│   │   ├── github-query.ts     # GraphQL queries for GitHub API
│   │   └── utils.ts            # Helper functions (class merging, etc.)
│   ├── store/                  # Global State Stores
│   │   └── slide-store.ts      # Zustand store for slide navigation
│   └── types/                  # TypeScript definitions
│       └── github.ts           # Zod schemas & Type interfaces
└── ...config files             # Configuration (Tailwind, TypeScript, Next.js)
```

## 🔄 Data Flow

1.  **User Input**: The user enters a GitHub username on the landing page.
2.  **Navigation**: The app navigates to `/[username]`.
3.  **Data Fetching (Server-Side)**:
    *   The `page.tsx` in `[username]` triggers a fetch.
    *   `lib/data-service.ts` uses **Octokit** to query the GitHub GraphQL API.
    *   Queries are defined in `lib/github-query.ts`.
    *   Data is validated against Zod schemas in `types/github.ts`.
4.  **State Hydration**: The fetched data is passed to client components.
5.  **Visualization (Client-Side)**:
    *   `SlideDeck.tsx` manages the presentation of data.
    *   Individual slides (e.g., `CommitGraphSlide`, `HeatmapSlide`) render specific metrics using **Recharts** and **Framer Motion** for transitions.
    *   **Zustand** (`slide-store.ts`) manages the active slide index and navigation state.

## 🎨 Design System

*   **Theme**: Cyberpunk / Sci-Fi.
*   **Colors**: Neon Cyan, Bright Green, Electric Purple against dark backgrounds.
*   **Typography**: Monospaced fonts for code/data, clean sans-serif for UI.
*   **Motion**: Heavy use of layout animations (`layoutId`), staggered entrances, and 3D transforms.

## 🧩 Key Components

*   **SlideDeck**: The container orchestrating the storytelling experience. It handles touch/keyboard navigation between slides.
*   **Slides**: Each file in `src/components/slides/` represents a unique data visualization (Velocity, Heatmap, Tech Stack, etc.).
*   **Sound**: `use-cyber-sound` adds auditory feedback to interactions, enhancing the immersion.
