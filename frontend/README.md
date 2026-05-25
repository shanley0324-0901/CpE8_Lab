# Fullstack User Management System

A fullstack web application built using Angular, Node.js, Express.js, and MySQL.  
This project demonstrates CRUD operations, JWT authentication, role-based access control, and REST API integration.

---

# Features

## User Management
- Create new users
- View all users
- Update user information
- Soft delete users (disable account instead of permanent deletion)
- Enable disabled users

## Authentication & Security
- User registration
- User login/logout
- Password hashing using bcrypt
- JWT authentication
- Role-based access control (Admin & Standard User)

## Frontend
- Angular standalone components
- HTTP client integration
- Toast notifications
- Automatic UI refresh after CRUD operations

## Backend
- REST API using Express.js
- MySQL database integration
- Middleware-based authentication and authorization
- Organized architecture using routes, controllers, and config folders

---

# Tech Stack

## Frontend
- Angular
- TypeScript
- HTML/CSS

## Backend
- Node.js
- Express.js

## Database
- MySQL

## Security
- JWT
- bcryptjs

---

# Project Structure

```plaintext
backend/
 ├── config/
 ├── controllers/
 ├── middlewares/
 ├── routes/
 ├── server.js

frontend/
 ├── src/app/
 ├── environments/