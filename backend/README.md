# MachineMind AI — Backend Architecture & Engineering Guide

> **Tagline:** *See the Failure. Understand the Cause. Simulate the Fix. Trust the Solution.*

MachineMind AI is an enterprise industrial intelligence platform engineered for high-criticality assets (turbines, industrial induction motors, centrifugal compressors, cryogenic pumps). This repository houses the Python FastAPI backend, predictive ML inference pipelines, virtual Digital Twin co-simulation engine, Bayesian causal reasoning diagnostic engine, and real-time telemetry streaming servers.

---

## 1. System Architecture

```
                                  +------------------------------------+
                                  |    React 18 + Three.js Frontend    |
                                  |    (HTTP/REST + WebSocket WSS)     |
                                  +------------------+-----------------+
                                                     |
                                                     v
                                  +------------------------------------+
                                  |         FastAPI Gateway            |
                                  |  - JWT Bearer Authentication       |
                                  |  - Token Bucket Rate Limiting      |
                                  |  - Pydantic v2 Contract Validation |
                                  +------------------+-----------------+
                                                     |
         +-------------------+-----------------------+----------------------+--------------------+
         |                   |                       |                      |                    |
         v                   v                       v                      v                    v
+-----------------+ +-----------------+    +-------------------+  +------------------+  +------------------+
|   Telemetry     | | Machine Learning|    |  Root Cause (RCA) |  |   Digital Twin   |  |  MCDA & Reports  |
|  Engine (Live   | | Engine          |    |  Causal Engine    |  |  Virtual Physics |  |  - Decision      |
|  Sensors / WS)  | | - IsolationFrst |    |  - Bayesian Graph |  |  - Finite Stress |  |    Matrix (AHP)   |
|                 | | - Random Forest |    |  - Physics Rules  |  |  - Co-simulation |  |  - ReportLab PDF |
+--------+--------+ +--------+--------+    +---------+---------+  +--------+---------+  +--------+---------+
         |                   |                       |                     |                     |
         +-------------------+-----------------------+---------------------+---------------------+
                                                     |
                                                     v
                                  +------------------------------------+
                                  |  SQLAlchemy 2.0 ORM + Alembic      |
                                  |  PostgreSQL / SQLite Database      |
                                  +------------------------------------+
```

---

## 2. Technology Stack

- **Runtime & Framework:** Python 3.11+ / 3.13, FastAPI 0.115+, Uvicorn (ASGI)
- **Database & Migrations:** SQLAlchemy 2.0 (Modern Declarative Mapped Base), Alembic 1.14+, PostgreSQL (production) / SQLite (zero-setup development)
- **Data Validation & Typing:** Pydantic v2, Pydantic-Settings
- **Security & Cryptography:** Passlib + Bcrypt (Blowfish adaptive cost 12), PyJWT (HMAC-SHA256, expiration guards)
- **Machine Learning & Analytics:** Scikit-Learn 1.6+, Pandas 2.2+, NumPy 2.1+, Joblib
- **Real-Time Streaming:** Native WebSockets with multi-client room manager and pause/resume telemetry
- **Automated Reporting:** ReportLab (vector PDF generation) & Pandas (CSV export)

---

## 3. Directory Layout

```
backend/
├── alembic/                       # Alembic database migrations
│   ├── env.py                     # SQLAlchemy metadata hook
│   ├── script.py.mako             # Revision template
│   └── versions/
│       └── 001_initial_schema.py  # Fully typed migration tables
├── alembic.ini                    # Alembic configuration
├── app/
│   ├── api/v1/                    # Versioned REST & WebSocket routers
│   │   ├── analytics.py           # MTBF, MTTR, availability metrics
│   │   ├── auth.py                # Register, login, refresh, password reset
│   │   ├── faults.py              # Fault ledger, acknowledge, resolve
│   │   ├── history.py             # Telemetry time-travel scrubber
│   │   ├── machines.py            # Fleet asset inventory & components
│   │   ├── predictive.py          # Stochastic RUL & Weibull hazard rates
│   │   ├── recommendations.py     # Multi-criteria decision matrix (MCDA)
│   │   ├── repair.py              # Procedural repair synthesis
│   │   ├── reports.py             # Exportable PDF & CSV generators
│   │   ├── root_cause.py          # Bayesian causal diagnosis tree
│   │   ├── sensors.py             # Metric thresholds and sensor status
│   │   ├── simulation.py          # Virtual Digital Twin co-simulation
│   │   ├── users.py               # Profile & team management
│   │   └── websockets.py          # Live high-frequency telemetry stream
│   ├── core/                      # Global configurations & security
│   │   ├── config.py              # Pydantic BaseSettings (.env loading)
│   │   ├── database.py            # SQLAlchemy engine, session maker, base
│   │   ├── dependencies.py        # Token auth guard, rate limiter, role checks
│   │   └── security.py            # Password hashing & JWT generation
│   ├── ml_models/                 # Serialized model artifacts (.joblib)
│   │   ├── isolation_forest.joblib
│   │   ├── random_forest.joblib
│   │   └── scaler.joblib
│   ├── models/                    # SQLAlchemy ORM database models
│   │   ├── audit.py               # Immutable action logs
│   │   ├── fault.py               # Fault tickets & severity classification
│   │   ├── machine.py             # Assets and physical components
│   │   ├── maintenance.py         # Work orders and service records
│   │   ├── notification.py        # Push alerts and warnings
│   │   ├── repair.py              # Structured repair procedures
│   │   ├── sensor.py              # Telemetry readings & telemetry logs
│   │   ├── simulation.py          # Digital Twin simulation runs & metrics
│   │   └── user.py                # User accounts & RBAC credentials
│   ├── schemas/                   # Pydantic v2 request/response contracts
│   │   ├── analytics.py
│   │   ├── auth.py
│   │   ├── common.py
│   │   ├── fault.py
│   │   ├── machine.py
│   │   ├── predictive.py
│   │   ├── repair.py
│   │   ├── root_cause.py
│   │   ├── sensor.py
│   │   └── simulation.py
│   ├── seed/                      # High-fidelity realistic demo seed data
│   │   └── demo_data.py           # Industrial assets, faults, baseline telemetry
│   ├── services/                  # Business logic & scientific computation
│   │   ├── digital_twin_engine.py # Von Mises stress & thermal solver
│   │   ├── ml_engine.py           # Isolation Forest + Random Forest
│   │   ├── predictive_engine.py   # RUL estimation (P10, P50, P90 bounds)
│   │   ├── recommendation_engine.py # MCDA Weighted Product Model
│   │   ├── repair_engine.py       # Deterministic repair strategy synthesizer
│   │   ├── report_generator.py    # ReportLab PDF & CSV builder
│   │   ├── root_cause_engine.py   # Multi-sensor Bayesian causal network
│   │   └── sensor_engine.py       # Stochastic telemetry stream generator
│   └── main.py                    # FastAPI application initialization & lifespan
├── requirements.txt               # Locked dependencies
├── run_seed.py                    # One-command database seeder script
├── test_api.py                    # End-to-end automated integration test suite
└── .env.example                   # Environment configuration template
```

---

## 4. Setup & Installation

### Prerequisites
- Python 3.11, 3.12, or 3.13 installed
- Virtual environment tool (`venv` or `conda`)

### Step 1: Initialize Virtual Environment
```bash
cd backend
python -m venv venv

# Windows (PowerShell / Command Prompt):
venv\Scripts\activate

# Linux / macOS:
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default parameters run out-of-the-box with SQLite (`sqlite:///./machinemind.db`). For enterprise PostgreSQL, modify:
```ini
DATABASE_URL=postgresql+psycopg2://postgres:yourpassword@localhost:5432/machinemind
```

### Step 4: Run Migrations & Seed Data
```bash
# Apply schema revisions via Alembic
alembic upgrade head

# Seed reproducible enterprise industrial assets, users, and faults
python run_seed.py
```

### Step 5: Start FastAPI Server
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API documentation will be available at:
- **Swagger UI:** `http://localhost:8000/api/v1/docs`
- **ReDoc:** `http://localhost:8000/api/v1/redoc`
- **OpenAPI JSON:** `http://localhost:8000/api/v1/openapi.json`
- **Health Check:** `http://localhost:8000/health`

---

## 5. Seed Accounts & Credentials

The database initialization script (`run_seed.py`) populates realistic enterprise test accounts:

| Role | Name | Email | Password |
|---|---|---|---|
| **Chief Reliability Engineer** | Dr. Elena Vance | `elena.vance@machinemind.ai` | `ApexReliability2026!` |
| **Lead Diagnostic Technician** | Marcus Sterling | `marcus.sterling@machinemind.ai` | `TurbineGuard2026!` |
| **Site Operations Director** | Sarah Chen | `sarah.chen@machinemind.ai` | `PlantSecure2026!` |

---

## 6. Artificial Intelligence & Physics Engines

### A. Machine Learning Anomaly Detection & Classification (`ml_engine.py`)
- **Unsupervised Anomaly Detection:** `IsolationForest` (150 estimators, 4% contamination factor). Evaluates normalized sensor vectors across temperature, horizontal/axial vibration, barometric line pressure, and drive RPM.
- **Supervised Fault Classifier:** `RandomForestClassifier` (100 estimators, Gini impurity criterion). Identifies 6 distinct fault categories:
  1. `BEARING_INNER_RACE_WEAR`
  2. `STATOR_WINDING_OVERHEAT`
  3. `DYNAMIC_ROTOR_UNBALANCE`
  4. `CAVITATION_INDUCED_PULSATION`
  5. `STRUCTURAL_LOOSENESS`
  6. `LUBRICATION_STARVATION`
- **Feature Attribution:** Calculates relative sensor deviation percentage from nominal baseline to explain decision boundaries.

### B. Bayesian Causal Root Cause Analysis (`root_cause_engine.py`)
Combines multi-sensor statistical correlation matrices with physical machine component topologies:
- Evaluates acoustic vibration velocity ($RMS_{mm/s}$) against ISO 10816-3 vibration severity limits.
- Evaluates thermal gradient rates ($\Delta T / \Delta t$) against thermal class F/H limits.
- Constructs probabilistic causal DAG with primary suspect, supporting evidence, secondary downstream risks, and explicit uncertainty quantification ($1 - \text{Bayesian Confidence}$).

### C. Digital Twin Physics Co-Simulator (`digital_twin_engine.py`)
Simulates the impact of proposed repair interventions before field deployment:
- **Thermal Dissipation Model:** Newton's law of cooling with modified heat transfer coefficient $h_{eff}$:
  $$T(t) = T_{ambient} + (T_0 - T_{ambient}) \cdot e^{-\frac{h_{eff} \cdot A}{m \cdot C_p} t}$$
- **Vibration Damping Model:** Second-order damped harmonic oscillator response to residual dynamic unbalance:
  $$v(t) = v_0 \cdot e^{-\zeta \omega_n t} \cos(\omega_d t)$$
- **Mechanical Stress Analysis:** Estimates Von Mises equivalent stress $\sigma_v$ across bearing raceways and shaft fillets.
- **Safety Violation Gates:** Checks peak values against API 670 trip limits (Vibration $> 11.2\text{ mm/s}$, Temperature $> 105^\circ\text{C}$). Rejects unviable strategies automatically.

### D. Multi-Criteria Decision Recommendation (`recommendation_engine.py`)
Ranks repair strategies using an industrial Analytic Hierarchy Process (AHP) weighted decision matrix:
$$\text{Score} = w_s \cdot S_{\text{safety}} + w_c \cdot S_{\text{cost}} + w_t \cdot S_{\text{time}} + w_p \cdot S_{\text{perf}} + w_e \cdot S_{\text{energy}}$$
- Default weights prioritize human safety ($35\%$) and operational performance ($25\%$), followed by recovery duration ($15\%$), capital expenditure ($15\%$), and energy efficiency ($10\%$).

### E. Predictive Remaining Useful Life (RUL) Engine (`predictive_engine.py`)
- Calculates stochastic Remaining Useful Life using exponential degradation modeling with Monte Carlo sampling.
- Emits calibrated confidence intervals: **P10 (conservative lower bound)**, **P50 (median expectancy)**, and **P90 (optimistic upper bound)**.
- Integrates Weibull cumulative hazard distribution:
  $$F(t) = 1 - e^{-\left(\frac{t}{\eta}\right)^\beta}$$
  where $\beta$ is the aging shape parameter ($\beta > 1$ represents wear-out phase) and $\eta$ is characteristic life.

---

## 7. Real-Time Telemetry & WebSockets

Clients connect to live high-frequency telemetry via:
`ws://localhost:8000/api/v1/ws/machines/{machine_id}`

### Supported Incoming Control Frames:
```json
{ "action": "set_scenario", "scenario": "overheating" }
{ "action": "set_scenario", "scenario": "excessive_vibration" }
{ "action": "set_scenario", "scenario": "pressure_abnormal" }
{ "action": "set_scenario", "scenario": "normal" }
{ "action": "pause" }
{ "action": "resume" }
{ "action": "ping" }
```

### Emitted Telemetry Packet:
```json
{
  "type": "telemetry",
  "machine_id": "MCH-IND-001",
  "timestamp": "2026-10-24T08:15:30.120Z",
  "health_score": 88.4,
  "operating_status": "WARNING",
  "scenario": "excessive_vibration",
  "sensors": {
    "temperature": { "value": 84.2, "unit": "°C", "status": "WARNING" },
    "vibration": { "value": 6.8, "unit": "mm/s", "status": "CRITICAL" },
    "pressure": { "value": 4.1, "unit": "bar", "status": "NOMINAL" },
    "rpm": { "value": 2980, "unit": "RPM", "status": "NOMINAL" }
  },
  "is_simulated": true
}
```

---

## 8. Automated Integration Testing

To run the complete automated 13-suite integration test:
```bash
python test_api.py
```
This tests:
1. Health & Readiness endpoints
2. Authentication & JWT access tokens
3. Machine & Sensor Fleet queries
4. Fault classification & ML scoring
5. Root cause analysis & Bayesian evidence
6. Repair strategy generation
7. Digital Twin physics simulation execution
8. MCDA recommendation matrix ranking
9. Predictive RUL confidence bounds calculation
10. Machine operating history time-travel scrubber
11. Analytics KPI calculations (MTBF, MTTR, Availability)
12. PDF & CSV report generation
13. Bidirectional WebSocket telemetry streaming
