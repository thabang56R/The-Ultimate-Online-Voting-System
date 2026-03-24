# 🗳️ The Ultimate Online Voting System (With ML -Powered Fraud detection)

[![CI](https://github.com/thabang56R/The-Ultimate-Online-Voting-System/actions/workflows/ci.yml/badge.svg)](https://github.com/thabang56R/The-Ultimate-Online-Voting-System/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![FastAPI](https://img.shields.io/badge/ML-FastAPI-orange)
![Python](https://img.shields.io/badge/ML-Python-yellow)
![License](https://img.shields.io/badge/License-MIT-purple)
![Status](https://img.shields.io/badge/Status-Production--Ready-success)

---

## 🌟 Vision

To build a secure, intelligent, and scalable online voting platform that combines modern full-stack engineering with machine learning–powered fraud detection.

This project is designed to demonstrate how digital voting systems can be improved through:

- 🔐 Secure authentication and vote integrity
- 🤖 AI-assisted fraud and anomaly detection
- ⚖️ Transparent and auditable decision workflows
- 👨‍⚖️ Human-in-the-loop review for suspicious activity

Rather than replacing human judgment, the ML component acts as a decision-support layer that helps administrators detect risk, review flagged activity, and improve trust in online election systems.

---

## 🚀 Live Demo

🌐 Frontend: *(Add your Vercel link here)*  
🔗 Backend API: *(Add your Render link here)*  
🤖 ML Service: *(Add your FastAPI link here if deployed)*  

---

# 🔑 Demo Credentials

 ### role: admin
 
email: admin@securevote.demo

password: hashedPassword
 
### role: election_officer
 
email: officer@securevote.demo
 
password: hashedPassword
 
 ### role: voter
 
 email: thabo@securevote.demo
 
 password: hashedPassword
 
---

## 🏗️ System Architecture

A scalable **microservice-based architecture** combining MERN + ML.

User (React Frontend)

↓

Node.js Backend API

↓

MongoDB Database

↓

FastAPI ML Service

↓

Fraud Detection Model

---

## 📁 Project Structure

```bash
The-Ultimate-Online-Voting-System/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── ml-service/
│   ├── app/
│   │   ├── main.py
│   │   ├── model_loader.py
│   │   ├── predictor.py
│   │   └── schemas.py
│   │
│   ├── artifacts/
│   │   ├── confusion_matrix.png
│   │   ├── feature_importance.csv
│   │   └── metrics.json
│   │
│   ├── data/
│   │   └── voting_risk_dataset.csv
│   │
│   ├── models/
│   │   ├── feature_columns.pkl
│   │   ├── model_metadata.json
│   │   └── risk_model.pkl
│   │
│   ├── scripts/
│   │   ├── evaluate.py
│   │   ├── prepare_data.py
│   │   └── train.py
│   │
│   ├── requirements.txt
│   └── train_model.py
│
├── .gitignore
└── README.md


```

---

### 🧩 Components Overview

| Layer | Technology | Responsibility |
|------|------------|---------------|
| 🎨 Frontend | React + Vite | UI, voting interface, dashboards |
| ⚙️ Backend | Node.js + Express | Authentication, voting logic, APIs |
| 🗄️ Database | MongoDB | Store users, elections, votes |
| 🤖 ML Service | FastAPI (Python) | Fraud detection inference |
| 🧠 Model | Random Forest | Risk scoring |

---

### 🔄 Request Flow

1. User logs in and casts a vote  
2. Backend validates and stores vote  
3. Vote data is sent to ML service  
4. ML model evaluates risk  
5. Response includes fraud score  
6. Admin reviews suspicious votes  

---

## ✨ Features

### 🔐 Authentication & Security
- JWT Authentication
- Role-based access (Admin / Voter)
- Secure API endpoints

### 🗳️ Voting System
- Create elections
- Add candidates
- Cast votes securely
- Prevent duplicate voting

### 📊 Admin Dashboard
- View results
- Monitor voting activity
- Manage elections

### 🚨 AI Fraud Detection
- Detect suspicious voting patterns
- Risk scoring system
- Admin review workflow

### 📜 Audit Logs
- Track system activities
- Maintain transparency

---

## 🤖 ML Model Evaluation

### 🧠 Model Overview

- Algorithm: **Random Forest Classifier**
- Type: Supervised Learning
- Purpose: Detect suspicious voting behavior

---

### 📊 Features Used

- Multiple votes from same user/device  
- Repeated IP address activity  
- Voting time anomalies  
- Duplicate voting patterns  
- Geo-location inconsistencies  
- Device/browser irregularities  

---

### ⚙️ Training Pipeline

Dataset → Preprocessing → Train/Test Split → Model Training → Evaluation → Save Model

---

### 📈 Evaluation Metrics

| Metric | Description |
|------|------------|
| 🎯 Accuracy | Overall correctness |
| 🔍 Precision | Correct fraud predictions |
| 📡 Recall | Ability to detect fraud |
| ⚖️ F1-Score | Balance between precision & recall |

---

### 📊 Example Results

- Accuracy: 0.91

- Precision: 0.89

- Recall: 0.84

- F1-Score: 0.86

---

> ⚠️ Accuracy alone is not enough in fraud detection due to class imbalance.

---

### 🧪 Model Output

- Prediction (Legitimate / Suspicious)  
- Risk Score  
- Admin Review Recommendation  

---

### 🔎 Why This Matters

The ML model acts as a **decision-support system**, helping:
- Detect fraud  
- Improve election integrity  
- Support admin decisions  
- Increase transparency  

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Axios
- Tailwind / Chakra UI

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

### ML Service
- Python
- FastAPI
- Scikit-learn
- Joblib

### DevOps
- Render (Backend)
- Vercel (Frontend)
- GitHub Actions (CI/CD)

---

## ⚙️ Installation

### 1️⃣ Clone Repo

git clone https://github.com/thabang56R/The-Ultimate-Online-Voting-System.git

cd The-Ultimate-Online-Voting-System

## 2️⃣ Backend Setup

cd backend

npm install

npm run dev

## 3️⃣ Frontend Setup

cd frontend

npm install

npm run dev

## 4️⃣ ML Service Setup

cd ml-service

pip install -r requirements.txt

uvicorn main:app --reload

---

🔐 Environment Variables
Backend (.env)

PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

CLIENT_ORIGIN=http://localhost:5173

ML_SERVICE_URL=http://localhost:8000

---

ML Service (.env)

MODEL_PATH=model.joblib

---

🚀 Deployment

- Frontend → Vercel

- Backend → Render

- ML Service → Render / Railway

---

### 🚀 Future Improvements

## 🤖 ML

- Confusion Matrix

- ROC-AUC tracking

- Feature importance

- Model versioning

- Real-time monitoring

## ⚙️ Backend

- Queue system (Kafka / RabbitMQ)

- Advanced security (2FA)

- Performance optimization

## 🌍 DevOps

-Docker support

-AWS / Azure deployment

-Monitoring tools

---

## 📄 License

MIT License

---

👨‍💻 Author

Thabang Rakeng

- 🎓 BSc Computer Science & Mathematics

- 💻 Full Stack Developer (MERN + AI)

- 🤖 AI/ML Enthusiast

🔗 GitHub: https://github.com/thabang56R

---

⭐ Final Note

This project demonstrates:

- Full-stack engineering (MERN)

- Microservice architecture

- Machine learning integration

- Real-world problem solving

👉 Built to bridge the gap between software engineering and AI systems
