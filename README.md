# SecureVote AI

> An enterprise-style online voting platform built with the MERN stack and an ML-powered fraud detection microservice.

SecureVote AI combines secure digital voting, role-based election management, audit logging, anomaly detection, voter risk scoring, and an admin security dashboard to simulate how modern, high-integrity election systems can detect suspicious behavior **without allowing AI to decide vote outcomes**.

---

## Vision

SecureVote AI aims to demonstrate what a modern online voting platform could look like when built with:

- secure vote casting workflows
- auditable decision trails
- ML-assisted fraud detection
- human review for suspicious activity
- premium voter and admin experiences

The goal is not just to build another CRUD system, but to design a platform that reflects how real-world election-tech and fintech-style systems approach trust, oversight, and security.

---

## Key Features

### Core Voting System

- Voter login and dashboard
- Election creation and management
- Candidate creation and management
- Vote casting with one-voter-one-vote enforcement
- Public election browsing
- Election details page
- Results page backed by real aggregated vote totals

### ML Fraud Detection

- Python FastAPI microservice
- Risk scoring before vote acceptance
- Suspicious behavior detection
- Risk levels: low, medium, high
- Flag generation for review signals

### Admin Security Workspace

- Admin login
- Dashboard stats
- Suspicious vote review queue
- Risk events monitoring
- Audit logs
- Approve / reject workflow for challenged and flagged votes

### Audit & Transparency

- Audit log records for sensitive actions
- Risk event history
- Review notes and timestamps
- Admin review traceability

---

## Architecture

```text
Frontend (React + Vite)
   |
   |---- Public voter pages
   |---- Admin dashboard
   |
Backend API (Node.js + Express)
   |
   |---- MongoDB Atlas
   |---- Auth / Elections / Candidates / Votes / Results / Audit Logs
   |
ML Service (Python + FastAPI)
   |
   |---- Risk scoring
   |---- Fraud / anomaly detection logic

  ## Tech Stack

## Frontend

React

React Router

Tailwind CSS

Framer Motion

Lucide React

Recharts

## Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Axios

Helmet

Morgan

Express Rate Limit

## ML Service

Python

FastAPI

Pydantic

Uvicorn

Scikit-learn

NumPy

Pandas

Joblib

### Project Structure

SecureVote-AI/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── voter/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   ├── server.js
│   ├── app.js
│   └── package.json
│
├── ml-service/
│   ├── app/
│   │   ├── main.py
│   │   ├── schemas.py
│   │   └── predictor.py
│   └── requirements.txt
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
└── README.md
```
