# Carinosas Microservices

Criminal case management system built with Spring Boot microservices, secured with Keycloak (OAuth2/JWT), and a React frontend.

## Prerequisites

- **Java 21** (OpenJDK via Homebrew)
- **Docker** and **Docker Compose**
- **Node.js** (for the frontend)
- **Make**

## Quick Start

### 1. Set JAVA_HOME (required before building)

On macOS with Homebrew:

```bash
export JAVA_HOME=$(/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home)
```

You can add this line to your `~/.zshrc` to make it permanent.

### 2. Build and run everything

```bash
make dev
```

This will:
- Build all service JARs (`./mvnw clean package`)
- Start PostgreSQL, Keycloak, Kafka, and all microservices via Docker Compose
- Install frontend dependencies and start the Vite dev server

### Other commands

| Command | Description |
|---|---|
| `make build` | Build all service JARs only |
| `make frontend` | Start frontend dev server only (in a separate terminal) |
| `make stop` | Stop all Docker containers |
| `make clean` | Remove all `target/` directories |

## Architecture

Spring Boot microservices behind a Spring Cloud Gateway, authenticated via Keycloak.

| Service | Port | Base Path |
|---|---|---|
| API Gateway | 8080 | Routes all requests |
| Case Service | 8081 | `/api/cases/**` |
| People Service | 8082 | `/api/people/**` |
| Evidence Service | 8083 | `/api/evidences/**` |
| Task Service | 8084 | `/api/tasks/**` |

**Infrastructure:**

| Component | Port |
|---|---|
| PostgreSQL 15 | 5432 |
| Keycloak 24 | 8090 |
| Kafka 3.9 | 9092 |

## Test Users (Keycloak)

| User | Password | Role |
|---|---|---|
| admin | admin123 | ADMIN |
| detective | detective123 | DETECTIVE |
| analyst | analyst123 | ANALYST |

## RBAC Rules

- **GET**: all authenticated roles
- **POST / PUT / PATCH**: ADMIN, DETECTIVE
- **DELETE**: ADMIN only
