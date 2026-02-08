# Scientific Calculator 🧮

> **A learning-focused DevOps project demonstrating a complete end-to-end web application workflow.**
> *Where clean code meets robust infrastructure.*

[← Back to Vibe Artifacts](../../README.md)

![Scientific Calculator Banner](https://placehold.co/1200x400/1a1a1a/00ff00?text=Scientific+Calculator+DevOps)

This project is a comprehensive example of modern DevOps practices applied to a full-stack web application. It showcases how to build, containerize, monitor, and deploy a scientific calculator using industry-standard tools and methodologies.

---

## 🚀 Features

*   **Frontend Excellence**: A minimal, clean UI built with **React** and **Vite** for blazing fast performance.
*   **Robust Backend**: A **Python Flask** REST API served via **Gunicorn** for reliable calculation processing.
*   **Scientific Precision**: Handles both basic arithmetic and advanced scientific operations with ease.
*   **Containerized Architecture**: Fully Dockerized environment ensuring consistency across development and production.
*   **Observability Stack**: integrated **Prometheus** metrics and **Grafana** dashboards for real-time monitoring.
*   **Automated CI/CD**: robust **GitHub Actions** pipelines for automated testing, linting, and deployment.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5 | Modern, fast, and component-based UI. |
| **Backend** | Python 3.12, Flask 3.1 | Lightweight and efficient API framework. |
| **Server** | Gunicorn | Production-grade WSGI HTTP Server. |
| **DevOps** | Docker, Docker Compose | Containerization and orchestration. |
| **CI/CD** | GitHub Actions | Automated workflows for testing and deployment. |
| **Monitoring** | Prometheus, Grafana | Metrics collection and visualization. |

---

## 🏃‍♂️ Quick Start (Local)

Follow these steps to get the application running on your local machine.

### Prerequisites

*   **Docker** & **Docker Compose** installed.
*   **Git** installed.

### 1. Clone & Run

```bash
git clone https://github.com/aditya452007/Vibe-Artifacts.git
cd Vibe-Artifacts/Devops/calculator
docker-compose up --build
```

### 2. Access the Services

Once the containers are up and running, access the following endpoints:

*   **🧮 Frontend (Calculator)**: [http://localhost:5173](http://localhost:5173)
*   **🔌 Backend API**: `http://localhost:5000/api/v1/calculate`
*   **📈 Prometheus**: [http://localhost:9090](http://localhost:9090)
*   **📊 Grafana**: [http://localhost:3000](http://localhost:3000) (Login: `admin` / `admin`)

---

## 📂 Project Structure

```bash
calculator/
├── backend/            # Python Flask API & Tests
├── frontend/           # React Application & Tests
├── .github/workflows/  # CI/CD Pipelines (Build, Test, Deploy)
├── docker-compose.yml  # Local development orchestration
└── prometheus.yml      # Metrics configuration
```

---

## 🧪 Running Tests

Ensure code quality by running the test suites.

### Backend Tests

```bash
cd backend
pip install -r requirements.txt
pytest
```

### Frontend Checks

```bash
cd frontend
npm install
npm run lint
```

---

## 📄 License

This project is part of the **Vibe Artifacts** collection and is open for educational use.

---

<p align="center">
  Maintained with ❤️ by <a href="https://github.com/aditya452007">aditya452007</a>
</p>
