# SmallBiz AI Operations Room

An enterprise-grade autonomous operations room for small and medium businesses. Coordinates 4 specialized AI agents—**Business Research**, **Feasibility Analysis**, **Sales & Quotations**, and **Operations & Governance**—to transform raw customer inquiries into validated feasibility models, branded quotations, client proposals, and staged operational tasks.

Built with a **Midnight Lighthouse** aesthetic, powered by a **FastAPI** backend, persisted to **Neon PostgreSQL Serverless**, and orchestrated through the official **Switch Agent Protocol** (SandboxAQ Switch).

---

## 🏛 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│             React + Vite + TypeScript Frontend              │
│                (Midnight Lighthouse Design)                 │
│                 http://localhost:5174                       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST (CORS enabled)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FastAPI Backend Service                     │
│                  http://127.0.0.1:8000                      │
│                                                             │
│   /api/auth/*       /api/dashboard      /api/inquiries      │
│   /api/workflows    /api/quotations     /api/proposals      │
│   /api/tasks        /api/agents         /api/health/db      │
└──────────────┬───────────────────────────────┬──────────────┘
               │ SQLAlchemy 2.0 (psycopg 3)    │ Switch Agent Protocol
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│   Neon PostgreSQL Database   │ │   Switch Core Agent Bridge │
│   (Serverless, 7 Tables)     │ │   HTTP & Room Collaboration│
│   Users, Inquiries, Quotes,  │ │   4 Registered Agents      │
│   Proposals, Tasks, Logs     │ │   Live Room Message Bus    │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 🧰 Tech Stack

* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React
* **Backend:** Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.0 (Synchronous)
* **PostgreSQL Driver:** `psycopg` (Psycopg 3.3.6)
* **Database:** Neon PostgreSQL Serverless (AWS `ap-southeast-1`, PostgreSQL 18.6)
* **Agent Orchestration:** Switch Agent Protocol (`switch-core` 0.31.0 via Switch Console)

---

## 📁 Project Structure

```
.
├── frontend/                     # React + Vite + TypeScript application
│   ├── .env                      # VITE_API_BASE_URL=http://localhost:8000
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/           # UI views, modals, cards, workflow canvas
│       ├── hooks/                # useOperationsRoom central state hook
│       ├── services/             # authApi, dashboardApi, inquiryApi, workflowApi, taskApi
│       └── types/                # Domain TypeScript models
│
├── backend/                      # FastAPI Python backend
│   ├── .env                      # DATABASE_URL, SWITCH_*, PORT, ALLOWED_ORIGINS
│   ├── .env.example              # Sanitized template
│   ├── requirements.txt          # Production dependencies including psycopg[binary]
│   └── app/
│       ├── main.py               # FastAPI entrypoint, lifespan table creation & health
│       ├── config.py             # Dynamic environment settings loader
│       ├── database.py           # Synchronous SQLAlchemy 2.0 engine & session maker
│       ├── models/               # 7 SQLAlchemy domain models
│       ├── schemas/              # Pydantic v2 request/response schemas
│       ├── services/             # auth, inquiry, feasibility, quotation, operations, switch
│       └── api/endpoints/        # REST route handlers
│
├── .gitignore                    # Root secret & cache protection
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```ini
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```ini
APP_NAME="SmallBiz AI Operations Room"
ENVIRONMENT="development"
DEBUG=true
PORT=8000
HOST="127.0.0.1"

# Database Configuration (Neon PostgreSQL)
DATABASE_URL="postgresql+psycopg://<user>:<password>@<host>/<dbname>?sslmode=require"

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:5174","http://127.0.0.1:5173","http://127.0.0.1:5174"]

# Switch Multi-Agent Orchestration Credentials
SWITCH_API_KEY="<AGENT_REGISTRATION_TOKEN>"
SWITCH_ROOM_ID="<SWITCH_ROOM_UUID>"
SWITCH_ENDPOINT="http://127.0.0.1:49243"
```

---

## 🚀 Running the Application

### 1. Backend Setup & Startup
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*API Documentation available at: `http://127.0.0.1:8000/docs`*  
*Database Health Check: `http://127.0.0.1:8000/api/health/db`*

### 2. Frontend Setup & Startup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
pnpm install

# Start Vite dev server
pnpm run dev
```
*Application available at: `http://localhost:5174`*

---

## 🤖 Switch Multi-Agent Integration

The platform integrates directly with the **Switch Agent Protocol**:

1. **Agent Registration:** On startup, the backend registers the 4 business agents via `POST /agents` against the running Switch server (`http://127.0.0.1:49243`), obtaining unique agent IDs and auth tokens.
2. **Room Coordination:** Agents discover active Switch rooms (or auto-bridge from Mattermost/Slack channels).
3. **Agent Handoffs:** As an inquiry advances, structured handoffs are dispatched into the Switch Room ledger via `POST /agents/{agent_id}/message` with full context payloads.
4. **Operations Milestone Broadcasting:** Completed pipelines broadcast execution proofs, Jira issue tickets, and Stripe invoice drafts into the shared room.

### The 4 Specialized Business Agents
| Agent | Role | Capabilities |
|---|---|---|
| **Business Research Agent** | Inbound Intelligence & RFP Parsing | OCR extraction, CRM ingestion, requirement verification |
| **Analysis Agent** | Feasibility Calculation & Cost Modeling | Monte Carlo simulation, margin modeling, infrastructure risk |
| **Sales & Writing Agent** | Proposal Generation & Quote Drafting | Itemized pricing schedules, proposal copywriting, executive briefs |
| **Operations Agent** | Governance, Dispatch & Switch Ledger | SOC2 checklist audit, Jira epic dispatch, Stripe billing, Slack alerts |

---

## 🧪 Demo Workflow (Sample Lead)

Follow these steps to run a complete end-to-end multi-agent test:

1. **Sign In**: Access `http://localhost:5174` and sign in or create an account via the Sign Up tab:
   * **Seeded Admin Account:** `alex@apexlogistics.com` (initialized via backend auth seeder)
2. **Submit Inquiry**: Click **Simulate Inbound Lead** (or submit custom inquiry):
   * **Client:** `Heritage College Apparel`
   * **Product:** `50 customised T-shirts`
   * **Budget:** `₹15,000`
   * **Delivery:** `10 days`
3. **Multi-Agent Pipeline Run**:
   * **Research Agent** verifies and stores inquiry in Neon (`INQ-...`).
   * **Analysis Agent** calculates feasibility (94.2% confidence).
   * **Sales Agent** generates quotation (`QTE-...`) and branded proposal (`PRP-...`).
   * **Operations Agent** provisions staged Jira & Stripe tasks and posts milestones to Switch.
4. **Governance Approval**: Click **Approve & Dispatch Workflow** to confirm dispatch.
5. **Verify Neon DB**: All 7 tables store real persistent records accessible via `/api/dashboard`.

---

## 🔒 Security Posture

* **Zero Frontend Secret Exposure**: No `DATABASE_URL` or Switch tokens are bundled or exposed in client builds.
* **Strict Git Protection**: `.gitignore` excludes `.env*`, `*.db`, SQLite files, tokens, and caches.
* **Database Connection Security**: SSL mode enforced (`sslmode=require&channel_binding=require`).
* **Authentication**: Salted SHA-256 password hashing with cryptographically secure session tokens.
