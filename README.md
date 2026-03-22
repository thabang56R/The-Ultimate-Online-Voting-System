


# 🗳️ Ultimate Online Voting System (with ML Fraud Detection)

![CI](https://github.com/thabang56R/The-Ultimate-Online-Voting-System/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/Node.js-18+-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Python](https://img.shields.io/badge/ML-Python-yellow)
![Status](https://img.shields.io/badge/status-active-success)


---

## 🌟 Vision

The Ultimate Online Voting System aims to modernize digital elections by combining **secure voting infrastructure** with **AI-powered fraud detection**.

The goal is to ensure:
- Transparency
- Security
- Trust in digital voting systems

By integrating machine learning into the voting pipeline, the system detects suspicious voting behavior in real-time and enables administrators to take action before results are compromised.

---

## 🚀 Overview

This is a **full-stack, microservice-based application** that simulates a real-world voting platform with built-in fraud detection.

---

### 🔑 Key Highlights

- Secure user authentication (JWT-based)
- Real-time vote casting system
- ML-powered fraud detection engine
- Admin dashboard for monitoring suspicious activity
- Scalable microservice architecture

---

## 🧠 Machine Learning (Fraud Detection Engine)

The platform includes a **Python-based ML microservice** that evaluates voting behavior and assigns a fraud risk score.

---

### 🔍 Model Details

- **Model Type:** Random Forest Classifier *(customizable)*
- **Frameworks:** scikit-learn, NumPy, Pandas
- **Deployment:** FastAPI
- **Serialization:** Joblib
---

### 📊 Features Used

- Voting frequency
- IP request patterns
- Time intervals between votes
- Device/session behavior

---

## ⚡ How It Works

1. User casts a vote

2. Backend sends data to ML service

3. ML model evaluates risk

4. Suspicious votes are flagged

5  Admin can review flagged activity

---

## 🏗️ System Architecture

Frontend (React)

        ↓
        
Backend API (Node.js / Express)

        ↓
        
ML Microservice (FastAPI)

        ↓
        
MongoDB Database


---

## 🛠️ Tech Stack

# 💻 Frontend

React + Vite

Tailwind CSS

Axios

# 🔧 Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

# 🤖 Machine Learning

Python

FastAPI

scikit-learn

Pandas / NumPy

# ⚙️ DevOps

GitHub Actions (CI/CD)

Render & Vercel (Deployment)

---

## 🔐 Core Features

# 👤 Authentication & Security

- User registration & login

- JWT-based authentication

- Role-based access (Admin/User)

---

## 🗳️ Voting System

- Create and manage elections

- Cast votes securely

- Prevent duplicate voting

---
## 🚨 Fraud Detection

- Real-time vote risk scoring

- Suspicious vote flagging

- Behavioral anomaly detection

---
## 🧾 Admin Dashboard

- Monitor all votes

- Review flagged votes

- Take administrative action

---

## 📁 Project Structure

├── frontend/        # React frontend

├── backend/         # Node.js API

├── ml-service/      # Python ML 
microservice

├── .github/         # CI/CD workflows


---

## ⚡ Getting Started

1️⃣ Clone the Repository

git clone https://github.com/thabang56R/The-Ultimate-Online-Voting-System.git
cd The-Ultimate-Online-Voting-System

2️⃣ Setup Backend

cd backend

npm install

npm start

3️⃣ Setup Frontend

cd frontend

npm install

npm run dev

4️⃣ Setup ML Service

cd ml-service

pip install -r requirements.txt

uvicorn main:app --reload

---

## 📌 Future Improvements

- Real-world dataset integration
- Advanced anomaly detection (Isolation Forest / Neural Networks)
- Blockchain-based vote verification
- Live analytics dashboard
- Multi-factor authentication (MFA)

---

## 🎯 Why This Project Stands Out

This project demonstrates:

✅ Full-stack engineering skills

✅ Microservice architecture understanding

✅ Real-world problem solving (fraud detection)

✅ Integration of ML into production systems

✅ Scalable and modular design

---

## 👨‍💻 Author

Thabang Rakeng

GitHub: https://github.com/thabang56R

---

📄 License

This project is licensed under the MIT License.

### 📈 Example Prediction
---


```json
POST /predict

Input:
{
  "vote_time_interval": 2,
  "ip_requests": 10,
  "device_switch": 1
}

Output:
{
  "risk_score": 0.87,
  "is_fraud": true
}

---
