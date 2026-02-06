# Tech Stack Design Document
## Simple Web-Based Scientific Calculator

**Version:** 1.0  
**Date:** February 6, 2026  
**Purpose:** Learning-focused end-to-end web application workflow

---

## Overview

This tech stack is designed to teach modern web development workflows using industry-standard tools while maintaining simplicity. Every choice prioritizes **learning value** and **real-world relevance** over feature completeness.

---

## 1. Frontend Stack

### 1.1 Core Technology

| Component | Choice | Version |
|-----------|--------|---------|
| **Framework** | React | 18.3.x |
| **Language** | JavaScript (ES6+) | N/A |
| **Build Tool** | Vite | 5.x |
| **Styling** | CSS Modules | N/A |
| **HTTP Client** | Fetch API (native) | N/A |

### 1.2 Rationale

**Why React?**
- Most in-demand frontend skill in 2026
- Component-based architecture teaches reusable patterns
- Large ecosystem and learning resources
- Minimal boilerplate with modern hooks
- **Trade-off:** Slightly more complex than vanilla JS, but worth it for real-world relevance

**Why Vite?**
- Fast dev server with hot module replacement
- Simple configuration (near-zero config for basic projects)
- Modern build tool (replaces older Webpack setups)
- Built-in optimizations for production
- **Trade-off:** None at this scale

**Why CSS Modules?**
- Scoped styling prevents conflicts
- No additional dependencies (Vite supports it natively)
- Easier to understand than CSS-in-JS
- **Trade-off:** Not learning Tailwind/styled-components, but keeps focus on core concepts

**Why Fetch API?**
- Native to browsers (no library needed)
- Forces learners to understand HTTP fundamentals
- Modern async/await syntax
- **Trade-off:** More verbose than Axios, but more educational

### 1.3 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Calculator.jsx
│   │   ├── Calculator.module.css
│   │   ├── Display.jsx
│   │   └── Button.jsx
│   ├── services/
│   │   └── api.js          # API communication layer
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
└── Dockerfile
```

### 1.4 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.35.0"
  }
}
```

**Why minimal dependencies?**
- Reduces complexity and security surface
- Faster build times
- Easier to understand what each piece does

---

## 2. Backend Stack

### 2.1 Core Technology

| Component | Choice | Version |
|-----------|--------|---------|
| **Framework** | Flask | 3.1.x |
| **Language** | Python | 3.12+ |
| **Dependency Manager** | pip + requirements.txt | N/A |
| **WSGI Server** | Gunicorn | 22.x |
| **Metrics** | prometheus-flask-exporter | 0.23.x |

### 2.2 Rationale

**Why Flask?**
- Minimalist framework ("micro" framework)
- Teaches HTTP fundamentals without magic
- Easy to understand request/response cycle
- Perfect for learning APIs
- **Trade-off:** Less built-in features than Django, but appropriate for this scope

**Why Python 3.12?**
- Latest stable version as of Feb 2026
- Improved performance over 3.11
- Modern type hints and syntax
- **Trade-off:** None

**Why pip + requirements.txt?**
- Simple, standard approach
- No need for Poetry/Pipenv at this scale
- Easier for beginners
- **Trade-off:** Less sophisticated dependency resolution, but adequate for small projects

**Why Gunicorn?**
- Production-ready WSGI server
- Simple configuration
- Industry standard for Flask apps
- **Trade-off:** Not async (vs. Uvicorn), but our workload doesn't need it

### 2.3 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── routes.py          # API endpoints
│   ├── calculator.py      # Business logic
│   └── config.py
├── tests/
│   ├── test_calculator.py
│   └── test_routes.py
├── requirements.txt
├── Dockerfile
└── gunicorn.conf.py
```

### 2.4 Key Dependencies

```txt
Flask==3.1.0
gunicorn==22.0.0
prometheus-flask-exporter==0.23.1
pytest==8.2.0
flask-cors==4.0.1
```

**Why these specifically?**
- **Flask-CORS:** Allow frontend (different port/domain) to call API
- **pytest:** Industry standard testing framework
- **prometheus-flask-exporter:** Auto-instruments Flask with Prometheus metrics

---

## 3. API Communication

### 3.1 API Design

**Style:** REST  
**Format:** JSON  
**Versioning:** `/api/v1/` prefix (future-proofing, minimal overhead)

### 3.2 Endpoint Specification

#### Calculate Endpoint

```
POST /api/v1/calculate
Content-Type: application/json
```

**Request:**
```json
{
  "operation": "add",
  "operand1": 10,
  "operand2": 5
}
```

**Success Response (200):**
```json
{
  "result": 15,
  "operation": "add"
}
```

**Error Response (400):**
```json
{
  "error": "Division by zero not allowed",
  "operation": "divide"
}
```

**Error Response (500):**
```json
{
  "error": "Internal server error"
}
```

### 3.3 Supported Operations

| Operation | Key | Operands |
|-----------|-----|----------|
| Addition | `add` | 2 |
| Subtraction | `subtract` | 2 |
| Multiplication | `multiply` | 2 |
| Division | `divide` | 2 |
| Square Root | `sqrt` | 1 |
| Power | `power` | 2 |
| Percentage | `percentage` | 2 |

### 3.4 Error Handling Strategy

**Backend:**
- Validate input types (must be numbers)
- Validate operation type (must be supported)
- Handle division by zero explicitly
- Return appropriate HTTP status codes
- Log errors for debugging

**Frontend:**
- Display user-friendly error messages
- Show loading state during API calls
- Handle network errors (timeout, connection refused)
- Provide fallback UI

### 3.5 Rationale

**Why REST?**
- Simple and stateless
- Easy to understand and test
- Standard HTTP methods
- **Trade-off:** Not GraphQL (overkill for this project)

**Why JSON?**
- Universal format
- Native JavaScript support
- Human-readable
- **Trade-off:** Slightly more verbose than binary formats, but irrelevant at this scale

**Why version prefix?**
- Teaches API versioning concept
- Minimal cost
- Real-world pattern
- **Trade-off:** Adds three characters to URL

---

## 4. Containerization Strategy

### 4.1 Docker Architecture

**Approach:** Multi-container application using Docker Compose for local development

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   Container     │────────▶│    Container    │
│   (Nginx)       │  HTTP   │    (Gunicorn)   │
│   Port: 80      │         │    Port: 5000   │
└─────────────────┘         └─────────────────┘
```

### 4.2 Frontend Dockerfile

**Strategy:** Multi-stage build

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Rationale:**
- **Multi-stage:** Reduces final image size (no build tools in production)
- **Alpine:** Minimal base image (~5MB vs ~100MB)
- **Nginx:** Industry-standard static file server
- **Trade-off:** Slightly more complex Dockerfile, but teaches important pattern

### 4.3 Backend Dockerfile

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--config", "gunicorn.conf.py", "app:app"]
```

**Rationale:**
- **Slim variant:** Smaller than full Python image, contains what we need
- **Single stage:** Simpler for beginners, adequate for Python apps
- **Gunicorn:** Production-ready WSGI server
- **Trade-off:** Not using Alpine Python (compatibility issues with some packages)

### 4.4 Docker Compose (Local Development)

```yaml
version: '3.9'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=development
    volumes:
      - ./backend:/app
    command: flask run --host=0.0.0.0

  frontend:
    build:
      context: ./frontend
      target: build
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev -- --host

  prometheus:
    image: prom/prometheus:v2.51.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana:10.4.0
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
```

**Rationale:**
- **Hot reload in dev:** Volumes mount source code
- **Includes observability stack:** Prometheus + Grafana
- **Simple networking:** Services communicate via service names
- **Trade-off:** Not production-ready, but that's intentional

---

## 5. CI/CD Pipeline (GitHub Actions)

### 5.1 Workflow Overview

```
Trigger: Push to any branch, PR to main
│
├─ Lint & Test
│  ├─ Frontend: ESLint
│  └─ Backend: Pytest
│
├─ Build Docker Images
│  ├─ Frontend image
│  └─ Backend image
│
└─ Deploy (main branch only)
   ├─ Push images to Google Container Registry
   └─ Deploy to Cloud Run
```

### 5.2 GitHub Actions Workflow

**File:** `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: us-central1

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install and lint
        run: |
          cd frontend
          npm ci
          npm run lint

  build-and-deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
      
      - name: Configure Docker
        run: gcloud auth configure-docker
      
      - name: Build and push backend
        run: |
          docker build -t gcr.io/$PROJECT_ID/calculator-backend:$GITHUB_SHA ./backend
          docker push gcr.io/$PROJECT_ID/calculator-backend:$GITHUB_SHA
      
      - name: Build and push frontend
        run: |
          docker build -t gcr.io/$PROJECT_ID/calculator-frontend:$GITHUB_SHA ./frontend
          docker push gcr.io/$PROJECT_ID/calculator-frontend:$GITHUB_SHA
      
      - name: Deploy backend to Cloud Run
        run: |
          gcloud run deploy calculator-backend \
            --image gcr.io/$PROJECT_ID/calculator-backend:$GITHUB_SHA \
            --platform managed \
            --region $REGION \
            --allow-unauthenticated
      
      - name: Deploy frontend to Cloud Run
        run: |
          gcloud run deploy calculator-frontend \
            --image gcr.io/$PROJECT_ID/calculator-frontend:$GITHUB_SHA \
            --platform managed \
            --region $REGION \
            --allow-unauthenticated
```

### 5.3 Rationale

**Why GitHub Actions?**
- Free for public repos
- Integrated with GitHub (no separate tool)
- YAML-based, easy to understand
- Good documentation
- **Trade-off:** Platform lock-in, but appropriate for learning

**Why this workflow structure?**
- **Parallel testing:** Frontend and backend test independently
- **Sequential deployment:** Only deploy if tests pass
- **Branch protection:** Only main branch deploys
- **Trade-off:** Could add more stages (security scanning, etc.), but keeping it simple

**Why SHA tags?**
- Immutable image identifiers
- Easy rollback (redeploy specific SHA)
- Standard practice
- **Trade-off:** Not semantic versioning, but simpler for learning

---

## 6. Google Cloud Platform

### 6.1 Services Used

| Service | Purpose | Why This Choice |
|---------|---------|-----------------|
| **Cloud Run** | Container hosting | Serverless, auto-scaling, pay-per-use, no infrastructure management |
| **Container Registry (GCR)** | Docker image storage | Integrated with Cloud Run, simple authentication |
| **Cloud Logging** | Application logs | Automatic collection, no setup needed |
| **Cloud Monitoring** | Basic uptime checks | Free tier includes basic monitoring |

### 6.2 Architecture on GCP

```
Internet
   │
   ├─▶ Cloud Run (Frontend)
   │     └─ Nginx serving static files
   │
   └─▶ Cloud Run (Backend)
         └─ Gunicorn + Flask
         └─ /metrics endpoint
```

### 6.3 Rationale

**Why Cloud Run?**
- **No Kubernetes complexity:** Fully managed
- **Auto-scaling:** Scales to zero when not used (cost-effective)
- **Simple deployment:** Just push a container
- **HTTPS by default:** Automatic SSL certificates
- **Perfect for learning:** Focus on app, not infrastructure
- **Trade-off:** Less control than GKE, but that's a feature not a bug

**Why NOT using:**
- ❌ **Compute Engine (VMs):** Too much manual setup
- ❌ **Kubernetes Engine (GKE):** Overkill for this project
- ❌ **App Engine:** Less flexible than Cloud Run, older service
- ❌ **Cloud Functions:** Not suitable for web apps (designed for event-driven functions)
- ❌ **Cloud SQL:** No database needed for this project

### 6.4 Cloud Run Configuration

**Backend Service:**
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: calculator-backend
spec:
  template:
    spec:
      containers:
      - image: gcr.io/PROJECT_ID/calculator-backend:latest
        ports:
        - containerPort: 5000
        resources:
          limits:
            memory: 512Mi
            cpu: 1
        env:
        - name: FLASK_ENV
          value: production
```

**Frontend Service:**
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: calculator-frontend
spec:
  template:
    spec:
      containers:
      - image: gcr.io/PROJECT_ID/calculator-frontend:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: 256Mi
            cpu: 1
```

**Rationale:**
- **Memory limits:** Conservative (frontend needs less than backend)
- **CPU limits:** 1 vCPU sufficient for simple calculator
- **Trade-off:** Not optimizing for cost at this scale

---

## 7. Observability Stack

### 7.1 Metrics Collection

**Backend instrumentation:**
```python
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
metrics = PrometheusMetrics(app)

# Automatically exposes /metrics endpoint
# Tracks:
# - flask_http_request_total
# - flask_http_request_duration_seconds
# - flask_http_request_exceptions_total
```

### 7.2 Prometheus Configuration

**File:** `prometheus.yml`

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'calculator-backend'
    static_configs:
      - targets: ['backend:5000']
    metrics_path: '/metrics'
```

**Rationale:**
- **15s interval:** Balance between freshness and overhead
- **Static config:** Simple for local development
- **Trade-off:** In production, would use service discovery

### 7.3 Grafana Dashboard

**Pre-configured dashboard includes:**
- Request rate (requests/second)
- Response time (95th percentile)
- Error rate (%)
- Request count by operation type

**Dashboard JSON:** Provisioned automatically via Docker Compose volume

### 7.4 Metrics Exposed

| Metric | Type | Description |
|--------|------|-------------|
| `flask_http_request_total` | Counter | Total HTTP requests by method, path, status |
| `flask_http_request_duration_seconds` | Histogram | Request duration by path |
| `flask_http_request_exceptions_total` | Counter | Total exceptions by method, path |
| `calculator_operations_total` | Counter | Custom: operations by type |
| `calculator_errors_total` | Counter | Custom: errors by type |

### 7.5 Rationale

**Why Prometheus?**
- Industry standard for metrics
- Pull-based model (simpler than push)
- Powerful query language (PromQL)
- **Trade-off:** Not the simplest option, but worth learning

**Why Grafana?**
- Best visualization tool for Prometheus
- Beautiful dashboards
- Open source
- **Trade-off:** Slight learning curve, but valuable skill

**Why NOT:**
- ❌ **Application logs as primary monitoring:** Metrics are faster and more structured
- ❌ **Cloud-only monitoring:** Loses portability, harder to debug locally
- ❌ **Custom metrics dashboard:** Grafana is standard, better to learn it

---

## 8. Development Tools & Versioning

### 8.1 Language & Runtime Versions

| Tool | Version | Rationale |
|------|---------|-----------|
| **Python** | 3.12.2 | Latest stable, improved performance |
| **Node.js** | 20.12.0 LTS | Long-term support, stable |
| **Docker** | 25.0+ | Latest features, improved security |
| **Docker Compose** | 2.24+ | Matches Docker version |

### 8.2 Package Managers

**Frontend:** npm (comes with Node.js)  
**Backend:** pip (comes with Python)

**Rationale:** Use built-in tools, no additional package manager complexity

### 8.3 Code Quality Tools

#### Frontend

```json
{
  "devDependencies": {
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

**ESLint config:** Standard React rules, minimal customization

#### Backend

```txt
pytest==8.2.0
pytest-cov==5.0.0
ruff==0.4.0  # Fast Python linter (replaces flake8, black)
```

**Ruff:** Modern, fast linter that combines multiple tools

### 8.4 Testing Strategy

**Frontend:**
- Manual testing in browser (no jest/testing-library to keep simple)
- ESLint for code quality

**Backend:**
- Unit tests with pytest
- Test coverage > 80% for calculator logic
- Integration tests for API endpoints

**Example test:**
```python
def test_addition():
    result = calculator.add(5, 3)
    assert result == 8

def test_divide_by_zero():
    with pytest.raises(ValueError):
        calculator.divide(5, 0)
```

### 8.5 Version Control

**Strategy:**
- **main:** Production branch (protected)
- **develop:** Development branch (optional)
- **feature/\*:** Feature branches

**Commit convention:** Conventional Commits (optional, teaches good practices)

```
feat: add square root operation
fix: handle division by zero
docs: update README with deployment steps
```

---

## 9. Environment Management

### 9.1 Environment Variables

**Backend (.env for local development):**
```bash
FLASK_ENV=development
FLASK_APP=app
PROMETHEUS_MULTIPROC_DIR=/tmp
```

**Frontend (build-time variables):**
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

**Production (Cloud Run environment variables):**
```bash
FLASK_ENV=production
ALLOWED_ORIGINS=https://calculator-frontend-xxx.run.app
```

### 9.2 Secrets Management

**Local:** `.env` files (gitignored)  
**CI/CD:** GitHub Secrets  
**Production:** Cloud Run environment variables (encrypted at rest)

**Trade-off:** Not using Google Secret Manager to keep things simple

---

## 10. Complete Technology Summary

### 10.1 Full Stack at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                             │
│  React 18 + Vite 5 + CSS Modules + Fetch API            │
│  ──▶ Build ──▶ Nginx 1.27 ──▶ Docker (Alpine)          │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/JSON
                         ▼
┌─────────────────────────────────────────────────────────┐
│                     BACKEND                              │
│  Python 3.12 + Flask 3.1 + Gunicorn 22                  │
│  ──▶ prometheus-flask-exporter ──▶ Docker (Slim)       │
└─────────────────────────────────────────────────────────┘
                         │
                         ├──▶ /metrics ──▶ Prometheus 2.51
                         │                      │
                         │                      ▼
                         │                  Grafana 10.4
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   DEPLOYMENT                             │
│  GitHub Actions ──▶ GCR ──▶ Cloud Run                   │
│  (CI/CD)                    (Serverless Containers)      │
└─────────────────────────────────────────────────────────┘
```

### 10.2 Why This Stack Works for Learning

✅ **Industry-relevant:** All tools are used in production environments  
✅ **Minimal complexity:** No unnecessary abstractions  
✅ **Clear separation:** Frontend, backend, deployment are distinct  
✅ **Observable:** Metrics built in from day one  
✅ **Reproducible:** Docker ensures "works on my machine" isn't a problem  
✅ **Deployable:** CI/CD pipeline deploys automatically  
✅ **Cost-effective:** Cloud Run free tier + GitHub Actions free tier = $0 for small projects

### 10.3 What Learners Will Gain

After building this project, learners will understand:

1. **How React communicates with Flask** via REST API
2. **How Flask serves APIs** and handles requests/responses
3. **How Docker containerizes** frontend and backend separately
4. **How CI/CD pipelines** automate testing and deployment
5. **How Cloud Run** hosts containerized applications
6. **How Prometheus/Grafana** collect and visualize metrics
7. **How all pieces connect** in a real production workflow

---

## 11. Trade-offs & Alternatives

### 11.1 Decisions Made & Why

| Choice | Alternative | Why Not Alternative |
|--------|-------------|---------------------|
| React | Vue/Svelte/Vanilla JS | React is most in-demand skill |
| Flask | FastAPI/Django | Flask teaches HTTP fundamentals better |
| Cloud Run | Cloud Functions | Functions are for serverless functions, not apps |
| Cloud Run | GKE (Kubernetes) | Kubernetes is overkill for this project |
| Prometheus | Cloud Monitoring only | Prometheus is portable, teaches standard |
| Docker | No containers | Containers are industry standard |
| Nginx | Node.js server | Nginx is standard for static files |
| REST | GraphQL | REST is simpler, better for learning basics |

### 11.2 Intentional Simplifications

- **No database:** Calculations don't need persistence
- **No authentication:** Not needed for learning core workflow
- **No caching:** Would hide request flow
- **No CDN:** Overkill for learning project
- **No auto-scaling config:** Cloud Run defaults are fine
- **No multi-region:** Single region sufficient

---

## 12. Getting Started Checklist

To implement this stack, a learner needs:

**Accounts:**
- [ ] GitHub account
- [ ] Google Cloud account (free tier)

**Local tools:**
- [ ] Docker Desktop
- [ ] Git
- [ ] Node.js 20+
- [ ] Python 3.12+
- [ ] Code editor (VS Code recommended)

**Skills to learn:**
- [ ] Basic React concepts
- [ ] Flask routing and request handling
- [ ] Docker basics (images, containers, Compose)
- [ ] GitHub Actions YAML syntax
- [ ] Prometheus/Grafana basics

**Estimated time to build:** 2-3 weeks (part-time)

---

**End of Tech Stack Design Document**