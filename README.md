## Admin Panel API (Express + Sequelize)

Node.js Express API with Sequelize ORM managing users, roles, and user_roles (many-to-many). This README focuses on using the Makefile to run and manage the project.

### Prerequisites

- Docker and Docker Compose
- Make

### Setup

1) Create .env from the example and adjust as needed:

shell

cp example.env .env

example.env contains:

shell

PORT=3000
DB_USERNAME=admin
DB_PASSWORD=admin
DB_NAME=app

The Compose stack sets DB_DIALECT=postgres and connects the app to the db service automatically.

### Start and manage (Makefile)

shell

# Start app + Postgres (build if needed)
make up

# Stop and remove containers + volumes
make down

# Show services and follow app logs
make ps
make logs

# Open shells
make shell       # app container
make db-shell    # psql in db container

# Database operations
make migrate     # run Sequelize migrations (if any are added later)
make seed        # run all seeders
make seed-undo   # undo all seeders

App: http://localhost:3000 • Postgres: localhost:5432

### API endpoints

- GET /health → { status: "ok" }
- GET /users → List users with roles
- GET /roles → List roles
- PATCH /users/:id/roles → Set user roles
  - Body: { "roleIds": number[] }

Examples:

shell

curl http://localhost:3000/health
curl http://localhost:3000/users
curl http://localhost:3000/roles
curl -X PATCH http://localhost:3000/users/1/roles -H "Content-Type: application/json" -d '{"roleIds":[1,2]}'
