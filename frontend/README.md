# samvad

Samvad is a backend-focused campus communication system built to manage structured discussions, clubs, and events in a controlled and role-based way.

The main goal of this project is to design a clear backend system that handles users, permissions, and data flow properly, instead of building just another chat or social app.

---

## Problem Statement

In many campuses, communication is scattered across WhatsApp groups, emails, and different platforms.  
There is no single system that:

- supports structured discussions
- clearly separates student and admin roles
- keeps clubs, events, and announcements organized

Samvad is an attempt to solve this problem with a simple and well-structured system.

---

## What Samvad Focuses On

Samvad is **not** trying to do everything.

The main focus is on:
- role-based access (student, club admin, super admin)
- controlled discussions and announcements
- clean backend design and API structure

Some features are experimental or planned and are not the main focus yet.

---

## High Level System Design

The system is divided into two main parts:

- **Backend**: Handles authentication, authorization, data storage, and business logic  
- **Frontend**: A simple interface to interact with backend APIs  

The backend is treated as the core of the system.


---

## Core Features

- User registration and login
- Role-based access control
- Club creation and management
- Event creation and registration
- Discussion threads for announcements and conversations

---

## Backend Design

The backend follows a layered structure:

- **Controllers**: Handle API requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle database operations
- **Models**: Define data structures

Authentication is handled using JWT tokens.  
Every protected API checks the user role before allowing access.

---

## Tech Stack

### Backend
- Language: Python
- Framework: FastAPI
- Authentication: JWT
- Database: SQLite (development)

### Frontend
- React
- Tailwind CSS

The frontend is kept simple and mainly used to test and visualize backend flows.

---


---

## How to Run Locally (Basic)

1. Clone the repository  
2. Go into the backend folder  
3. Install dependencies  
4. Start the backend server  
5. (Optional) Start the frontend separately  

Detailed steps are available inside the backend and frontend folders.

---

## Current Limitations

- This is still a learning project
- Some features are basic or partially implemented
- Scalability and production deployment are not fully handled yet

These limitations are intentional to keep the system simple and understandable.

---

## Future Improvements

- Improve role management rules
- Better validation and error handling
- Move to a production-grade database
- Rebuild backend using Java (Spring Boot) for deeper system design

---

## Why This Project Exists

This project is built mainly to:
- practice backend system design
- apply authentication and authorization concepts
- understand how real applications are structured

It is not meant to be a polished commercial product.

