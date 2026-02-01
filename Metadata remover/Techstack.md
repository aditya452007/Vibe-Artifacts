# Technology Stack (Corrected — Jan 31, 2026)

---

## Frontend

### Core Framework

**Next.js 16 (J16) — App Router (Default)**
The latest-generation React framework featuring:

* React 19 as baseline
* Fully stable **Partial Prerendering (PPR)**
* First-class **Server Actions 2.0**
* Streaming + selective hydration by default
* Edge-first rendering model
* Unified app + marketing + tooling architecture

Chosen to support:

* Scroll-driven storytelling
* High-performance interactive UI
* Privacy-first client-side computation
* Premium production readiness

---

### UI & Styling

**Tailwind CSS v4 (Stable)**

* Engine-level rewrite (faster builds, smaller output)
* Native CSS variable theming
* Zero-config dark/light mode
* Ideal for restrained, luxury-focused interfaces

**Radix UI (Latest Primitives)**

* Unstyled, accessible UI foundations
* Dialogs, progress bars, tooltips, dropdowns
* No design imposition → total visual control

**Framer Motion v11+**

* Scroll-linked motion (useScroll / useTransform)
* GPU-accelerated animations
* Designed for narrative hero sections and micro-interactions

---

### State Management

**Zustand v5**

* Concurrent-safe with React 19
* Minimal API, no architectural overhead
* Used only for:

  * Upload queues
  * Processing states
  * UI preferences

**TanStack Query v5**

* Async state only where necessary
* Background sync and request deduplication
* Not used as global state

---

### Scroll & Storytelling

**Lenis (Latest)**

* High-performance smooth scrolling
* No layout shift
* Scoped strictly to hero storytelling

**Intersection Observer API (Native)**

* Scene detection
* Text + image transitions
* Dependency-free and deterministic

---

## Image Processing (Privacy-First Core)

### Metadata Inspection

**exifr (Latest)**

* Actively maintained
* Reads EXIF, XMP, IPTC, GPS
* Supports JPG, PNG, HEIC, WebP

---

### Metadata Removal (Client-Side Default)

**Canvas API (Native)**

* Re-encoding strips all metadata by design
* No third-party dependency risk
* Strongest privacy guarantee

**OffscreenCanvas (Progressive Enhancement)**

* Parallel processing
* Non-blocking UI during batch operations

---

### File Handling

**File System Access API (Progressive)**

* Faster read/write where supported
* Graceful fallback to standard File API

**JSZip (Latest)**

* Batch ZIP downloads client-side

**Native Blob URLs + download attribute**

* No legacy download libraries required

---

### Optional Image Optimization

**@squoosh/lib (WASM)**

* High-quality recompression
* Optional AVIF/WebP export
* Used only if user opts in

---

## Optional Backend (Explicitly Non-Default)

> Backend exists **only** for:
>
> * Extremely large files
> * Legacy browser support
> * HEIC conversion edge cases

### Processing Layer

**Edge + Serverless Functions (Vercel)**

* Stateless
* Auto-scaling
* No disk persistence

**Sharp (Node 20+)**

* Metadata stripping
* Format conversion
* In-memory processing only

---

### Hosting & Delivery

**Vercel (Primary)**

* Native Next.js 16 support
* Edge rendering
* Streaming SSR
* Zero-config deployment

**Cloudflare (Optional)**

* DDoS protection
* Secondary trust signal

---

## Tooling & Development

### Language & Build

**TypeScript 5.9+**

* Strict typing
* Safer image pipelines
* Predictable UI logic

**Turbopack (Stable in J16)**

* Incremental bundling
* Faster HMR
* Lower dev friction

---

### Code Quality

**ESLint (Flat Config)**
**Prettier**
Minimal ruleset, zero stylistic noise.

---

### Performance & Observability

**Vercel Analytics + Speed Insights**

* INP / LCP / CLS monitoring

**Sentry (Client-side only, optional)**

* Upload failures
* Processing errors
* No user data persistence

---

### Testing

**Vitest**

* Unit tests for processing logic

**Playwright**

* End-to-end validation:

  * Upload → Process → Download

---

## File Structure Assumptions

```
/images
  ├── 1.jpg
  ├── 2.avif
  ├── 3.jpg
  ├── logo.png
  └── 5.jpg
```

Assets are:

* Local
* Pre-optimized
* Loaded progressively

---

## Architecture Decision Summary

| Decision                     | Rationale                        |
| ---------------------------- | -------------------------------- |
| Next.js 16 (J16)             | Latest stable, future-proof      |
| Client-side image processing | Maximum privacy & trust          |
| Canvas-based stripping       | Guaranteed metadata removal      |
| Minimal state layers         | Predictable UX                   |
| Optional backend only        | Avoids unnecessary trust erosion |
| Scroll logic isolated        | Performance + clarity            |
| Tailwind v4 + Radix          | Premium UI without bloat         |

---
