# Budget Tracker App

A full-stack **Budget Tracker** application built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). It helps users manage their income and expenses with authentication, transaction filtering, user profile management, and secure password reset.

---

## 🚀 Features

- 🔐 User registration & login with JWT authentication
- ➕ Add income or expense transactions
- 📊 Filter transactions by type, date, and category
- ✏️ Edit and delete transactions
- 👤 Update user profile (username, email)
- 🔒 Reset password using modal
- 📦 Fully modular backend & frontend codebase

---

## 📁 Project Structure


- **Budget-Tracker/**
  - **backend/**
    - `controllers/` - Route handler functions (logic)
    - `middleware/` - Authentication middleware (JWT)
    - `models/` - Mongoose models (User, Transaction)
    - `routes/` - Express route definitions
    - `.env` - environment config
    - `server.js` - Main server file (Express + MongoDB)
    - `package.json` - Backend dependencies and scripts
  - **frontend/**
    - `public/` - Static assets and favicon
    - `src/` - React components and pages
    - `vite.config.js` - Vite configuration
    - `package.json` - Frontend dependencies and scripts
  - `README.md` - Project documentation
  - `.gitignore` - Files/folders to exclude from Git

---

## ⚙️ Technologies Used 

- **Frontend**: React, Vite, Axios, Formik, Yup, React Hook Form, React Toastify
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt


---

# Setup Guide

## Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB local running instance

## 1. Clone the Repository

```bash
git https://github.com/BehzadHassan/Budget-Tracker.git
cd Budget-Tracker
```

## 2. Setup Backend
```bash
cd Backend
npm install 
```

### Create a .env file in the backend/ directory:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/budget-tracker
```

### Run the backend server:

```bash
node server.js
```

By default, the server runs on http://localhost:5000.

## 3. Setup Frontend

```bash
cd ../Frontend
npm install
```
### Start the React app:

```bash
npm run dev
```

By default, the app runs on http://localhost:5173.

## 🔗 API Endpoints

| Route Group       | Endpoint       | Method | Description                          |
|-------------------|----------------|--------|--------------------------------------|
| **User Routes**   | `/register`    | POST   | Register new user                    | 
|                   | `/login`       | POST   | Login to get JWT token               | 
| **Transactions**  | `/`            | GET    | Get all user transactions            | 
|                   | `/`            | POST   | Create new transaction               | 
|                   | `/:id`         | PUT    | Update transaction                   | 
|                   | `/:id`         | DELETE | Delete transaction                   |