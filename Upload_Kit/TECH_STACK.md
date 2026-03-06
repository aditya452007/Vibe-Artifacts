# TECH_STACK.md — Single Source of Truth

> `as-of: 2026-03-03`
> All versions verified against npm registry and PyPI on this date.

---

## 1. Runtime Environments

| Runtime | Version | Citation |
|---------|---------|----------|
| Node.js | `v24.11.1` LTS | [nodejs.org/en/download](https://nodejs.org/en/download) |
| Python  | `3.13.7`       | [python.org/downloads](https://www.python.org/downloads/) |

---

## 2. Frontend Stack

| Package | Version | Citation | Purpose |
|---------|---------|----------|---------|
| `react` | `19.2.4` | [npmjs.com/package/react](https://www.npmjs.com/package/react) | UI library |
| `react-dom` | `19.2.4` | [npmjs.com/package/react-dom](https://www.npmjs.com/package/react-dom) | DOM renderer |
| `react-router-dom` | `7.13.1` | [npmjs.com/package/react-router-dom](https://www.npmjs.com/package/react-router-dom) | Client-side routing |
| `vite` | `7.3.1` | [npmjs.com/package/vite](https://www.npmjs.com/package/vite) | Build tool & dev server |
| `@vitejs/plugin-react` | `5.1.4` | [npmjs.com/package/@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) | React Fast Refresh for Vite |
| `firebase` | `12.10.0` | [npmjs.com/package/firebase](https://www.npmjs.com/package/firebase) | Firebase JS SDK (Auth) |
| `gsap` | `3.14.2` | [npmjs.com/package/gsap](https://www.npmjs.com/package/gsap) | Animations (GSAP) |
| `axios` | `1.13.6` | [npmjs.com/package/axios](https://www.npmjs.com/package/axios) | HTTP client |
| `react-hot-toast` | `2.6.0` | [npmjs.com/package/react-hot-toast](https://www.npmjs.com/package/react-hot-toast) | Toast notifications |
| `react-dropzone` | `15.0.0` | [npmjs.com/package/react-dropzone](https://www.npmjs.com/package/react-dropzone) | File upload drag-and-drop |
| `imagekitio-react` | `TODO: verify` | [npmjs.com/package/imagekitio-react](https://www.npmjs.com/package/imagekitio-react) | ImageKit React SDK |

### Frontend Dev Dependencies

| Package | Version | Citation | Purpose |
|---------|---------|----------|---------|
| `eslint` | `TODO: verify` | [npmjs.com/package/eslint](https://www.npmjs.com/package/eslint) | Linter |
| `prettier` | `TODO: verify` | [npmjs.com/package/prettier](https://www.npmjs.com/package/prettier) | Code formatter |

### Fonts (CDN)

| Font | Source |
|------|--------|
| Inter | [fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter) |
| Poppins | [fonts.google.com/specimen/Poppins](https://fonts.google.com/specimen/Poppins) |

---

## 3. Backend Stack

| Package | Version | Citation | Purpose |
|---------|---------|----------|---------|
| `fastapi` | `0.135.1` | [pypi.org/project/fastapi](https://pypi.org/project/fastapi/) | Web framework |
| `uvicorn` | `0.41.0` | [pypi.org/project/uvicorn](https://pypi.org/project/uvicorn/) | ASGI server |
| `pydantic` | `2.11.7` | [pypi.org/project/pydantic](https://pypi.org/project/pydantic/) | Data validation & schemas |
| `motor` | `3.7.1` | [pypi.org/project/motor](https://pypi.org/project/motor/) | Async MongoDB driver |
| `pymongo` | `4.16.0` | [pypi.org/project/pymongo](https://pypi.org/project/pymongo/) | MongoDB driver (motor dependency) |
| `firebase-admin` | `7.2.0` | [pypi.org/project/firebase-admin](https://pypi.org/project/firebase-admin/) | Firebase Admin SDK (JWT verification) |
| `razorpay` | `2.0.0` | [pypi.org/project/razorpay](https://pypi.org/project/razorpay/) | Razorpay payment SDK |
| `imagekitio` | `5.2.0` | [pypi.org/project/imagekitio](https://pypi.org/project/imagekitio/) | ImageKit server-side SDK |
| `python-dotenv` | `1.1.0` | [pypi.org/project/python-dotenv](https://pypi.org/project/python-dotenv/) | Environment variable loader |
| `python-multipart` | `TODO: verify` | [pypi.org/project/python-multipart](https://pypi.org/project/python-multipart/) | Form data parsing for FastAPI |

---

## 4. Database

| Service | Tier | Version / Notes | Citation |
|---------|------|----------------|----------|
| MongoDB Atlas | M0 Free Tier | MongoDB 8.x (Atlas managed) | [mongodb.com/atlas](https://www.mongodb.com/atlas) |

- **Driver**: `motor@3.7.1` (async) + `pymongo@4.16.0`
- **Connection**: `MONGODB_URI` environment variable, connection pooling via Motor defaults
- **Indexes**: `firebase_uid` (unique), `user_id` (images), `tier` (optional)

---

## 5. External Services

| Service | Purpose | Free Tier Limits | Link |
|---------|---------|-----------------|------|
| Firebase Auth | Authentication (JWT) | Unlimited for most sign-in methods | [firebase.google.com/products/auth](https://firebase.google.com/products/auth) |
| Firebase Hosting | Frontend hosting | 10 GB/month transfer, 1 GB storage | [firebase.google.com/products/hosting](https://firebase.google.com/products/hosting) |
| ImageKit.io | Image storage + CDN | 20 GB bandwidth/month, unlimited transformations | [imagekit.io/plans](https://imagekit.io/plans) |
| Razorpay | Payment gateway | No monthly fee, 2% per transaction | [razorpay.com/pricing](https://razorpay.com/pricing/) |

---

## 6. Infrastructure & Deployment

| Component | Provider | Notes |
|-----------|----------|-------|
| Frontend Hosting | Firebase Hosting | SPA using `firebase deploy` |
| Backend Hosting | Google Cloud Run / Small VM | Stateless container, auto-scales | `ASSUMPTION: Cloud Run preferred for zero-ops` |
| Database | MongoDB Atlas (M0) | Free tier, upgradeable |
| CI/CD | GitHub Actions | `TODO: verify` — define pipeline |
| Secrets | Environment variables | `.env` locally, Cloud Run secrets or VM env in production |

---

## 7. Development Tooling

| Tool | Purpose |
|------|---------|
| VS Code | Primary IDE |
| Vite Dev Server (`npm run dev`) | Frontend hot-reload |
| Uvicorn (`--reload`) | Backend hot-reload |
| Firebase CLI | Hosting deployment |
| Postman / Thunder Client | API testing |
| MongoDB Compass | Database GUI |

---

## 8. Architecture Decision Records

### ADR-001: Vite over CRA / Next.js
- **Decision**: Use Vite for frontend build.
- **Rationale**: Faster dev server (ESM-native), simpler config, no SSR needed for this SPA.
- **Alternative**: Next.js — overkill for a client-heavy SPA with no SEO requirements on dashboard pages.

### ADR-002: FastAPI over Flask / Django
- **Decision**: Use FastAPI as backend framework.
- **Rationale**: Native async, automatic OpenAPI docs, Pydantic validation, high performance.
- **Alternative**: Flask — simpler but no async; Django — too heavy for this API-only service.

### ADR-003: Motor over PyMongo
- **Decision**: Use Motor (async MongoDB driver) for all database operations.
- **Rationale**: Async I/O aligns with FastAPI's async architecture, preventing thread blocking.
- **Alternative**: PyMongo sync driver — would block the event loop in FastAPI.

### ADR-004: Firebase Auth over Custom Auth
- **Decision**: Delegate authentication to Firebase Auth.
- **Rationale**: No password storage, free tier generously unlimited, battle-tested security.
- **Alternative**: Custom JWT auth — more control but significantly more security surface area.

### ADR-005: Direct Upload to ImageKit
- **Decision**: Frontend uploads images directly to ImageKit via signed tokens.
- **Rationale**: Backend never handles binary data → lower bandwidth, lower cost, faster uploads.
- **Alternative**: Proxy through backend — adds latency and backend load.

---

## 9. Security Baseline

| Concern | Implementation |
|---------|---------------|
| Auth | Firebase ID token verified server-side via `firebase-admin` SDK |
| Payment Verification | Razorpay webhook signature verification (HMAC-SHA256) |
| Input Validation | Pydantic schemas on all request bodies |
| Rate Limiting | FastAPI middleware (`slowapi` or custom), keyed by `firebase_uid` |
| CORS | Restrict origins to Firebase Hosting domain |
| Secrets | Never committed; loaded via `python-dotenv` or cloud secret manager |
| HTTPS | Enforced by Firebase Hosting + Cloud Run |
