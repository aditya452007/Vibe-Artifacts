# Agent_SOP.md — Standard Operating Procedure for AI Agent

> Tech references: [TECH_STACK.md](./TECH_STACK.md)
> API spec: [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)
> UI spec: [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md)
> Build plan: [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
> App flow: [APP_FLOW.md](./APP_FLOW.md)
> Requirements: [PRD.md](./PRD.md)

---

## 1. Agent Responsibilities

The AI agent is responsible for:

1. **Building the ImageTier application** by following [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) phase-by-phase.
2. **Generating production-quality code** that matches specs in [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) and [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md).
3. **Using exact library versions** from [TECH_STACK.md](./TECH_STACK.md) — never substitute or upgrade without explicit approval.
4. **Running verification tests** after each phase.
5. **Reporting blockers** (missing credentials, API errors, ambiguous requirements) immediately.

---

## 2. Input/Output Contract

### Inputs Provided to Agent

| Input | Source | Format |
|-------|--------|--------|
| Project specification | `Struct.md` | Markdown |
| Tech stack (versions) | `TECH_STACK.md` | Markdown table |
| API specification | `BACKEND_STRUCTURE.md` | Markdown (method, path, req/res JSON) |
| Design tokens | `FRONTEND_GUIDELINES.md` | CSS custom properties, component specs |
| Build sequence | `IMPLEMENTATION_PLAN.md` | Phased checklist |
| App flow | `APP_FLOW.md` | Routes, navigation matrix |
| Environment variables | `.env.example` | Key-value pairs |

### Outputs Produced by Agent

| Output | Location | Description |
|--------|----------|-------------|
| Backend code | `backend/` | FastAPI modular monolith |
| Frontend code | `frontend/` or root Vite project | React SPA |
| Config files | Root | `firebase.json`, `Dockerfile`, `.env.example` |
| Test results | Terminal output | Pass/fail for acceptance tests |
| Status updates | Conversation | Phase completion reports |

---

## 3. Phase Execution Protocol

For each phase in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md):

```
1. READ  — Read the phase requirements and acceptance tests
2. BUILD — Generate code files following the specs
3. TEST  — Run the acceptance test commands
4. FIX   — If tests fail, debug and fix
5. REPORT — Confirm phase completion with test results
```

### Sequencing Rules

- **Complete each phase before moving to the next.**
- **Do not skip phases** — dependencies exist between them.
- **Phase 1 (Setup) must be fully verified** before any other phase begins.
- Within a phase, backend tasks before frontend tasks (APIs must exist before UI connects to them).

---

## 4. Idempotency Checks

Before executing any creation/modification, verify:

| Action | Check | Skip If |
|--------|-------|---------|
| Create directory | Does it already exist? | Yes → skip |
| Install packages | Are they already installed? | Yes → skip |
| Create database | Does collection exist? | Yes → skip |
| Create indexes | Does index exist? | Yes → skip |
| Write file | Does file already have correct content? | Yes → skip |
| Run migrations | Has migration already been applied? | Yes → skip |

**Rule:** Every agent action must be safe to run multiple times without side effects.

---

## 5. Error Handling Protocol

### 5.1 Build Errors

| Error Type | Response |
|------------|----------|
| Syntax error | Fix immediately — check against spec |
| Import error | Verify package installed from [TECH_STACK.md](./TECH_STACK.md) |
| Type error | Check Pydantic schema / component props |
| Version conflict | Use EXACT version from [TECH_STACK.md](./TECH_STACK.md), do not upgrade |

### 5.2 Runtime Errors

| Error Type | Response |
|------------|----------|
| MongoDB connection failure | Verify `MONGODB_URI` in `.env` — report if invalid |
| Firebase token error | Verify `FIREBASE_PROJECT_ID` and service account key |
| ImageKit auth failure | Verify ImageKit credentials in `.env` |
| Razorpay API error | Verify Razorpay keys — check test vs live mode |
| CORS error | Check `CORS_ORIGINS` includes frontend URL |

### 5.3 Blockers

If the agent encounters a blocker it cannot resolve:

```
1. Stop the current phase
2. Document the exact error (full traceback)
3. Identify the root cause
4. Propose 1-2 solutions
5. Ask the user for decision
```

---

## 6. Code Quality Standards

### Backend (Python/FastAPI)

| Standard | Requirement |
|----------|-------------|
| Async | All DB operations use `await` with Motor |
| Validation | Pydantic models on ALL request/response bodies |
| Error responses | Use FastAPI `HTTPException` with descriptive messages |
| Logging | Structured JSON logs (see [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) §6.2) |
| No raw strings | Use constants/enums for tier names, status values |
| Docstrings | Every service function has a one-line docstring |

### Frontend (React/Vite)

| Standard | Requirement |
|----------|-------------|
| CSS Variables | Use design tokens from [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) — no hardcoded colors |
| Component props | Match exactly as defined in component catalog |
| No `any` types | If using TypeScript — proper types (or JSDoc for JS) |
| Accessibility | ARIA labels, keyboard nav, focus states on all interactive elements |
| Error states | Every form / API call has loading, success, and error states |
| No inline styles | CSS modules or CSS files with design tokens |

---

## 7. Test Commands

### Backend

```bash
# Install dependencies
cd backend && pip install -r requirements.txt

# Start dev server
uvicorn main:app --reload --port 8000

# Health check
curl http://localhost:8000/health

# Run tests (when available)
cd backend && pytest -v
```

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npx eslint src/
```

### End-to-End Manual Test Sequence

```
1. Open http://localhost:5173
2. Click "Get Started" → navigate to /signup
3. Create account with test email
4. Verify redirect to /dashboard
5. Check quota shows 0/10
6. Upload an image via drag-and-drop
7. Verify image appears in gallery
8. Verify quota shows 1/10
9. Delete the image
10. Verify quota shows 0/10
11. Navigate to /dashboard/billing
12. Click "Upgrade to Premium"
13. Complete Razorpay test payment
14. Verify quota shows 0/100
15. Toggle dark/light mode
16. Verify styles are correct in both modes
17. Resize to mobile (375px) → verify responsive layout
18. Log out → verify redirect to /login
19. Try accessing /dashboard → verify redirect to /login
```

---

## 8. Verification Checklist

Run this checklist after completing ALL phases:

### Functional

- [ ] Signup creates Firebase user + MongoDB user doc
- [ ] Login returns valid JWT → backend verifies
- [ ] Upload flow: token → ImageKit → register → quota update
- [ ] Upload rejected at quota limit
- [ ] Delete removes image + decrements quota
- [ ] Gallery displays all user images
- [ ] Payment creates Razorpay order → webhook updates tier
- [ ] Webhook is idempotent (re-processing same event is safe)
- [ ] Unauthenticated requests return 401
- [ ] Users cannot access other users' images

### Non-Functional

- [ ] LCP < 2.5s (Lighthouse)
- [ ] CLS < 0.1 (Lighthouse)
- [ ] WCAG AA contrast ratios met
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Dark mode fully functional
- [ ] `prefers-reduced-motion` disables animations
- [ ] No console errors in production build
- [ ] All environment variables documented in `.env.example`

### Security

- [ ] No secrets in frontend code or git history
- [ ] CORS restricted to production origin
- [ ] Webhook signature verified
- [ ] Rate limiting active on all endpoints
- [ ] Input validation on all endpoints (Pydantic)

---

## 9. File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React component | PascalCase | `UploadBox.jsx` |
| React page | PascalCase + "Page" | `DashboardPage.jsx` |
| CSS file | kebab-case | `upload-box.css` |
| Python module | snake_case | `api.py`, `service.py` |
| Environment | SCREAMING_SNAKE | `MONGODB_URI` |
| API route | kebab-case | `/api/v1/uploads/token` |

---

## 10. Communication Protocol

| Event | Agent Action |
|-------|-------------|
| Phase completed successfully | Report: "Phase X complete. All acceptance tests passed." |
| Minor issue fixed | Note inline, continue |
| Blocker encountered | Stop, report error + proposed solutions |
| Ambiguous requirement | Ask user for clarification before proceeding |
| External service needs setup | Provide step-by-step instructions for user |
| Credential needed | Request specific credential with explanation of what it's for |
