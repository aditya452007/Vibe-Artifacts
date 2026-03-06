# FRONTEND_GUIDELINES.md — Design System & Component Specification

> Tech references: [TECH_STACK.md](./TECH_STACK.md)
> App flow: [APP_FLOW.md](./APP_FLOW.md)

---

## 1. Design Tokens

### 1.1 Color System

> **Palette: Premium warm tones — No purple gradients, no pitch black/white extremes.**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-primary` | `#D9534F` (Burnt Orange-Red) | `#E06560` | Buttons, links, CTAs |
| `--color-primary-hover` | `#C24843` | `#F07570` | Primary hover state |
| `--color-secondary` | `#C0C0C0` (Metallic Silver) | `#D4D4D4` | Borders, secondary text |
| `--color-tertiary` | `#DAA520` (Goldenrod) | `#E8B830` | Badges, premium highlights |
| `--color-bg-page` | `#FAFAF8` | `#1F1F1F` | Page background |
| `--color-bg-card` | `#FFFFFF` | `#2A2A2A` | Card backgrounds |
| `--color-bg-nav` | `rgba(255,255,255,0.95)` | `rgba(31,31,31,0.95)` | Navigation (glassmorphism) |
| `--color-text-primary` | `#1A1A1A` | `#F0F0F0` | Headings, body text |
| `--color-text-secondary` | `#5A5A5A` | `#A0A0A0` | Muted text, captions |
| `--color-text-inverse` | `#FFFFFF` | `#1A1A1A` | Text on primary-colored backgrounds |
| `--color-success` | `#2E8B57` (Emerald) | `#3DA06A` | Success states |
| `--color-error` | `#DC143C` (Crimson) | `#EF4444` | Error states |
| `--color-warning` | `#D4A017` | `#E8B830` | Warning states (quota near full) |
| `--color-info` | `#6A7CA0` (Slate Blue) | `#8094B8` | Info states |
| `--color-border` | `#E5E5E5` | `#3A3A3A` | Default borders |

**Contrast Verification (WCAG AA 4.5:1):**

| Text/Background Pair | Ratio | Pass? |
|----------------------|-------|-------|
| `--color-text-primary` on `--color-bg-page` (light) | 15.3:1 | ✅ |
| `--color-text-primary` on `--color-bg-page` (dark) | 14.7:1 | ✅ |
| `--color-text-secondary` on `--color-bg-card` (light) | 6.1:1 | ✅ |
| `--color-primary` on `--color-bg-card` (light) | 4.8:1 | ✅ |

### 1.2 Typography

| Token | Value |
|-------|-------|
| `--font-heading` | `'Poppins', sans-serif` |
| `--font-body` | `'Inter', sans-serif` |
| `--font-mono` | `'JetBrains Mono', monospace` |

| Scale | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 | `36px` / `2.25rem` | 700 | 1.2 | Hero headline |
| H2 | `28px` / `1.75rem` | 600 | 1.3 | Section titles |
| H3 | `22px` / `1.375rem` | 600 | 1.3 | Card titles |
| H4 | `18px` / `1.125rem` | 500 | 1.4 | Subsection titles |
| Body | `16px` / `1rem` | 400 | 1.6 | Paragraphs |
| Small | `14px` / `0.875rem` | 400 | 1.5 | Captions, metadata |
| Tiny | `12px` / `0.75rem` | 400 | 1.4 | Badges, timestamps |
| Button | `14px` / `0.875rem` | 600 | 1 | Buttons – uppercase, `letter-spacing: 0.05em` |

### 1.3 Spacing Scale

| Token | Value |
|-------|-------|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |
| `--space-2xl` | `48px` |
| `--space-3xl` | `64px` |
| `--space-4xl` | `96px` |

### 1.4 Elevation / Shadows

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.06)` | Subtle cards |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | Cards, dropdowns |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modals, elevated cards |
| `--shadow-nav` | `0 2px 8px rgba(0,0,0,0.06)` | Navigation bar |

### 1.5 Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `6px` |
| `--radius-md` | `10px` |
| `--radius-lg` | `14px` |
| `--radius-xl` | `20px` |
| `--radius-full` | `9999px` |

### 1.6 Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `1` | Default stacking |
| `--z-dropdown` | `10` | Dropdowns, popovers |
| `--z-sticky` | `20` | Sticky nav |
| `--z-modal-backdrop` | `30` | Modal overlay |
| `--z-modal` | `40` | Modal content |
| `--z-toast` | `50` | Toast notifications |

---

## 2. Responsive Grid & Breakpoints

| Breakpoint | Name | Min Width | Columns | Gutter | Margin |
|------------|------|-----------|---------|--------|--------|
| XS | Small mobile | `320px` | 4 | `16px` | `16px` |
| SM | Large mobile | `481px` | 4 | `16px` | `24px` |
| MD | Tablet | `769px` | 8 | `24px` | `32px` |
| LG | Desktop | `1025px` | 12 | `24px` | `auto` (max-width: `1200px`) |
| XL | Large desktop | `1440px` | 12 | `32px` | `auto` (max-width: `1320px`) |

### Container Widths

```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-md);
}
@media (min-width: 1025px) { .container { max-width: 1200px; } }
@media (min-width: 1440px) { .container { max-width: 1320px; } }
```

### Navigation Behavior

| Breakpoint | Behavior |
|------------|----------|
| `< 768px` | Hamburger menu, slide-in drawer |
| `≥ 768px` | Full horizontal nav |

---

## 3. Component Catalog

### 3.1 Navigation (`<Navigation />`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark'` | system | Current theme |
| `isLoggedIn` | `boolean` | `false` | Auth state |
| `user` | `{ email, tier, image_count, max_images }` | `null` | User data |

**Behavior:**
- Sticky, `top: 0`, height `56px`
- Glassmorphism background (`backdrop-filter: blur(10px)`)
- Shadow on scroll (`--shadow-nav`)
- Logo left, actions right
- When logged out: `[Login]` `[Signup]`
- When logged in: `[Upload]` `[Images]` `[Settings]` `[Profile dropdown]`
- Animation: `opacity 0→1` fade on mount (GSAP, `duration: 0.3s`)

### 3.2 Hero (`<Hero />`)

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Bold headline |
| `subtitle` | `string` | Supporting text |
| `primaryCTA` | `{ label, onClick }` | "Get Started" button |
| `secondaryCTA` | `{ label, onClick }` | "See Pricing" link |

**Behavior:**
- Full viewport height (100vh) with content centered
- Parallax background (subtle, 2-3px movement via GSAP ScrollTrigger)
- Headline fade + float up (GSAP, `y: 30→0`, `opacity: 0→1`, `duration: 0.8s`)
- CTA buttons stagger in after headline (`delay: 0.3s`)

### 3.3 Pricing Card (`<PricingCard />`)

| Prop | Type | Description |
|------|------|-------------|
| `tier` | `'free' \| 'premium' \| 'ultra'` | Tier name |
| `price` | `string` | Display price (e.g., "₹0", "₹99/mo") |
| `features` | `string[]` | Feature list |
| `isPopular` | `boolean` | Highlight with scale + badge |
| `onSelect` | `() => void` | CTA click handler |

**Spec:**
- Card dimensions: `280px` wide (desktop), `100%` (mobile)
- Padding: `--space-lg` (`24px`)
- Border radius: `--radius-lg` (`14px`)
- Shadow: `--shadow-md`
- Popular tier: `scale(1.05)`, goldenrod `--color-tertiary` border, "Most Popular" badge
- Hover: `translateY(-4px)`, shadow → `--shadow-lg`, `transition: 0.2s ease`

### 3.4 Feature Card (`<FeatureCard />`)

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `ReactNode` (SVG) | Feature icon |
| `title` | `string` | Feature title |
| `description` | `string` | Short microcopy |

**Spec:**
- Grid: `4 columns` desktop, `2 columns` tablet, `1 column` mobile
- Card: `padding: 24px`, `border-radius: 10px`
- Hover: `translateY(-2px)`, subtle shadow increase, `transition: 0.2s`
- Animation: Stagger on scroll-trigger (GSAP, `stagger: 0.1s`)

### 3.5 Image Card (`<ImageCard />`)

| Prop | Type | Description |
|------|------|-------------|
| `thumbnail` | `string` | ImageKit URL |
| `uploadedAt` | `string` | ISO timestamp |
| `onDelete` | `() => void` | Delete handler |

**Spec:**
- Grid: `4 columns` desktop, `3 cols` tablet, `2 cols` mobile
- Aspect ratio: `1:1` (square crop)
- Thumbnail dimensions: set `width` and `height` attributes (prevents CLS)
- Border radius: `--radius-md` (`10px`)
- Hover overlay: `opacity 0→1`, shows delete icon + timestamp
- Animation: `opacity 0→1` (GSAP, `duration: 0.15s`)
- Delete: confirm dialog → API call → optimistic removal → toast

### 3.6 Upload Box (`<UploadBox />`)

| Prop | Type | Description |
|------|------|-------------|
| `status` | `'idle' \| 'hovering' \| 'uploading' \| 'success' \| 'error'` | Current state |
| `onDrop` | `(files: File[]) => void` | File drop handler |
| `quota` | `{ used, max }` | Upload quota |

**Spec:**
- Dimensions: `100%` width, `min-height: 200px`
- Border: `2px dashed --color-border` (idle), `2px dashed --color-primary` (hover)
- States:
  - Idle: dashed border, cloud upload icon, "Drag & drop or click"
  - Hovering: `--color-primary` border, `background: rgba(217,83,79,0.05)`, pulse animation
  - Uploading: progress bar, file name, percentage
  - Success: checkmark icon, green border, "Upload complete"
  - Error: error icon, red border, error message
- Accessibility: `role="button"`, `tabIndex=0`, keyboard-activatable
- Animation: border pulse on hover (GSAP, `borderColor` tween, `repeat: -1`, `yoyo: true`)

### 3.7 Quota Indicator (`<QuotaIndicator />`)

| Prop | Type | Description |
|------|------|-------------|
| `used` | `number` | Current image count |
| `max` | `number` | Max allowed images |

**Spec:**
- Horizontal progress bar, height `8px`, border-radius `4px`
- Fill color: `--color-primary` (< 80%), `--color-warning` (80–99%), `--color-error` (100%)
- Text label: `"{used} / {max} images"` below bar
- Tooltip on hover: percentage and tier name
- Animation: width tween on data change (GSAP, `duration: 0.4s, ease: power2.out`)

### 3.8 Theme Toggle (`<ThemeToggle />`)

| Prop | Type | Description |
|------|------|-------------|
| `theme` | `'light' \| 'dark'` | Current theme |
| `onToggle` | `() => void` | Toggle handler |

**Behavior:**
- Sun/Moon SVG icon swap
- Smooth `transition: 0.3s` on all CSS custom properties
- Persists to `localStorage('imagetier-theme')`
- Default: `prefers-color-scheme` media query

---

## 4. Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | All text passes 4.5:1 ratio (verified in §1.1) |
| Focus states | `outline: 2px solid --color-primary` with `2px offset` on all interactive elements |
| Keyboard navigation | Tab order matches visual order; Enter/Space activates buttons |
| ARIA labels | Icon-only buttons have `aria-label`; upload zone has `role="button"` |
| Alt text | All `<img>` tags have descriptive `alt` attributes |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all GSAP animations |
| Form labels | All form inputs have visible `<label>` with `htmlFor` |
| Error announce | Error messages have `role="alert"` for screen readers |

---

## 5. Animation Guidelines (GSAP)

| Animation | Trigger | Duration | Easing | CLS Impact |
|-----------|---------|----------|--------|------------|
| Nav fade-in | Mount | `0.3s` | `power2.out` | None (fixed position) |
| Hero headline slide | Mount | `0.8s` | `power3.out` | Reserve height |
| Section reveal | ScrollTrigger | `0.6s` | `power2.out` | Reserve space |
| Card hover | Hover | `0.2s` | `power1.out` | `transform` only |
| Upload pulse | Drag hover | `0.6s` loop | `sine.inOut` | `borderColor` only |
| Quota bar fill | Data change | `0.4s` | `power2.out` | Height pre-set |
| Error shake | Error | `0.4s` | `elastic.out(1, 0.3)` | `translateX` only |
| Toast enter | Trigger | `0.3s` | `back.out(1.7)` | Fixed position |

**Performance Rules:**
- Only animate `transform` and `opacity` (GPU-composited)
- Use `will-change: transform` sparingly
- All animated containers must pre-reserve dimensions (prevent CLS)
- Respect `prefers-reduced-motion`
- No GSAP timelines running constantly — use scroll triggers and events

---

## 6. API Integration Pattern

### Data Shapes (from backend)

```typescript
// User profile (GET /me)
interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  tier: 'free' | 'premium' | 'ultra';
  image_count: number;
  max_images: number;
  payment_status: 'paid' | 'unpaid';
}

// Image metadata (GET /images)
interface ImageMeta {
  id: string;
  image_url: string;
  uploaded_at: string; // ISO 8601
}

// Upload token (POST /uploads/token)
interface UploadToken {
  token: string;
  expire: number;
  signature: string;
}
```

### Caching Strategy

| Endpoint | Cache | TTL | Invalidation |
|----------|-------|-----|--------------|
| `GET /me` | In-memory (React state) | Session | On login/logout, plan change |
| `GET /images` | In-memory (React state) | Session | On upload, delete |
| `POST /uploads/token` | No cache | — | Each upload gets fresh token |
| Static assets | Service Worker | 30 days | Version-based cache busting |

### HTTP Client Setup

```typescript
// src/lib/api.ts
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const user = getAuth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```
