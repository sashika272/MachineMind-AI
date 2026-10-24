# MachineMind AI — Industrial Intelligence Platform

> **"See the Failure. Understand the Cause. Simulate the Fix. Trust the Solution."**

MachineMind AI is a state-of-the-art industrial AI intelligence platform built for mission-critical industrial rotating equipment (turbines, induction motors, centrifugal pumps, and compressors). The platform seamlessly bridges real-time high-frequency sensor telemetry, interactive procedural 3D digital twins, Bayesian causal root cause analysis, deterministic repair synthesis, physics-backed virtual co-simulation, and stochastic remaining useful life (RUL) estimation.

---

## 🌟 Key Highlights & System Features

### 🖥️ Frontend (React 18 + Three.js + Tailwind CSS)
- **16 Complete Enterprise Screens:**
  1. **Landing Page:** Interactive industrial hero showcase, live metric counters, value propositions, and trust badges.
  2. **Login Page:** One-click demo credentials autofill, input validation, password toggle, and enterprise SSO preview.
  3. **Registration Page:** Industrial credential onboarding with password strength meter and company division assignment.
  4. **Forgot Password Page:** Safe cryptographic token reset dispatch workflow.
  5. **Overview Dashboard:** Fleet status matrix, health indices, quick-action emergency triage, and active incident alerts.
  6. **Live Machine Monitoring:** Real-time temperature, vibration, line pressure, and RPM telemetry with animated Recharts trends, thresholds, and scenario selectors.
  7. **3D Machine Visualization:** Procedural 3D industrial motor engineered in Three.js / React Three Fiber / Drei:
     - 360° orbital camera control with smooth zoom and pan.
     - Rotating drive shaft and animated rear cooling fan synchronized with live RPM.
     - 16 radial stator cooling fins, outer stator casing, end-bells, junction box, and detailed bearing race with 8 individual ball bearings.
     - Exploded component inspection mode.
     - Real-time thermal heatmap mode (gradient color mapping based on live operating temperature).
     - Component hotspots with interactive 3D HTML pins for one-click diagnostic inspection.
  8. **Fault Detection:** Anomaly feed powered by Scikit-Learn Isolation Forest, confidence meters, sensor evidence, and ISO 10816 vibration severity tags.
  9. **Root Cause Analysis (RCA):** Bayesian causal tree visualization, primary failure mechanism attribution, contributing factors, downstream risks, and uncertainty quantification.
  10. **AI Repair Strategies:** Deterministic synthesis of 3–5 actionable repair procedures with required specialized tooling, replacement part numbers, safety prerequisites, and recovery timelines.
  11. **Digital Twin Simulator:** Interactive virtual machine co-simulator allowing engineers to select a repair intervention, simulate thermal and vibrational decay curves, evaluate Von Mises stress, and verify API 670 safety constraint compliance before field deployment.
  12. **Solution Recommendation:** Multi-Criteria Decision Analysis (MCDA) decision matrix comparing safety, capital cost, downtime, post-repair performance, and energy efficiency.
  13. **Predictive Maintenance:** Stochastic Remaining Useful Life (RUL) forecasting with P10/P50/P90 confidence intervals, Weibull hazard curves, and preventive maintenance task schedules.
  14. **Machine History:** High-resolution telemetry timeline with historical time-travel scrubber, operating session logs, and past maintenance archives.
  15. **Analytics & Reports:** Fleet MTBF, MTTR, availability KPIs, downtime cost tracking, and downloadable PDF (ReportLab) and CSV exports.
  16. **User Profile & Settings:** Profile details, notification thresholds, telemetry refresh rates, active theme selection, and audit access history.

---

### ⚙️ Backend (Python + FastAPI + PostgreSQL/SQLite + Scikit-Learn)
- **FastAPI Modern Core:** Asynchronous REST API and bidirectional WebSocket servers with Pydantic v2 schemas and token bucket rate limiting.
- **Enterprise Authentication:** Argon2/Bcrypt password hashing and RFC-compliant JWT access & refresh tokens.
- **Relational Data Architecture:** Normalized SQLAlchemy 2.0 ORM schemas with Alembic migrations for users, assets, physical components, sensor logs, faults, simulations, and audit trails.
- **Real-Time Sensor Telemetry Engine:** Configurable synthetic generator with normal operation, stator overheating, bearing unbalance, and pressure surge anomaly scenarios over WebSockets.
- **Machine Learning Suite:**
  - `IsolationForest` (contamination=0.04) for unsupervised anomaly identification.
  - `RandomForestClassifier` for multi-class classification across 6 industrial failure modes.
- **Physics Co-Simulation:** Newton's law of cooling for thermal dissipation, damped harmonic oscillator for vibration decay, and Von Mises stress limit calculations.
- **Automated Reporting Engine:** Native server-side vector PDF report generation via ReportLab and CSV exports via Pandas.

---

## 🚀 Quick Start Guide

### 1. Start the FastAPI Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate       # On Windows
# source venv/bin/activate  # On Linux / macOS

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Seed reproducible industrial asset & user data
python run_seed.py

# Launch the FastAPI Uvicorn server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Backend API:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/api/v1/docs`

---

### 2. Start the React Frontend

Open a second terminal:

```bash
# In the project root directory:
npm install

# Start the Vite development server
npm run dev
```

- **Frontend Application:** `http://localhost:3000`

---

## 🔑 Demo Access Credentials

The database is pre-seeded with 3 realistic enterprise roles. You can click **"Demo Fill"** on the Login screen or use these credentials:

| Role | Email | Password |
|---|---|---|
| **Chief Reliability Engineer** | `elena.vance@machinemind.ai` | `ApexReliability2026!` |
| **Lead Diagnostic Technician** | `marcus.sterling@machinemind.ai` | `TurbineGuard2026!` |
| **Site Operations Director** | `sarah.chen@machinemind.ai` | `PlantSecure2026!` |

---

## 🧪 Testing

### Frontend Production Build
```bash
npm run build
```
*Verifies complete TypeScript type checking and Vite production bundling.*

### Backend End-to-End Integration Suite
```bash
cd backend
python test_api.py
```
*Executes all 13 automated test suites including Auth, Fleet, Faults, ML Classifier, RCA, Repair Synthesis, Digital Twin Physics, Predictive RUL, ReportLab PDF, CSV, and WebSocket streaming.*

### Complete 18-Step User Journey Functional Test
```bash
cd backend
python test_user_journey.py
```
*Executes the full end-to-end user workflow: User Registration, JWT Login, Fleet Selection, Live Telemetry, Multi-Anomaly Simulation (Overheating, Vibration, Pressure, Compound), Isolation Forest ML inference, Bayesian Root Cause, 3D Component Highlighting, Repair Synthesis, Digital Twin Simulation, MCDA Ranking, Work Order DB Persistence, Machine History Audit Trail, ReportLab PDF / CSV Generation, and Logout Route Guard Enforcement.*

### Database Persistence & Integrity Check
```bash
cd backend
python verify_db.py
```
*Verifies database record persistence across users, machines, maintenance work orders, simulation sessions, simulation results, and immutable audit logs.*
