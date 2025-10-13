# BragBoard

BragBoard is a full-stack web application that allows users to showcase achievements, projects, and professional credentials in a portfolio-style platform. The project consists of a **frontend** built with **Vite + React** and a **backend** built with **FastAPI + Python**.

---

## Features

- **User Authentication:** Registration and login for users and admins.
- **Frontend:** Dynamic and responsive UI using React, supporting light/dark mode.
- **Backend API:** RESTful API built with FastAPI.
- **Database:** PostgreSQL for storing user data and projects.
- **Password Security:** Password hashing using Passlib and bcrypt.
- **JWT Authentication:** Secure API access with JWT tokens.
- **Project Management:** Users can add and manage their projects and achievements.

---

## Folder Structure


---

## Setup Instructions

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.10+)
- **PostgreSQL** (or any database supported by SQLAlchemy)

---

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev


cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# or source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload


