# 🏛️ JobVault — Job Portal Auth System

A production-ready MERN stack authentication system for a job portal, featuring JWT-based auth, role-based access control, and a modern dark-themed UI.

---

## 📁 Project Structure

```
job-portal-auth-system/
├── frontend/               # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/     # Navbar, ProtectedRoute
│       ├── pages/          # Login, Register, Dashboard
│       ├── services/       # Axios API layer (authService.js)
│       ├── context/        # AuthContext (global auth state)
│       └── hooks/          # useAuth custom hook
│
├── backend/                # Node.js + Express + MongoDB
│   ├── config/             # MongoDB connection
│   ├── controllers/        # authController (register, login, profile)
│   ├── middleware/         # JWT auth middleware + role authorizer
│   ├── models/             # User Mongoose schema
│   ├── routes/             # Auth routes
│   └── modules/
│       ├── jobs/           # 🚧 Scaffolded for future use
│       └── applications/   # 🚧 Scaffolded for future use
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
NODE_ENV=development
```

> **Atlas example:**
> `MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/job-portal`

---

### 2. Install & Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on → **http://localhost:5000**

---

### 3. Install & Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → **http://localhost:5173**

---

## 🔌 API Reference

| Method | Endpoint              | Access    | Description          |
|--------|-----------------------|-----------|----------------------|
| POST   | `/api/auth/register`  | Public    | Register new user    |
| POST   | `/api/auth/login`     | Public    | Login & get JWT      |
| GET    | `/api/auth/profile`   | Protected | Get current user     |
| GET    | `/api/health`         | Public    | Health check         |

---

## 🔐 Authentication Flow

1. User registers → password hashed with **bcrypt** (12 salt rounds)
2. User logs in → **JWT** token generated (7d expiry)
3. Token stored in `localStorage` on frontend
4. Protected routes: token sent as `Authorization: Bearer <token>`
5. Middleware verifies token and attaches user to request

---

## 👥 User Roles

| Role         | Access                             |
|--------------|------------------------------------|
| `jobseeker`  | Browse jobs, submit applications   |
| `employer`   | Post jobs, manage applications     |

Role is stored in MongoDB and embedded in the JWT payload.

---

## ✅ Features Implemented

- [x] User Registration (name, email, password, role)
- [x] Email uniqueness validation
- [x] bcrypt password hashing
- [x] Password strength indicator
- [x] User Login with JWT
- [x] JWT authentication middleware
- [x] Protected routes (frontend + backend)
- [x] Role-based authorization middleware
- [x] Responsive modern dark UI with Tailwind
- [x] Password visibility toggle
- [x] Form validation (client + server)
- [x] Token auto-restoration on page reload
- [x] Axios interceptors for token injection
- [x] Global error handling middleware

---

## 🏗️ Future Modules (Scaffolded)

- `backend/modules/jobs/` — Job posting CRUD
- `backend/modules/applications/` — Application management

---

## 🛠️ Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS    |
| Routing   | React Router v6                 |
| HTTP      | Axios                           |
| Backend   | Node.js, Express.js             |
| Database  | MongoDB, Mongoose               |
| Auth      | JWT, bcryptjs                   |
| Dev       | nodemon                         |
