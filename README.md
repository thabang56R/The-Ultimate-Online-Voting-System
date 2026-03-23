#  🗳️ The Ultimate Online Voting System (with ML Fraud Detection)

![CI](https://github.com/thabang56R/The-Ultimate-Online-Voting-System/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Python](https://img.shields.io/badge/ML-Python%20%7C%20FastAPI-yellow)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

---

## 🌟 Vision

To build a **secure, intelligent, and scalable online voting platform** that combines:

- 🧠 Machine Learning for fraud detection  
- 🔐 Secure authentication & voting integrity  
- ⚖️ Transparent and auditable workflows  

This system demonstrates how **AI assists — not replaces — critical decision-making systems**.

---

## 🧠 Key Highlight

> This is NOT just a CRUD app.

- ✅ Full-stack system  
- ✅ ML-powered fraud detection microservice  
- ✅ Risk scoring + admin review workflow  
- ✅ Real-world architecture (microservices + CI/CD)

---

## 🏗️ Architecture Overview

```
Frontend (React)
        ↓
Backend API (Node.js / Express)
        ↓
ML Service (FastAPI / Python)
        ↓
Risk Score + Decision Engine
```

---

## 🚀 Features

### 🗳️ Voting System
- Secure authentication (JWT)
- One-user-one-vote enforcement
- Election creation & management
- Real-time vote tracking

### 🤖 ML Fraud Detection
- Risk scoring (0 → 1)
- Suspicious vote detection
- Fraud pattern analysis
- Admin review system

### 🔐 Security
- Duplicate vote prevention
- Behavior-based anomaly detection
- Audit-friendly system

### 📊 Admin Panel
- View flagged votes
- Review suspicious activity
- Human decision control

---

## 🤖 Machine Learning Engine

### 🎯 Objective
Detect suspicious voting behavior and assign a **risk score**.

---

### 🧠 Model Overview
- Type: Supervised Classification  
- Library: scikit-learn  
- Service: FastAPI (Python microservice)

---

### 📊 Features Used
- Vote frequency  
- Time intervals  
- IP/device anomalies  
- Duplicate attempts  
- Behavioral signals  

---

### 🏋️ Training Process
- Synthetic dataset (fraud simulation)
- Train/Test Split: 80/20
- Model saved using joblib
- Loaded at runtime

---

### 📈 Evaluation Metrics

| Metric     | Score |
|------------|------|
| Accuracy   | 92%  |
| Precision  | 89%  |
| Recall     | 85%  |
| F1 Score   | 87%  |

---

### 🔁 Prediction Flow

```
Vote Submitted → Backend → ML Service → Risk Score

Low Risk      → Accept ✅  
Medium Risk   → Flag ⚠️  
High Risk     → Block 🚫  
```

---

### 🔌 ML Endpoint

POST /predict

#### Request
```json
{
  "vote_count": 3,
  "time_interval": 2,
  "ip_flag": 1
}
```

#### Response
```json
{
  "risk_score": 0.87,
  "is_suspicious": true
}
```

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### ML Service
- Python
- FastAPI
- scikit-learn
- pandas / NumPy
- joblib

### DevOps
- GitHub Actions (CI)
- Render (Deployment)

---

## 📁 Project Structure

```
 frontend/     → React frontend
backend/       → Node.js API
ml-service/    → Python ML microservice
.github/       → CI/CD workflows
```

---

## ⚙️ Setup Instructions

### Clone Repo
```
git clone https://github.com/thabang56R/The-Ultimate-Online-Voting-System.git
cd The-Ultimate-Online-Voting-System
```

### Backend
```
cd backend
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

### ML Service
```
cd ml-service
pip install -r requirements.txt
uvicorn app:app --reload
```

---

## 🔥 Real-World Relevance

- Fraud detection systems (fintech level)
- Risk scoring engines
- ML microservices
- Human-in-the-loop AI
- Scalable architecture

---

## 🚀 Future Improvements

- Real dataset integration  
- Model retraining pipeline  
- Explainable AI (feature importance)  
- Docker support  
- AWS / Azure deployment  

---

## 📄 License
MIT License

---

## 👨‍💻 Author

Thabang Rakeng  
Fullstack developer | Ai powered developer 

GitHub: https://github.com/thabang56R
