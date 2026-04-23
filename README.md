# Task Management API

A backend REST API for task and workflow management built with Node.js, Express, Sequelize ORM, and PostgreSQL.

## Tech Stack

- Node.js + Express
- Sequelize ORM (PostgreSQL)
- JWT Authentication
- Zod for validation
- bcryptjs for password hashing

## Setup Instructions

### 1. Clone the repo and install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=DBpassword
JWT_SECRET=jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Database Setup & Migration

Create the database first:

```sql
CREATE DATABASE task_management;
```

Then run migrations:

```bash
npm run migrate
```

Optionally seed an admin user:

```bash
npm run seed
```

This creates an admin user:
- Email: `admin@example.com`
- Password: `admin123`

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

---

## API Usage

### Authentication

#### POST /auth/login

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "<jwt_token>",
  "user": { "id": "...", "name": "Admin User", "email": "...", "role": "ADMIN" }
}
```

All other endpoints require the header:
```
Authorization: Bearer <token>
```

---

### Tasks

#### POST /tasks *(Admin only)*

```json
{
  "title": "Fix login bug",
  "description": "Users can't login on mobile",
  "priority": "HIGH",
  "assignedTo": "<user_uuid>",
  "dueDate": "2024-12-31T00:00:00.000Z"
}
```

#### GET /tasks

Query params: `status`, `priority`, `page`, `limit`

Example: `GET /tasks?status=PENDING&priority=HIGH&page=1&limit=10`

- Admin sees all tasks
- User sees only tasks assigned to them

#### GET /tasks/:id

Returns task details.

#### PUT /tasks/:id

Admin can update any field. User can only update `status` on their assigned tasks.

```json
{
  "status": "IN_PROGRESS"
}
```

#### DELETE /tasks/:id *(Admin only)*

## Roles

| Action | ADMIN | USER |
|--------|-------|------|
| Create task | Yes | No |
| View all tasks | Yes | No (own only) |
| Update any task field | Yes | Status only (assigned) |
| Delete task | Yes | No |
| Add comment | Yes | Yes (assigned tasks) |
