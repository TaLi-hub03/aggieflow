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

---

## Setup

1. Make sure [Node.js](https://nodejs.org/) is installed.  
2. Open a terminal and navigate to the backend folder:

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
