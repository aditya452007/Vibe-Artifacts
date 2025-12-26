# Self-Correction Report

## Work Done Wrong
1.  **Redundant Dependencies (Git Aura):** The project `git-aura` depends on both `motion` (^12.23.26) and `framer-motion` (^11.15.0). `motion` is the new name for Framer Motion v12+. This causes bundle bloat and potential version conflicts.
2.  **Synchronous Imports:**
    *   **Prompt Engineering:** `LandingPage` and `ScrollHeader` are imported synchronously in `src/app/page.tsx`. `LandingPage` likely contains heavy client-side animations.
    *   **Git Aura:** `SingularityLogo`, `VisualizerInput`, and `ThemeToggle` are imported synchronously in `src/app/page.tsx`. `SingularityLogo` is likely heavy.
3.  **Missing Error Boundaries (Git Aura):** `git-aura/src/app` lacks `error.tsx` and `loading.tsx`. This means unhandled errors could crash the entire page, and there is no visual feedback during server component loading.
4.  **Accessibility (A11y):**
    *   `VisualizerInput` likely needs explicit labeling (needs verification).
    *   `bg-noise` overlay uses `opacity-20` and `mix-blend-overlay` which might affect contrast; verification in high-contrast mode is needed.

## Missed Edge Cases
1.  **Database Scalability (Prompt Engineering):** Usage of `better-sqlite3` ties the application to a persistent filesystem and Node.js runtime. This breaks serverless deployment (e.g., Vercel, Cloudflare Workers) where the filesystem is ephemeral or non-existent.
2.  **Network Resilience (Git Aura):** If the GitHub API fails or rate limits, the application likely has no robust fallback UI or retry mechanism (implied by lack of `error.tsx`).
3.  **Performance (LCP/TBT):** Large dependencies like `recharts`, `html-to-image`, and `canvas-confetti` in `git-aura` are not lazy-loaded, contributing to higher Total Blocking Time.

## Potential Failures
1.  **Deployment Failure:** Deploying `prompt engineering` to a serverless platform will fail due to `better-sqlite3`.
2.  **Bundle Size Explosion:** Including both `motion` and `framer-motion` increases the initial JavaScript payload significantly.

## Corrective Actions
1.  **Dependency Cleanup:** Remove `framer-motion` from `git-aura` and migrate imports to `motion/react`.
2.  **Performance Optimization:** Implement `next/dynamic` (lazy loading) for heavy client components in both projects.
3.  **Resilience:** Add `loading.tsx` and `error.tsx` to `git-aura`.
