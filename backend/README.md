# AggieFlow Backend

This is the backend for **AggieFlow**, a web-based collaborative dashboard for student project teams.  
It provides REST APIs for managing **teams** and **tasks**, and supports **real-time updates** via Socket.IO.

---

## Table of Contents

- [Features](#features)  
- [Setup](#setup)  
- [Folder Structure](#folder-structure)  
- [Available Scripts](#available-scripts)  
- [API Endpoints](#api-endpoints)  
- [Real-Time Updates](#real-time-updates)

---

## Features

- Create and manage teams  
- Create, update, and list tasks  
- Add members to teams  
- Real-time updates for task changes using Socket.IO 
- RESTful API architecture
- Modular route and controller structure

---

## Setup

1. Make sure [Node.js](https://nodejs.org/) is installed.  
2. Open a terminal and navigate to the backend folder:
cd backend
3. Install dependencies:
npm install
npm install dotenv
4. Start the development server:
npm run dev

Server will run at:
[Local ](http://localhost:5000)

---

## API Endpoints
Tasks
| Method | Endpoint | Description |
|:------:|:--------:|:-----------:|
| GET    | /api/tasks | Retrieve all tasks |
| POST    | /api/tasks | Create a new task |
| PATCH    | /api/tasks/:id | Toggle task completion |


Teams 
| Method | Endpoint | Description |
|:------:|:--------:|:-----------:|
| GET    | /api/teams | Retrieve all teams |
| POST    | /api/teams | Create a new team |
| POST    | /api/teams/:id/addMember | Add member to a team |

---

## Folder Structure 
backend/
├─ server.js            # Main server entry point
├─ routes/              # API route definitions
│    ├─ tasks.js
│    └─ teams.js
├─ controllers/         # Logic for routes
│    ├─ taskController.js
│    └─ teamController.js
├─ package.json         # NPM dependencies & scripts
└─ .gitignore           # Ignore node_modules and .env

---

## Real-Time Updates

AggieFlow uses Socket.IO to broadcast updates to all connected clients.

## Events Emitted

- taskAdded
- taskUpdated
- teamAdded
- memberAdded

# How Real-Time Works

1. Frontend sends an API request.
2. Backend updates in-memory data.
3. Backend emits a Socket.IO event.
4. All connected clients receive the update instantly.