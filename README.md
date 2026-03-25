# MicroHealth — Microservices Learning Project

A **minimal, beginner-friendly microservices system** built with Node.js + Express + MongoDB + React. Designed to teach the fundamentals of distributed systems in one sitting.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (port 5173)                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP requests
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API Gateway (port 3000)                         │
│                                                                  │
│  /api/auth/*        → validates? NO  (public)                    │
│  /api/patients/*    → validates JWT → then forwards              │
│  /api/appointments/* → validates JWT → then forwards             │
└─────┬──────────────────────┬─────────────────────┬──────────────┘
      │                      │                     │
      ▼                      ▼                     ▼
┌────────────┐    ┌──────────────────┐   ┌─────────────────────┐
│ Auth (3001)│    │ Patient (3002)   │   │ Appointment (3003)  │
│ auth-db    │    │ patient-db       │   │ appointment-db      │
└────────────┘    └──────────────────┘   └─────────────────────┘
```

**Key principles:**
- The frontend talks to ONE server — the API Gateway
- Each service has its OWN MongoDB database (no sharing)
- The gateway validates JWTs before forwarding to protected services

---

## 🔐 Auth Flow (Step-by-Step)

```
1. React sends POST /api/auth/login  { email, password }
2. Gateway sees /api/auth/* → forwards WITHOUT JWT check (public route)
3. Auth Service: finds user, checks bcrypt hash, signs JWT
4. Auth Service returns { token: "eyJ..." }
5. React stores token in localStorage
6. React sends GET /api/patients with header: Authorization: Bearer <token>
7. Gateway middleware: reads header → verifies JWT → if valid, forwards request
8. Patient Service: returns patients from patient-db
```

---

## 📁 Project Structure

```
testingForDS/
├── gateway/
│   ├── index.js              ← Entry point, JWT guard, proxy setup
│   ├── middleware/auth.js    ← JWT verification middleware
│   ├── routes/index.js       ← Proxy route definitions
│   └── .env
├── services/
│   ├── auth-service/
│   │   ├── models/User.js
│   │   ├── services/authService.js
│   │   ├── controllers/authController.js
│   │   ├── routes/authRoutes.js
│   │   └── index.js
│   ├── patient-service/
│   │   ├── models/Patient.js
│   │   ├── services/patientService.js
│   │   ├── controllers/patientController.js
│   │   ├── routes/patientRoutes.js
│   │   └── index.js
│   └── appointment-service/
│       ├── models/Appointment.js
│       ├── services/appointmentService.js
│       ├── controllers/appointmentController.js
│       ├── routes/appointmentRoutes.js
│       └── index.js
└── frontend/
    └── src/
        ├── api/axiosInstance.js
        ├── pages/LoginPage.jsx
        ├── pages/PatientsPage.jsx
        ├── pages/AppointmentsPage.jsx
        └── App.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on port 27017

### Step 1 — Install MongoDB

Make sure MongoDB is running:
```bash
# Windows (if installed as service)
net start MongoDB

# Or run mongod directly
mongod
```

### Step 2 — Install dependencies for all services

Open **4 separate terminals** and run in each folder:

```bash
# Terminal 1 — Gateway
cd gateway
npm install

# Terminal 2 — Auth Service
cd services/auth-service
npm install

# Terminal 3 — Patient Service
cd services/patient-service
npm install

# Terminal 4 — Appointment Service
cd services/appointment-service
npm install

# Terminal 5 — Frontend
cd frontend
npm install
```

### Step 3 — Start all services

In each terminal (order matters — start services before the gateway):

```bash
# Terminal 2
cd services/auth-service && npm run dev

# Terminal 3
cd services/patient-service && npm run dev

# Terminal 4
cd services/appointment-service && npm run dev

# Terminal 1 (after services are up)
cd gateway && npm run dev

# Terminal 5
cd frontend && npm run dev
```

### Ports
| Service             | Port |
|---------------------|------|
| API Gateway         | 3000 |
| Auth Service        | 3001 |
| Patient Service     | 3002 |
| Appointment Service | 3003 |
| React Frontend      | 5173 |

---

## 🧪 Sample API Calls

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'
```

### Login (save the token!)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'
```

### Add Patient (use your token)
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","age":35,"condition":"Hypertension"}'
```

### Get Patients
```bash
curl http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Appointment (use a patient's _id from above)
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"patientId":"PATIENT_ID_HERE","date":"2025-04-10"}'
```

### Test unauthorized access (no token)
```bash
curl http://localhost:3000/api/patients
# Expected: 401 Unauthorized
```

---

## 🧠 Key Concepts Demonstrated

| Concept | Where |
|---|---|
| API Gateway pattern | `gateway/index.js` |
| JWT authentication | `gateway/middleware/auth.js`, `auth-service/services/authService.js` |
| Database isolation | Each service has its own `.env` with a unique `MONGO_URI` |
| Service boundaries | Services never call each other directly |
| Functional programming | All code uses plain functions — no classes |
| Layered architecture | models → services → controllers → routes |
