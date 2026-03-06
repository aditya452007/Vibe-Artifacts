# BACKEND_STRUCTURE.md — Database Schema, API Spec & Observability

> Tech references: [TECH_STACK.md](./TECH_STACK.md)

---

## 1. Architecture Overview

```
backend/
 ├── modules/
 │    ├── auth/
 │    │    ├── api.py          # Routes: GET /me
 │    │    ├── service.py      # Firebase token verification, user provisioning
 │    │    ├── model.py        # User DB operations
 │    │    └── schemas.py      # UserProfile response model
 │    ├── uploads/
 │    │    ├── api.py          # Routes: POST /uploads/token, POST /uploads/register, DELETE /uploads/{id}
 │    │    ├── service.py      # Quota check, ImageKit auth, metadata management
 │    │    ├── model.py        # Image DB operations
 │    │    └── schemas.py      # Upload request/response models
 │    ├── payments/
 │    │    ├── api.py          # Routes: POST /payments/create-order, POST /payments/webhook
 │    │    ├── service.py      # Razorpay order creation, webhook verification
 │    │    ├── model.py        # Payment-related DB updates
 │    │    └── schemas.py      # Payment request/response models
 ├── shared/
 │    ├── config.py            # Environment variables, constants
 │    ├── database.py          # MongoDB connection (Motor)
 │    ├── dependencies.py      # FastAPI dependencies (auth middleware)
 │    ├── exceptions.py        # Custom exception handlers
 │    └── middleware.py        # CORS, rate limiting
 ├── main.py                   # FastAPI app entry point
 ├── requirements.txt          # Python dependencies
 └── .env.example              # Environment variable template
```

---

## 2. Database Schema

### 2.1 `users` Collection

| Field | Type | Required | Index | Default | Description |
|-------|------|----------|-------|---------|-------------|
| `_id` | `ObjectId` | auto | PK | auto | MongoDB document ID |
| `firebase_uid` | `string` | yes | **unique** | — | Firebase Auth UID |
| `email` | `string` | yes | — | — | User email address |
| `tier` | `string` (enum: `free`, `premium`, `ultra`) | yes | optional | `"free"` | Subscription tier |
| `image_count` | `int` | yes | — | `0` | Current upload count |
| `max_images` | `int` | yes | — | `10` | Max allowed by tier |
| `payment_status` | `string` (enum: `paid`, `unpaid`) | yes | — | `"unpaid"` | Payment state |
| `created_at` | `datetime` | yes | — | `utcnow()` | Account creation time |
| `updated_at` | `datetime` | yes | — | `utcnow()` | Last modification time |

**Indexes:**
```javascript
db.users.createIndex({ "firebase_uid": 1 }, { unique: true })
db.users.createIndex({ "tier": 1 })  // optional, for analytics
```

### 2.2 `images` Collection

| Field | Type | Required | Index | Default | Description |
|-------|------|----------|-------|---------|-------------|
| `_id` | `ObjectId` | auto | PK | auto | MongoDB document ID |
| `user_id` | `string` | yes | **indexed** | — | `firebase_uid` of owner |
| `image_url` | `string` | yes | — | — | ImageKit CDN URL |
| `imagekit_file_id` | `string` | no | — | — | ImageKit file ID (for deletion) |
| `uploaded_at` | `datetime` | yes | — | `utcnow()` | Upload timestamp |

**Indexes:**
```javascript
db.images.createIndex({ "user_id": 1 })
db.images.createIndex({ "user_id": 1, "uploaded_at": -1 })  // sorted gallery retrieval
```

### 2.3 `payments` Collection (Audit Log)

> `ASSUMPTION: Separate payments collection for audit trail. Justification: decouples payment history from user document; enables dispute resolution.`

| Field | Type | Required | Index | Description |
|-------|------|----------|-------|-------------|
| `_id` | `ObjectId` | auto | PK | MongoDB document ID |
| `user_id` | `string` | yes | indexed | `firebase_uid` of payer |
| `razorpay_order_id` | `string` | yes | unique | Razorpay order ID |
| `razorpay_payment_id` | `string` | no | — | Razorpay payment ID (set on success) |
| `amount` | `int` | yes | — | Amount in paise |
| `currency` | `string` | yes | — | `"INR"` |
| `target_tier` | `string` | yes | — | Tier being purchased |
| `status` | `string` (enum: `created`, `paid`, `failed`) | yes | — | Payment state |
| `created_at` | `datetime` | yes | — | Order creation time |
| `paid_at` | `datetime` | no | — | Payment confirmation time |

---

## 3. API Specification

### Base URL

```
Production: https://<cloud-run-url>/api/v1
Development: http://localhost:8000/api/v1
```

All protected endpoints require `Authorization: Bearer <firebase_id_token>`.

---

### 3.1 Auth Module

#### `GET /api/v1/me`

> Get current user profile. Creates user document if first login.

| Field | Value |
|-------|-------|
| **Auth** | Required (Firebase JWT) |
| **Rate Limit** | 30 req/min per user |

**Request:** No body.

**Response 200:**
```json
{
  "id": "665a1b2c3d4e5f6a7b8c9d0e",
  "firebase_uid": "abc123xyz",
  "email": "user@example.com",
  "tier": "free",
  "image_count": 3,
  "max_images": 10,
  "payment_status": "unpaid",
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-02T14:30:00Z"
}
```

**Error 401:**
```json
{ "detail": "Invalid or expired token" }
```

**Scaling Note:** Stateless — any backend instance can serve this. Add Redis cache for `firebase_uid → user_doc` if read-heavy.

---

### 3.2 Uploads Module

#### `POST /api/v1/uploads/token`

> Request signed ImageKit upload parameters.

| Field | Value |
|-------|-------|
| **Auth** | Required |
| **Rate Limit** | 10 req/min per user |

**Request:** No body.

**Response 200:**
```json
{
  "token": "unique-token-string",
  "expire": 1709568000,
  "signature": "hmac-sha1-signature"
}
```

**Scaling Note:** Stateless token generation. No DB hit.

---

#### `POST /api/v1/uploads/register`

> Register an uploaded image's metadata after ImageKit upload completes.

| Field | Value |
|-------|-------|
| **Auth** | Required |
| **Rate Limit** | 10 req/min per user |

**Request:**
```json
{
  "image_url": "https://ik.imagekit.io/your_id/image.jpg",
  "imagekit_file_id": "file_abc123"
}
```

**Response 201:**
```json
{
  "id": "665a1b2c3d4e5f6a7b8c9d0f",
  "image_url": "https://ik.imagekit.io/your_id/image.jpg",
  "uploaded_at": "2026-03-03T11:30:00Z"
}
```

**Error 403:**
```json
{ "detail": "Upload quota exceeded. Current: 10/10. Upgrade your plan." }
```

**Error 400:**
```json
{ "detail": "Invalid image URL format" }
```

**Backend Logic (Atomic):**
```python
# Pseudo-code for atomic quota check + increment
async def register_image(user_id: str, image_url: str):
    result = await db.users.find_one_and_update(
        {"firebase_uid": user_id, "$expr": {"$lt": ["$image_count", "$max_images"]}},
        {"$inc": {"image_count": 1}, "$set": {"updated_at": utcnow()}},
        return_document=ReturnDocument.AFTER
    )
    if result is None:
        raise QuotaExceededException()
    # Insert image metadata
    await db.images.insert_one({...})
```

**Scaling Note:** Atomic MongoDB `find_one_and_update` prevents race conditions. No distributed lock required at this scale.

---

#### `DELETE /api/v1/uploads/{image_id}`

> Delete an image from gallery and decrement quota.

| Field | Value |
|-------|-------|
| **Auth** | Required |
| **Rate Limit** | 10 req/min per user |

**Request:** `image_id` in URL path.

**Response 200:**
```json
{ "detail": "Image deleted successfully" }
```

**Error 404:**
```json
{ "detail": "Image not found" }
```

**Error 403:**
```json
{ "detail": "You do not own this image" }
```

**Backend Logic:**
1. Verify image belongs to authenticated user.
2. Delete from `images` collection.
3. Decrement `image_count` in `users` collection.
4. Optionally: delete from ImageKit via server API (using `imagekit_file_id`).

**Scaling Note:** Ownership check prevents IDOR. Decrement is atomic.

---

### 3.3 Payments Module

#### `POST /api/v1/payments/create-order`

> Create a Razorpay order for tier upgrade.

| Field | Value |
|-------|-------|
| **Auth** | Required |
| **Rate Limit** | 5 req/min per user |

**Request:**
```json
{
  "target_tier": "premium"
}
```

**Response 200:**
```json
{
  "order_id": "order_EKm05h2uvgr2Ea",
  "amount": 9900,
  "currency": "INR",
  "key_id": "rzp_test_xxxx"
}
```

**Error 400:**
```json
{ "detail": "Cannot downgrade tier" }
```

**Error 400:**
```json
{ "detail": "Already on this tier" }
```

**Scaling Note:** Razorpay API call is external; add timeout (5s) and retry (1x).

---

#### `POST /api/v1/payments/webhook`

> Razorpay webhook endpoint for payment verification.

| Field | Value |
|-------|-------|
| **Auth** | Razorpay webhook signature (HMAC-SHA256) |
| **Rate Limit** | None (Razorpay-controlled) |

**Request:** Raw Razorpay webhook payload (JSON).

**Headers:**
```
X-Razorpay-Signature: <hmac_sha256_signature>
```

**Response 200:**
```json
{ "status": "ok" }
```

**Response 400:**
```json
{ "detail": "Invalid webhook signature" }
```

**Backend Logic:**
```python
# 1. Verify HMAC-SHA256 signature
computed = hmac.new(RAZORPAY_WEBHOOK_SECRET, body, sha256).hexdigest()
if computed != signature:
    raise InvalidSignatureError()

# 2. Extract payment status
if event == "payment.captured":
    # Update user tier
    await update_user_tier(order_id, target_tier)
```

**Scaling Note:** Webhook must be idempotent — check if tier already updated before applying. Use `razorpay_order_id` as idempotency key.

---

## 4. Background Jobs

| Job | Trigger | Description | Implementation |
|-----|---------|-------------|----------------|
| ImageKit cleanup | DELETE /uploads/{id} | Delete image from ImageKit CDN | Inline async call in delete endpoint |
| Stale order cleanup | Daily cron (future) | Mark orders > 24h old as `failed` | `TODO: implement` — Background task or scheduled Cloud Run job |

> `ASSUMPTION: No background job queue (Celery/RQ) in MVP. Justification: All operations are fast enough for inline async execution. Add task queue if any operation exceeds 5s.`

---

## 5. Data Retention

| Data | Retention | Notes |
|------|-----------|-------|
| User accounts | Indefinite | No auto-deletion in MVP |
| Image metadata | Until user deletes | Cascading delete on account deletion (future) |
| Payment records | 7 years | Regulatory compliance (`ASSUMPTION: Indian tax regulations require 7-year retention`) |
| Server logs | 30 days | Rotated automatically by Cloud Run |

---

## 6. Observability

### 6.1 Metrics

| Metric | Type | Labels | Source |
|--------|------|--------|--------|
| `http_requests_total` | Counter | `method`, `path`, `status` | FastAPI middleware |
| `http_request_duration_seconds` | Histogram | `method`, `path` | FastAPI middleware |
| `upload_quota_exceeded_total` | Counter | `tier` | Upload service |
| `payment_webhook_received_total` | Counter | `event`, `status` | Payment webhook |
| `imagekit_upload_errors_total` | Counter | — | Upload service |

### 6.2 Structured Logging

```python
import logging
import json

logger = logging.getLogger("imagetier")

# Log format (JSON for Cloud Run / GCP integration)
log_entry = {
    "severity": "INFO",
    "message": "Image uploaded",
    "user_id": firebase_uid,
    "image_id": str(image_id),
    "tier": user.tier,
    "quota_used": f"{user.image_count}/{user.max_images}",
    "timestamp": datetime.utcnow().isoformat()
}
logger.info(json.dumps(log_entry))
```

### 6.3 Health Check

```
GET /health → 200 { "status": "healthy", "db": "connected", "version": "1.0.0" }
```

- Checks MongoDB connection
- Returns service version
- Used by Cloud Run / load balancer for readiness probes

---

## 7. Environment Variables

```env
# .env.example

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/imagetier?retryWrites=true&w=majority

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_JSON=path/to/serviceAccountKey.json

# ImageKit
IMAGEKIT_PUBLIC_KEY=public_xxxx
IMAGEKIT_PRIVATE_KEY=private_xxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=secret_xxxx
RAZORPAY_WEBHOOK_SECRET=webhook_secret_xxxx

# App
APP_ENV=development
CORS_ORIGINS=http://localhost:5173
API_PREFIX=/api/v1

# Tier Pricing (paise)
PREMIUM_PRICE=9900
ULTRA_PRICE=49900
```
