# Chirpy

Chirpy is a backend web server built in Go that simulates a basic social media platform. It includes user authentication, "chirp" creation, and a custom JSON-based database for persistent storage.

## Features

- RESTful API for managing users and chirps
- Secure password hashing with bcrypt
- User authentication using JSON Web Tokens (JWT)
- Refresh token logic for long-lived sessions
- Administrative tools and health checks

## Prerequisites

- [Go](https://go.dev/doc/install) (version 1.20+ recommended)

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/chirpy.git
   cd chirpy

Set up Environment Variables:
Create a .env file in the root directory to store your secrets.

touch .env

Add the following to your .env file:

JWT_SECRET=your_super_secret_key_here

Install dependencies:

go mod download

Run the server:

go run .

The server will start on http://localhost:8080.

API Endpoints
Health and Readiness
GET /api/healthz: Check if the server is running.
GET /admin/metrics: View server usage statistics (HTML).
Chirps
POST /api/chirps: Create a new chirp.
GET /api/chirps: Retrieve all chirps.
GET /api/chirps/{id}: Retrieve a specific chirp by ID.
Users
POST /api/users: Register a new user.
POST /api/login: Authenticate and receive a JWT.
