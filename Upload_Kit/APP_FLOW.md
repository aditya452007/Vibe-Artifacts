# APP_FLOW.md — Application Flow & Navigation

> Tech references: [TECH_STACK.md](./TECH_STACK.md)

---

## 1. Page List

| # | Page | Route | Auth Required | Description |
|---|------|-------|---------------|-------------|
| 1 | Landing | `/` | No | Hero, pricing, features, footer |
| 2 | Login | `/login` | No | Email + password sign-in |
| 3 | Signup | `/signup` | No | Email + password registration |
| 4 | Dashboard Home | `/dashboard` | Yes | Overview, quota, quick upload |
| 5 | Upload | `/dashboard/upload` | Yes | Drag-and-drop upload area |
| 6 | My Images | `/dashboard/images` | Yes | Image gallery grid |
| 7 | Account Settings | `/dashboard/settings` | Yes | Profile, tier info |
| 8 | Billing / Upgrade | `/dashboard/billing` | Yes | Plan comparison, Razorpay checkout |
| 9 | 404 Not Found | `*` | No | Fallback error page |

---

## 2. Routes & Auth States

```
[PUBLIC ROUTES]
/              → Landing Page
/login         → Login Form
/signup        → Signup Form

[PROTECTED ROUTES — redirect to /login if unauthenticated]
/dashboard          → Dashboard Home
/dashboard/upload   → Upload Area
/dashboard/images   → My Images Gallery
/dashboard/settings → Account Settings
/dashboard/billing  → Billing & Plan Upgrade

[CATCH-ALL]
*                   → 404 Page
```

### Route Guard Logic

```
if (!firebaseUser) {
  redirect → /login?returnTo={currentPath}
}

if (firebaseUser && path === "/login") {
  redirect → /dashboard
}
```

---

## 3. User Paths

### 3.1 Happy Path: First-Time User → Upload

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Landing  │───→│ Signup   │───→│Dashboard │───→│ Upload   │
│ Page     │    │ Page     │    │ Home     │    │ Page     │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │                                │
                     │ Firebase Auth                   │ 1. Request token
                     │ creates user                    │ 2. Upload to ImageKit
                     ▼                                │ 3. Register URL
              Backend: POST /me                       ▼
              (creates user doc               Backend validates quota
               if not exists)                 Stores metadata
```

**Steps:**
1. User visits `/` → sees hero + pricing
2. Clicks "Get Started" → navigates to `/signup`
3. Fills email + password → Firebase Auth creates account → JWT issued
4. Frontend calls `GET /me` → backend creates user doc (tier: free, max_images: 10)
5. Redirected to `/dashboard`
6. Clicks "Upload" → navigates to `/dashboard/upload`
7. Drags image → frontend requests signed token (`POST /uploads/token`)
8. Uploads directly to ImageKit → gets `image_url`
9. Calls `POST /uploads/register` with URL → backend stores, increments count
10. Toast: "Image uploaded successfully!" → image appears in gallery

### 3.2 Happy Path: Free User → Upgrade → Upload More

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Dashboard │───→│ Billing  │───→│ Razorpay │───→│Dashboard │
│ (quota   │    │ Page     │    │ Checkout │    │ (upgraded)│
│  full)   │    │          │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Steps:**
1. User sees quota bar at 10/10 (100%) → warning state
2. Upload attempt rejected with toast: "Quota exceeded. Upgrade your plan!"
3. Clicks "Upgrade" → navigates to `/dashboard/billing`
4. Selects "Premium" tier → backend creates Razorpay order (`POST /payments/create-order`)
5. Razorpay checkout modal opens → user completes payment
6. Razorpay sends webhook → backend verifies → updates tier to `premium`, max_images to 100
7. Frontend polls or re-fetches user data → sees updated quota
8. User can now upload up to 100 images

### 3.3 Error Path: Invalid Login

```
┌──────────┐    ┌──────────┐
│ Login    │───→│ Login    │
│ Page     │    │ Page     │
│ (submit) │    │ (error)  │
└──────────┘    └──────────┘
     │                │
     ▼                ▼
  Firebase Auth    Shake animation
  returns error    Error toast: "Invalid
                   email or password"
```

**Steps:**
1. User enters wrong email/password → clicks "Sign In"
2. Firebase Auth returns `auth/wrong-password` or `auth/user-not-found`
3. Form shows shake animation
4. Toast notification: "Invalid email or password. Please try again."
5. Input fields highlight with error state (crimson border)
6. User remains on `/login` — can retry

### 3.4 Error Path: Payment Failure

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Billing  │───→│ Razorpay │───→│ Billing  │
│ Page     │    │ Checkout │    │ Page     │
│          │    │ (fail)   │    │ (error)  │
└──────────┘    └──────────┘    └──────────┘
```

**Steps:**
1. User selects plan → Razorpay checkout opens
2. Payment fails (card declined, timeout, user cancels)
3. Razorpay closes → frontend receives failure callback
4. Toast: "Payment failed. Your plan was not changed."
5. User tier remains unchanged
6. User can retry from billing page

---

## 4. Wireframe Tokens

> These are structural tokens — not visual designs. See [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) for exact design tokens.

### Landing Page Layout

```
┌────────────────────────────────────────┐
│ [Logo]            [Login] [Signup]     │ ← Sticky Nav (56px)
├────────────────────────────────────────┤
│                                        │
│    Bold Headline                       │ ← Hero Section
│    Subheadline text                    │
│    [Get Started] [See Pricing]         │
│                                        │
├────────────────────────────────────────┤
│ ┌──────┐  ┌──────┐  ┌──────┐          │ ← Pricing Cards
│ │ Free │  │ Prem │  │Ultra │          │
│ │10 img│  │100img│  │1000  │          │
│ │[Start│  │[BUY] │  │[BUY] │          │
│ └──────┘  └──────┘  └──────┘          │
├────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │ ← Feature Cards
│ │Fast│ │Safe│ │Tier│ │Supp│          │
│ └────┘ └────┘ └────┘ └────┘          │
├────────────────────────────────────────┤
│        © ImageTier 2026               │ ← Footer
└────────────────────────────────────────┘
```

### Dashboard Layout

```
┌────────────────────────────────────────┐
│ [Logo]  [Home][Upload][Images][⚙][▼]  │ ← Dashboard Nav
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────┐      │
│  │ Quota: ████████░░ 7/10      │      │ ← Quota Bar
│  └──────────────────────────────┘      │
│                                        │
│  ┌──────────────────────────────┐      │
│  │                              │      │
│  │   Drag & Drop Upload Area   │      │ ← Upload Zone
│  │   (dashed border, pulse)    │      │
│  │                              │      │
│  └──────────────────────────────┘      │
│                                        │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │ ← Image Grid
│  │ img │ │ img │ │ img │ │ img │     │
│  │ [×] │ │ [×] │ │ [×] │ │ [×] │     │
│  └─────┘ └─────┘ └─────┘ └─────┘     │
│                                        │
└────────────────────────────────────────┘
```

---

## 5. Navigation Matrix

| From \ To | Landing | Login | Signup | Dashboard | Upload | Images | Settings | Billing |
|-----------|---------|-------|--------|-----------|--------|--------|----------|---------|
| **Landing** | — | ✓ Nav | ✓ Nav | ✓ CTA* | — | — | — | ✓ Pricing |
| **Login** | ✓ Logo | — | ✓ Link | ✓ Auth† | — | — | — | — |
| **Signup** | ✓ Logo | ✓ Link | — | ✓ Auth† | — | — | — | — |
| **Dashboard** | — | — | — | — | ✓ Nav | ✓ Nav | ✓ Nav | ✓ Nav |
| **Upload** | — | — | — | ✓ Nav | — | ✓ Nav | ✓ Nav | ✓ Nav |
| **Images** | — | — | — | ✓ Nav | ✓ Nav | — | ✓ Nav | ✓ Nav |
| **Settings** | — | — | — | ✓ Nav | ✓ Nav | ✓ Nav | — | ✓ Nav |
| **Billing** | — | — | — | ✓ Nav | ✓ Nav | ✓ Nav | ✓ Nav | — |

> `*` CTA only if authenticated — otherwise redirects to `/signup`
> `†` Auto-redirect after successful authentication

---

## 6. State Transitions

```
                    ┌───────────┐
                    │   GUEST   │
                    └─────┬─────┘
                          │ Sign Up / Log In
                          ▼
                    ┌───────────┐
                    │   FREE    │
                    │  (10 img) │
                    └─────┬─────┘
                          │ Pay for Premium
                          ▼
                    ┌───────────┐
                    │  PREMIUM  │
                    │ (100 img) │
                    └─────┬─────┘
                          │ Pay for Ultra
                          ▼
                    ┌───────────┐
                    │   ULTRA   │
                    │(1000 img) │
                    └───────────┘
```

**Notes:**
- Tier transitions are **one-way upward** (no downgrade in MVP).
- Tier changes are only processed via verified Razorpay webhooks.
- `ASSUMPTION: No plan downgrade or cancellation in MVP. Justification: Simplifies payment flow and avoids refund logic.`
