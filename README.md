# 🏛️ Amdoxtechnologis — JobVault Portal

A production-ready MERN stack job portal system, featuring JWT-based auth, role-based access control, job management, and an application tracking system with a modern dark-themed UI.

---

## 📁 Project Structure

```
job-portal-system/
├── frontend/               # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/     # Sidebar, ProtectedRoute, DashboardLayout
│       ├── pages/          # Login, Register, Jobs, JobDetails, Applications, Profile
│       ├── services/       # authService, jobService, applicationService
│       ├── context/        # AuthContext (global auth state)
│       └── hooks/          # useAuth custom hook
│
├── backend/                # Node.js + Express + MongoDB
│   ├── config/             # MongoDB connection
│   ├── controllers/        # auth, profile, job, application controllers
│   ├── middleware/         # JWT auth middleware + role authorizer
│   ├── models/             # User, Job, Application, Profile schemas
│   ├── routes/             # Auth, Profile, Job, Application routes
│   └── uploads/            # Local storage for resumes (PDF/DOCX)
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
JWT_SECRET=your_super_secret_jwt_key
PORT=5001
NODE_ENV=development
```

---

### 2. Install & Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on → **http://localhost:5001**

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

### Auth & Profile
| Method | Endpoint              | Access    | Description          |
|--------|-----------------------|-----------|----------------------|
| POST   | `/api/auth/register`  | Public    | Register new user    |
| POST   | `/api/auth/login`     | Public    | Login & get JWT      |
| GET    | `/api/profile/me`     | Protected | Get current profile  |

### Jobs
| Method | Endpoint              | Access    | Description               |
|--------|-----------------------|-----------|---------------------------|
| GET    | `/api/jobs`           | Public    | Get all jobs (with query) |
| GET    | `/api/jobs/:id`       | Public    | Get single job details    |
| POST   | `/api/jobs`           | Employer  | Create a new job listing  |
| PUT    | `/api/jobs/:id`       | Employer  | Update job listing        |
| DELETE | `/api/jobs/:id`       | Employer  | Delete job listing        |
| GET    | `/api/jobs/my/all`    | Employer  | Get employer's listings   |

### Applications
| Method | Endpoint                    | Access    | Description                |
|--------|-----------------------------|-----------|----------------------------|
| POST   | `/api/applications/:jobId`  | Seeker    | Apply to a job             |
| GET    | `/api/applications/my/all`  | Seeker    | Get my applications        |
| GET    | `/api/applications/job/:id` | Employer  | Get applications for a job |
| PATCH  | `/api/applications/:id/status`| Employer| Update application status  |

---

## ✅ Features Implemented

- [x] **JWT Authentication**: Secure login/registration with role-based tokens.
- [x] **Secure Profiles**: Separate profiles for Job Seekers (resumes, skills) and Employers (company details).
- [x] **Job Market**: Advanced search with keyword and location filters.
- [x] **Recruitment Portal**: Employers can post, edit, and delete job listings.
- [x] **Application Tracking**: Seekers can track status; Employers can shortlist or reject candidates.
- [x] **Resume Management**: Secure local storage and retrieval of PDF/DOCX resumes.
- [x] **Modern UI**: Fully responsive, dark-themed interface built with Tailwind CSS.

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
| Storage   | Multer (Local File System)      |
| Dev       | nodemon                         |
