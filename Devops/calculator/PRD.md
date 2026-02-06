# Product Requirements Document (PRD)
## Simple Web-Based Scientific Calculator

**Version:** 1.0  
**Date:** February 6, 2026  
**Author:** Technical Team  
**Status:** Draft

---

## 1. Problem Statement

Learners who want to understand modern web application development workflows lack a simple, end-to-end reference project that demonstrates:
- Frontend-backend separation and API communication
- Backend development using Python/Flask
- Containerization with Docker
- Automated CI/CD pipelines
- Cloud deployment
- Basic observability and monitoring

Most tutorials focus on individual technologies in isolation. This project provides a complete, minimal workflow using a calculator as the vehicle for learning—not as the end goal itself.

---

## 2. Goals

### Primary Learning Goals
- Understand how a frontend communicates with a backend via REST API
- Learn to build a simple backend service using Flask (Python)
- Learn Docker containerization for both frontend and backend
- Implement CI/CD using GitHub Actions
- Deploy containerized applications to Google Cloud (Cloud Run)
- Set up basic observability with Prometheus and Grafana

### Secondary Goals
- Build a working calculator that demonstrates the architecture
- Write testable, maintainable code
- Follow modern development practices (linting, testing, code review via PRs)

---

## 3. Non-Goals

This project explicitly does **NOT** include:
- Advanced calculator features (graphing, complex equations, history persistence)
- User authentication or multi-user support
- Database integration
- Microservices architecture
- Advanced DevOps patterns (service mesh, auto-scaling policies, multi-region deployment)
- Mobile applications
- Real-time collaboration features
- Accessibility beyond basic HTML semantics
- Internationalization (i18n)
- Production-grade security hardening beyond HTTPS

---

## 4. Target Users

**Primary User:** Individual learners (students, junior developers, career switchers) who want to:
- Understand how web applications work end-to-end
- Learn Docker, CI/CD, and cloud deployment in a practical context
- Build a portfolio project demonstrating modern development workflows

**Not optimized for:** End users who need a production calculator application.

---

## 5. Functional Requirements

### 5.1 Calculator Operations

The calculator must support:

**Basic Arithmetic:**
- Addition (+)
- Subtraction (−)
- Multiplication (×)
- Division (÷)

**Scientific Operations:**
- Square root (√)
- Power (x^y)
- Percentage (%)

**Input/Output:**
- Accept numeric input via button clicks
- Display current input and result
- Clear/reset functionality (C or AC)
- Handle decimal numbers

### 5.2 Frontend Requirements

- Single-page web application
- Responsive layout (works on desktop and mobile browsers)
- Clean, minimal UI resembling a standard calculator
- Sends calculation requests to backend API
- Displays results returned from backend
- Shows loading state during API calls
- Displays error messages for invalid operations (e.g., division by zero)

**Technology:** HTML, CSS, JavaScript (vanilla or React—keep it simple)

### 5.3 Backend Requirements

- REST API with the following endpoint:
  - `POST /api/calculate` — accepts operation and operands, returns result

**Request format:**
```json
{
  "operation": "add",
  "operand1": 5,
  "operand2": 3
}
```

**Response format:**
```json
{
  "result": 8
}
```

**Error handling:**
- Return appropriate HTTP status codes (400 for invalid input, 500 for server errors)
- Return error messages in JSON format

**Technology:** Python 3.12+, Flask 3.x

### 5.4 API Operations Mapping

| Operation | Endpoint Value | Example |
|-----------|---------------|---------|
| Addition | `add` | 5 + 3 = 8 |
| Subtraction | `subtract` | 5 - 3 = 2 |
| Multiplication | `multiply` | 5 × 3 = 15 |
| Division | `divide` | 6 ÷ 3 = 2 |
| Square root | `sqrt` | √9 = 3 |
| Power | `power` | 2^3 = 8 |
| Percentage | `percentage` | 20% of 100 = 20 |

---

## 6. Non-Functional Requirements

### 6.1 Performance
- API response time < 200ms for simple operations
- Frontend load time < 2 seconds on standard broadband

### 6.2 Reliability
- API should handle invalid inputs gracefully (no crashes)
- Frontend should handle API failures (timeout, network error)

### 6.3 Maintainability
- Code must be readable and well-structured
- Include basic unit tests for backend logic
- Use linting (Python: `ruff` or `pylint`, JavaScript: `eslint`)

### 6.4 Observability
- Expose Prometheus metrics from backend (`/metrics` endpoint)
- Track: request count, response time, error rate
- Visualize metrics in Grafana dashboard

### 6.5 Deployment
- Application must run in Docker containers
- Use Docker Compose for local development
- Deploy to Google Cloud Run (managed container platform)

---

## 7. System Overview

### 7.1 Architecture

```
┌─────────────┐         HTTPS          ┌─────────────┐
│   Browser   │ ◄──────────────────► │   Frontend  │
│             │    (Static Assets)     │  Container  │
└─────────────┘                        └─────────────┘
                                              │
                                              │ HTTP
                                              ▼
                                       ┌─────────────┐
                                       │   Backend   │
                                       │   (Flask)   │
                                       │  Container  │
                                       └─────────────┘
                                              │
                                              │
                                       ┌──────┴──────┐
                                       │             │
                                  /metrics      /api/calculate
                                       │             │
                                       ▼             ▼
                                  Prometheus     Calculator
                                       │          Logic
                                       ▼
                                   Grafana
```

### 7.2 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | HTML/CSS/JS or React | Latest stable |
| Backend | Python + Flask | 3.12+ / 3.1+ |
| Containerization | Docker | 25.x+ |
| Orchestration (local) | Docker Compose | 2.24+ |
| CI/CD | GitHub Actions | N/A |
| Cloud Platform | Google Cloud Run | Current |
| Metrics | Prometheus | 2.50+ |
| Visualization | Grafana | 10.4+ |

### 7.3 Development Workflow

1. Developer writes code locally
2. Commits and pushes to GitHub
3. GitHub Actions triggers:
   - Lint checks
   - Unit tests
   - Docker image build
   - Push images to Google Container Registry
   - Deploy to Cloud Run (on main branch)
4. Prometheus scrapes metrics from deployed backend
5. Grafana displays metrics dashboard

---

## 8. Success Criteria

This project is successful if the learner can:

1. **Explain** how the frontend sends a calculation request to the backend
2. **Demonstrate** the backend receiving, processing, and responding to API requests
3. **Build and run** both frontend and backend using Docker locally
4. **Deploy** the application to Google Cloud Run via CI/CD
5. **View** live application metrics in Grafana
6. **Modify** the code and see changes deployed automatically via CI/CD

**Not measured by:** Number of users, calculator feature completeness, or production uptime.

---

## 9. Phases and Milestones

### Phase 1: Core Application (Week 1)
- ✅ Build frontend UI
- ✅ Implement backend API
- ✅ Local testing (manual)

### Phase 2: Containerization (Week 1)
- ✅ Create Dockerfiles for frontend and backend
- ✅ Create docker-compose.yml for local dev
- ✅ Test containers locally

### Phase 3: CI/CD (Week 2)
- ✅ Set up GitHub Actions workflow
- ✅ Add automated tests
- ✅ Build and push Docker images
- ✅ Deploy to Google Cloud Run

### Phase 4: Observability (Week 2)
- ✅ Add Prometheus metrics to backend
- ✅ Set up Prometheus and Grafana (local or cloud)
- ✅ Create basic dashboard

### Phase 5: Documentation (Week 3)
- ✅ Write README with setup instructions
- ✅ Document architecture decisions
- ✅ Add inline code comments

---

## 10. Out of Scope (Explicit)

To maintain focus on learning objectives, the following are explicitly excluded:

- **Advanced math operations** (trigonometry, logarithms, matrices)
- **Calculation history** or memory functions
- **User accounts** or authentication
- **Database** for storing calculations
- **Horizontal scaling** or load balancing
- **Multi-region deployment**
- **Advanced security** (beyond HTTPS and input validation)
- **Unit conversion** features
- **Themes** or customization
- **Offline support** or PWA features

---

## 11. Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Google Cloud costs exceed expectations | Use Cloud Run free tier; set budget alerts |
| Docker complexity overwhelms learner | Provide clear, commented Dockerfiles and setup scripts |
| CI/CD pipeline fails silently | Add notifications; document troubleshooting steps |
| Scope creep (adding features) | Refer back to this PRD; focus on learning goals |

---

## 12. Open Questions

- Should frontend be served as static files (Nginx) or via a simple Node.js server?
  - **Recommendation:** Static files via Nginx for simplicity
- Should Prometheus/Grafana run locally or in the cloud?
  - **Recommendation:** Locally for learning; optionally cloud for advanced learners

---

## Appendix: Reference Links

- Flask Documentation: https://flask.palletsprojects.com/
- Docker Documentation: https://docs.docker.com/
- GitHub Actions: https://docs.github.com/en/actions
- Google Cloud Run: https://cloud.google.com/run/docs
- Prometheus: https://prometheus.io/docs/
- Grafana: https://grafana.com/docs/

---

**End of Document**