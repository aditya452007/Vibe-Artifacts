# Simple Web-Based Scientific Calculator

A learning-focused DevOps project demonstrating a complete end-to-end web application workflow with Python Flask, React, Docker, and CI/CD.

## 🚀 Features

- **Frontend:** React + Vite (minimal, clean UI)
- **Backend:** Python Flask + Gunicorn (REST API)
- **Calculations:** Basic arithmetic and scientific operations
- **Infrastructure:** Docker-based containerization
- **Observability:** Prometheus metrics + Grafana dashboard
- **CI/CD:** GitHub Actions for automated testing and deployment

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite 5, CSS Modules
- **Backend:** Python 3.12, Flask 3.1, Gunicorn
- **DevOps:** Docker, Docker Compose, GitHub Actions, Google Cloud Run

## 🏃‍♂️ Quick Start (Local)

1.  **Prerequisites:**
    - Docker & Docker Compose installed
    - Git installed

2.  **Clone & Run:**
    ```bash
    git clone <repository-url>
    cd calculator
    docker-compose up --build
    ```

3.  **Access:**
    - **Frontend (Calculator):** [http://localhost:5173](http://localhost:5173)
    - **Backend API:** `http://localhost:5000/api/v1/calculate`
    - **Prometheus:** [http://localhost:9090](http://localhost:9090)
    - **Grafana:** [http://localhost:3000](http://localhost:3000) (Login: `admin` / `admin`)

## 📂 Project Structure

```
calculator/
├── backend/            # Python Flask API
├── frontend/           # React Application
├── .github/workflows/  # CI/CD Pipelines
├── docker-compose.yml  # Local development orchestration
└── prometheus.yml      # Metrics configuration
```

## 🧪 Running Tests

**Backend:**
```bash
cd backend
pip install -r requirements.txt
pytest
```

**Frontend:**
```bash
cd frontend
npm install
npm run lint
```
