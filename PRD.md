# PRD.md — Product Requirements Document

## ImageTier: Image Storage SaaS with Tiered Access

---

## 1. Summary

ImageTier is a web application that allows users to upload and manage images with tiered subscription plans (Free → Premium → Ultra). Images are stored on ImageKit.io CDN, metadata in MongoDB Atlas, authentication via Firebase Auth, and payments via Razorpay. The backend is a stateless Python FastAPI service.

**Target:** 100–1,000 initial users, architecture designed for horizontal scaling to millions without rewrite.

---

## 2. Scope

### In Scope

| Feature | Description |
|---------|-------------|
| User Authentication | Sign up / Log in via Firebase Auth (email + password) |
| Tiered Subscriptions | Free (10 images), Premium (100), Ultra (1000) |
| Image Upload | Direct-to-ImageKit with signed tokens; backend stores metadata |
| Image Management | View gallery, delete images |
| Upload Quota | Server-enforced limits based on tier |
| Plan Upgrade | Razorpay payment → webhook-verified tier change |
| Dashboard | Upload area, image gallery, quota indicator, account settings |
| Dark/Light Mode | Toggleable theme with system-default detection |
| Responsive Design | Mobile-first, 320px–1440px+ |

### Out of Scope

- Microservices architecture
- Kubernetes orchestration
- Complex caching layers (Redis)
- Bloom filters
- Distributed message queues
- Image editing / transformation UI
- Social features (sharing, commenting)
- Admin panel

---

## 3. Features — Acceptance Criteria & Observability

### F-001: User Authentication

| Criterion | Detail |
|-----------|--------|
| AC-1 | User can sign up with email + password via Firebase Auth |
| AC-2 | User can log in and receive a valid JWT |
| AC-3 | JWT is sent in `Authorization: Bearer <token>` header on all API calls |
| AC-4 | Backend verifies token; returns 401 on invalid/expired token |
| AC-5 | New user gets `free` tier with `max_images=10` on first login |
| **Metric** | Auth success rate, average token verification latency (ms) |

### F-002: Image Upload

| Criterion | Detail |
|-----------|--------|
| AC-1 | Frontend requests signed upload token from `POST /uploads/token` |
| AC-2 | Frontend uploads image directly to ImageKit using signed params |
| AC-3 | Frontend sends returned `image_url` to `POST /uploads/register` |
| AC-4 | Backend validates quota → stores metadata → increments `image_count` |
| AC-5 | Upload rejected with 403 if quota exceeded |
| AC-6 | Drag-and-drop and click-to-select both work |
| AC-7 | File preview shown before upload |
| **Metric** | Upload success rate, average upload time (s), quota rejection rate |

### F-003: Image Gallery

| Criterion | Detail |
|-----------|--------|
| AC-1 | Dashboard shows grid of user's uploaded images |
| AC-2 | Each card shows thumbnail, upload timestamp, delete action |
| AC-3 | Delete calls `DELETE /uploads/{id}` and decrements `image_count` |
| AC-4 | Gallery loads with skeleton placeholders |
| **Metric** | Gallery load time (LCP), delete error rate |

### F-004: Upload Quota

| Criterion | Detail |
|-----------|--------|
| AC-1 | Quota bar shows `image_count / max_images` visually |
| AC-2 | Warning state when ≥80% of quota used |
| AC-3 | Tooltip on hover shows exact usage |
| AC-4 | Quota is enforced atomically on the backend (no race conditions) |
| **Metric** | Quota check latency (ms), concurrent upload race condition rate |

### F-005: Plan Upgrade (Razorpay)

| Criterion | Detail |
|-----------|--------|
| AC-1 | User selects tier → backend calls `POST /payments/create-order` |
| AC-2 | Razorpay checkout opens in frontend |
| AC-3 | On success, Razorpay sends webhook to `POST /payments/webhook` |
| AC-4 | Backend verifies HMAC-SHA256 signature |
| AC-5 | On verified success: update `tier`, `max_images`, `payment_status` |
| AC-6 | Frontend never trusted for payment confirmation |
| **Metric** | Payment success rate, webhook delivery latency (ms), upgrade completion rate |

### F-006: Dark/Light Mode

| Criterion | Detail |
|-----------|--------|
| AC-1 | Toggle switches themes smoothly via CSS custom properties |
| AC-2 | Preference persisted in `localStorage` |
| AC-3 | Default follows `prefers-color-scheme` system setting |
| AC-4 | All text meets WCAG 2.1 AA contrast ratio (4.5:1) |
| **Metric** | Theme toggle usage rate |

---

## 4. Business Constraints

| Constraint | Detail |
|------------|--------|
| Budget | Must operate entirely on free tiers initially (Firebase, MongoDB Atlas M0, ImageKit free) |
| Timeline | MVP in 2 weeks |
| Scale | 100–1,000 users initially; architecture must allow horizontal scaling without code rewrite |
| Payments | Razorpay only (India-market focus) |
| Hosting | Frontend on Firebase Hosting; backend on Cloud Run or small VM |

---

## 5. Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TBT (Total Blocking Time) | Minimized |
| Image upload (client → ImageKit) | < 3s for 5MB image on broadband |
| API response (backend) | < 200ms p95 |

### Security

| Requirement | Implementation |
|-------------|---------------|
| Authentication | Firebase JWT verified on every request (see [TECH_STACK.md](./TECH_STACK.md) §9) |
| Payment integrity | Webhook signature verification only |
| Input validation | Pydantic schemas on all endpoints |
| Rate limiting | Per-user upload rate limiting (see [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)) |
| CORS | Restricted to production domain |
| Secrets management | Environment variables, never in source |

### Reliability

| Requirement | Detail |
|-------------|--------|
| Stateless backend | No in-memory sessions; horizontal scaling ready |
| Graceful degradation | Toast errors on transient failures; retry logic on uploads |
| Data durability | MongoDB Atlas replication (default 3-node replica set on M0) |

### Scalability (see [TECH_STACK.md](./TECH_STACK.md) §8)

| Phase | Action |
|-------|--------|
| Current (100–1K) | Single backend, MongoDB M0, free-tier services |
| Growth (1K–100K) | Add backend instances, upgrade MongoDB tier, add Redis for rate limiting |
| Scale (100K+) | Horizontal backend (Cloud Run), MongoDB sharding, CDN caching, read replicas |
