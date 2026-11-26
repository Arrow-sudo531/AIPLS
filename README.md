# AIPLC — AI-Mediated Personalized Learning & Behavioural Change

> **NPTEL Summer Internship 2026** | IIT Kharagpur × VIT Bhopal University  
> Developed by **Aman Shakya** under the supervision of **Prof. Atasi Mohanty**

---

## 🧠 What is AIPLC?

AIPLC is a three-phase AI-powered learning platform built on Zimmerman's Self-Regulated Learning (SRL) model. It helps students **Plan** their study goals, **Act** using Pomodoro-timed sessions, and **Reflect** through AI-driven behavioural analysis that classifies them into one of four learner personas using K-Means clustering.

---

## 🏗️ Architecture

```
React Frontend (Port 5173)
        ↕ REST API
Spring Boot Backend (Port 8080)
        ↕ REST API            ↕ JPA/Hibernate
Python FastAPI ML Engine    MySQL Database
     (Port 5000)
```

---

## ⚙️ Prerequisites

| Tool | Version Required |
|------|-----------------|
| Node.js | v18+ |
| Java (JDK) | 17 |
| Python | 3.10+ |
| MySQL | 8.0+ |
| Maven | 3.8+ (or use included `mvnw`) |

---

## 🚀 Setup & Running

### 1. Database & Environment Setup
Create the MySQL database:
```sql
CREATE DATABASE srl_db;
```
The relational tables are created automatically by Hibernate on first run.

Configure your environment variables by creating a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Update `.env` with your local database credentials:
```properties
DB_URL=jdbc:mysql://localhost:3306/srl_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_secure_password_here
```
*(You can also export `DB_PASSWORD` or `SPRING_DATASOURCE_PASSWORD` as system environment variables).*

---

### 2. Start the ML Engine (Python)
```bash
cd ml-engine
python -m venv venv
venv\Scripts\activate        # Windows
pip install fastapi uvicorn
python api.py
```
ML Engine runs on **http://localhost:5000**

> To retrain the model on fresh survey data:
> ```bash
> python train_student_behavior.py
> ```

---

### 3. Start the Backend (Spring Boot)
```bash
cd backend
.\mvnw.cmd spring-boot:run   # Windows
./mvnw spring-boot:run       # Mac/Linux
```
Backend runs on **http://localhost:8080**

---

### 4. Start the Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173** — open this in your browser.

---

## 🔑 Authentication & Demo Setup

1. Open the web interface at **http://localhost:5173**.
2. Click **Create an account** on the login screen to register a new user with any name, email, and password (minimum 6 characters).
3. Once logged in, open the student profile drawer (top right) and click **Seed Sample Data** to instantly populate realistic study history, active goals, and reflections for evaluation.

---

## 📁 Project Structure

```
Prototype/
├── .env.example       # Template for environment variables
├── frontend/          # React + TypeScript + Vite
│   └── src/App.tsx    # Main application (single-file architecture)
├── backend/           # Spring Boot 3.2 + MySQL
│   ├── .env.example   # Backend environment template
│   └── src/main/java/com/learning/srl/
│       ├── controller/    # REST endpoints
│       ├── service/       # Business logic
│       ├── entity/        # JPA entities
│       ├── repository/    # Spring Data repositories
│       └── config/        # CORS, Jackson config
├── ml-engine/         # Python FastAPI
│   ├── api.py             # ML endpoints
│   ├── train_student_behavior.py  # K-Means trainer (real survey data)
│   ├── student_behavior_data.csv  # Real survey data (N=80)
│   └── models/
│       ├── behavior_centroids.json  # K-Means centroids
│       └── centroids.json           # Session risk centroids
```

---

## 🤖 ML Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict_session` | POST | Fatigue Risk Predictor — returns risk score + nudge |
| `/analyze_behavior` | POST | K-Means classifier — returns learner persona |
| `/generate_breakdown` | POST | AI goal breakdown into micro-tasks |


