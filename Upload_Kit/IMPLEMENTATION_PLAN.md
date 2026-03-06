# IMPLEMENTATION_PLAN.md — Stepwise Build Plan

> Tech references: [TECH_STACK.md](./TECH_STACK.md)
> API spec: [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)
> UI spec: [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md)
> App flow: [APP_FLOW.md](./APP_FLOW.md)

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Backend Scaffold — Effort: **S**

- [ ] Create `backend/` directory with modular structure (see [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) §1)
- [ ] Initialize `requirements.txt` with pinned versions from [TECH_STACK.md](./TECH_STACK.md) §3
- [ ] Create `main.py` with FastAPI app, CORS middleware, router includes
- [ ] Create `shared/config.py` — load all env vars via `python-dotenv`
- [ ] Create `.env.example` with all required variables

**Acceptance Test:**
```bash
cd backend && pip install -r requirements.txt
uvicorn main:app --reload
# GET http://localhost:8000/health → 200
```

### 1.2 Frontend Scaffold — Effort: **S**

- [ ] Initialize Vite+React project: `npx -y create-vite@latest ./ --template react`
- [ ] Install dependencies: `react-router-dom`, `firebase`, `axios`, `gsap`, `react-hot-toast`, `react-dropzone`
- [ ] Set up project structure:
  ```
  src/
   ├── components/    # Reusable UI components
   ├── pages/         # Route-level page components
   ├── lib/           # API client, Firebase config, utilities
   ├── hooks/         # Custom React hooks
   ├── styles/        # CSS files with design tokens
   └── App.jsx        # Router + auth provider
  ```
- [ ] Create `src/styles/tokens.css` with all CSS custom properties from [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) §1

**Acceptance Test:**
```bash
npm install && npm run dev
# http://localhost:5173 → Vite React default page loads
```

### 1.3 MongoDB Atlas Setup — Effort: **S**

- [ ] Create MongoDB Atlas M0 cluster
- [ ] Create `imagetier` database
- [ ] Create `users`, `images`, `payments` collections
- [ ] Apply indexes (see [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) §2)
- [ ] Get connection URI → `.env`

**Acceptance Test:**
```bash
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; asyncio.run(AsyncIOMotorClient('mongodb+srv://...').imagetier.command('ping'))"
```

### 1.4 Firebase Project Setup — Effort: **S**

- [ ] Create Firebase project
- [ ] Enable Firebase Auth (Email/Password provider)
- [ ] Download service account key → `backend/serviceAccountKey.json`
- [ ] Configure Firebase Hosting
- [ ] Get Firebase config object → `frontend/.env`

**Acceptance Test:**
- Firebase Console shows project active
- Auth sign-in method enabled

### 1.5 External Service Registration — Effort: **S**

- [ ] Create ImageKit account → get Public Key, Private Key, URL Endpoint → `.env`
- [ ] Create Razorpay account (test mode) → get Key ID, Key Secret, Webhook Secret → `.env`

---

## Phase 2: Authentication

### 2.1 Backend Auth Module — Effort: **M**

- [ ] `shared/dependencies.py` — Create `get_current_user` dependency:
  - Extract Bearer token from `Authorization` header
  - Verify via `firebase_admin.auth.verify_id_token(token)`
  - Return `firebase_uid` and `email`
- [ ] `modules/auth/model.py` — `get_or_create_user(firebase_uid, email)`:
  - Check if user exists in `users` collection
  - If not, create with defaults (tier: free, max_images: 10)
  - Return user document
- [ ] `modules/auth/api.py` — `GET /api/v1/me` route
- [ ] `modules/auth/schemas.py` — Pydantic `UserProfileResponse`

**Acceptance Test:**
```bash
# With valid Firebase token:
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/me
# → 200 with user profile JSON

# Without token:
curl http://localhost:8000/api/v1/me
# → 401
```

### 2.2 Frontend Auth — Effort: **M**

- [ ] `src/lib/firebase.js` — Initialize Firebase app + auth
- [ ] `src/hooks/useAuth.js` — Custom hook for auth state (user, loading, error)
- [ ] `src/components/ProtectedRoute.jsx` — Redirect to `/login` if unauthenticated
- [ ] `src/pages/LoginPage.jsx` — Email+password form, Firebase signIn, error handling
- [ ] `src/pages/SignupPage.jsx` — Email+password form, Firebase createUser, auto-login
- [ ] Connect to backend `GET /me` on successful auth

**Acceptance Test:**
- Sign up → auto-login → redirect to `/dashboard`
- Login with wrong credentials → error shake + toast
- Access `/dashboard` while logged out → redirect to `/login`

---

## Phase 3: Image Upload

### 3.1 Backend Upload Module — Effort: **M**

- [ ] `modules/uploads/service.py` — `generate_imagekit_auth()`:
  - Use `imagekitio` SDK to generate signed auth params
- [ ] `modules/uploads/service.py` — `register_image(user_id, image_url, file_id)`:
  - Atomic quota check + increment (see [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) §3.2)
  - Insert into `images` collection
- [ ] `modules/uploads/service.py` — `delete_image(user_id, image_id)`:
  - Verify ownership → delete from `images` → decrement `image_count`
- [ ] `modules/uploads/api.py` — Three routes
- [ ] `modules/uploads/schemas.py` — Request/response models

**Acceptance Test:**
```bash
# Token request
curl -X POST -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/uploads/token
# → 200 with token, expire, signature

# Register (after uploading to ImageKit)
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://ik.imagekit.io/xxx/test.jpg","imagekit_file_id":"file_123"}' \
  http://localhost:8000/api/v1/uploads/register
# → 201

# Exceed quota (after 10 uploads on free tier)
# → 403
```

### 3.2 Frontend Upload — Effort: **M**

- [ ] `src/components/UploadBox.jsx` — Drag-and-drop using `react-dropzone`
  - Request signed token from backend
  - Upload to ImageKit using signed params
  - On success → call `POST /uploads/register`
  - Show progress bar, preview, toast
- [ ] `src/components/QuotaIndicator.jsx` — Progress bar with warning states
- [ ] `src/pages/UploadPage.jsx` — Combine upload box + quota indicator

**Acceptance Test:**
- Drag image → uploads to ImageKit → metadata stored → toast success
- Quota bar updates in real-time
- At 10/10 → upload rejected with toast error

---

## Phase 4: Image Gallery

### 4.1 Backend Gallery Endpoint — Effort: **S**

- [ ] Add `GET /api/v1/uploads` — returns paginated list of user's images
- [ ] Sorted by `uploaded_at` descending

### 4.2 Frontend Gallery — Effort: **M**

- [ ] `src/components/ImageCard.jsx` — Thumbnail + delete + timestamp
- [ ] `src/pages/ImagesPage.jsx` — Grid gallery, skeleton loading, empty state
- [ ] Delete flow: confirm → API call → optimistic removal → toast

**Acceptance Test:**
- Gallery loads with skeleton placeholders
- Images displayed in grid
- Delete removes image and updates quota

---

## Phase 5: Payments & Tier Upgrade

### 5.1 Backend Payments Module — Effort: **M**

- [ ] `modules/payments/service.py` — `create_razorpay_order(user_id, target_tier)`:
  - Validate tier upgrade (no downgrade)
  - Create Razorpay order via SDK
  - Store in `payments` collection
- [ ] `modules/payments/service.py` — `verify_webhook(body, signature)`:
  - HMAC-SHA256 verification
  - Idempotent tier update
- [ ] `modules/payments/api.py` — Two routes
- [ ] `modules/payments/schemas.py` — Models

**Acceptance Test:**
```bash
# Create order
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"target_tier":"premium"}' \
  http://localhost:8000/api/v1/payments/create-order
# → 200 with order_id, amount, currency

# Simulate webhook (Razorpay test mode)
# → tier updated to premium, max_images to 100
```

### 5.2 Frontend Billing — Effort: **M**

- [ ] `src/pages/BillingPage.jsx` — Pricing cards + Razorpay checkout integration
- [ ] Load Razorpay checkout script dynamically
- [ ] On payment success → re-fetch user profile → update UI
- [ ] On payment failure → toast error

**Acceptance Test:**
- Click upgrade → Razorpay modal opens
- Complete payment → tier updates → quota bar shows new limit
- Cancel payment → no change → toast "Payment cancelled"

---

## Phase 6: Landing Page & Polish

### 6.1 Landing Page — Effort: **M**

- [ ] `src/pages/LandingPage.jsx` — Hero + Pricing + Features + Footer
- [ ] Implement all GSAP animations (see [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) §5)
- [ ] Dark/Light mode toggle with `localStorage` persistence
- [ ] Responsive across all breakpoints

### 6.2 Dashboard Polish — Effort: **S**

- [ ] `src/pages/SettingsPage.jsx` — Basic account info, current tier, email
- [ ] `src/components/Navigation.jsx` — Sticky nav with glassmorphism
- [ ] Skeleton loading states for all dashboard panels
- [ ] 404 page

**Acceptance Test:**
- Landing page looks premium across mobile/tablet/desktop
- GSAP animations smooth, no layout shift
- Dark mode toggle works, persists on refresh

---

## Phase 7: Security Hardening

### 7.1 Backend Security — Effort: **S**

- [ ] Add rate limiting middleware (`slowapi`): per-endpoint limits as specified in [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)
- [ ] Validate all Pydantic schemas strictly (reject unknown fields)
- [ ] CORS: restrict origins to production domain
- [ ] Input sanitization on `image_url` (validate URL format)

### 7.2 Frontend Security — Effort: **S**

- [ ] No secrets in frontend code (all via `VITE_` env vars)
- [ ] XSS prevention: no `dangerouslySetInnerHTML`
- [ ] HTTPS enforcement (Firebase Hosting default)

---

## Phase 8: Deployment

### 8.1 Backend Deployment — Effort: **M**

- [ ] Create `Dockerfile` for backend:
  ```dockerfile
  FROM python:3.13-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
  ```
- [ ] Deploy to Cloud Run (or small VM)
- [ ] Set environment variables in Cloud Run
- [ ] Configure Razorpay webhook URL to production endpoint

### 8.2 Frontend Deployment — Effort: **S**

- [ ] `npm run build` → `dist/` output
- [ ] `firebase deploy --only hosting`
- [ ] Configure rewrites for SPA: `"rewrites": [{ "source": "**", "destination": "/index.html" }]`

**Acceptance Test:**
- Production URL loads frontend
- All API calls work with production backend
- Payment flow works in Razorpay live mode

---

## Phase 9: Testing & Verification

### 9.1 Backend Tests — Effort: **M**

- [ ] Unit tests for quota logic (atomic check)
- [ ] Unit tests for webhook signature verification
- [ ] Integration tests for each API endpoint
- [ ] Test with expired / invalid Firebase tokens

### 9.2 Frontend Tests — Effort: **S**

- [ ] Browser test: full signup → upload → delete flow
- [ ] Browser test: login with invalid credentials → error state
- [ ] Visual test: responsive layout at 375px, 768px, 1024px, 1440px
- [ ] Accessibility audit: Lighthouse score ≥ 90

---

## CI/CD Hooks

| Stage | Tool | Command |
|-------|------|---------|
| Lint (backend) | `ruff` | `ruff check backend/` |
| Lint (frontend) | `eslint` | `npx eslint src/` |
| Type check | — | N/A (Python uses Pydantic; frontend is JS) |
| Test (backend) | `pytest` | `cd backend && pytest` |
| Build (frontend) | Vite | `npm run build` |
| Deploy (frontend) | Firebase CLI | `firebase deploy --only hosting` |
| Deploy (backend) | Cloud Run | `gcloud run deploy` |

---

## Rollback Plan

| Component | Rollback Method |
|-----------|----------------|
| Frontend | Firebase Hosting supports instant rollback to previous version via Console |
| Backend | Cloud Run revisions — route traffic back to previous revision |
| Database | MongoDB Atlas point-in-time restore (M10+ tier) or manual document revert |
| Razorpay webhook | Update webhook URL in Razorpay dashboard |

---

## Effort Summary

| Phase | Effort | Tasks |
|-------|--------|-------|
| 1. Setup | S | 5 tasks |
| 2. Auth | M | 2 tasks |
| 3. Upload | M | 2 tasks |
| 4. Gallery | M | 2 tasks |
| 5. Payments | M | 2 tasks |
| 6. Landing | M | 2 tasks |
| 7. Security | S | 2 tasks |
| 8. Deploy | M | 2 tasks |
| 9. Testing | M | 2 tasks |
| **Total** | **~2 weeks** | **21 tasks** |
