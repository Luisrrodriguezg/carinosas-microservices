# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

Each microservice has its own Maven wrapper. Run commands from within the service directory (e.g., `cd case-service`):

```bash
./mvnw clean package          # Build JAR
./mvnw spring-boot:run        # Run locally
./mvnw test                   # Run tests
./mvnw test -Dtest=ClassName  # Run a single test class
```

Full stack via Docker (from repo root):
```bash
docker-compose up --build     # Build and start all services + Postgres + Keycloak
docker-compose up -d          # Detached mode
```

Services must be built (`./mvnw clean package`) before `docker-compose up` since Dockerfiles copy from `target/*.jar`.

## Architecture

Spring Boot microservices behind a Spring Cloud Gateway, authenticated via Keycloak (OAuth2/JWT). Services communicate indirectly through UUID references (no inter-service REST calls or messaging).

**Services and ports:**
- **api-gateway** (8080) — Routes requests, enforces RBAC (GET: all roles, POST/PUT/PATCH: ADMIN+DETECTIVE, DELETE: ADMIN only)
- **case-service** (8081) — `/api/cases/**`
- **people-service** (8082) — `/api/people/**`
- **evidence-service** (8083) — `/api/evidences/**`
- **task-service** (8084) — `/api/tasks/**`

**Infrastructure:**
- PostgreSQL 15 on port 5432 — separate database per service, initialized by `init-db.sql`
- Keycloak 24 on port 8090 — realm "carinosas" with roles: ADMIN, DETECTIVE, ANALYST

**Each microservice follows this layered pattern:**
`controller/ → service/ → repository/` with `domain/` (JPA entities + enums), `dto/` (request/response), `exceptions/`, and `config/`.

## Key Configuration

- Gateway routes and CORS: `api-gateway/src/main/resources/application.yml`
- Security/RBAC rules: `api-gateway/src/main/java/com/carinosas/apigateway/SecurityConfig.java`
- Keycloak realm + test users: `keycloak/carinosas-realm.json` (admin/admin123, detective/detective123, analyst/analyst123)
- Service DB config uses env vars: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`

## Tech Stack

- Java 21, Spring Boot 4.0.5 (services) / 3.4.4 (gateway), Maven 3.9.14
- Spring Data JPA + Hibernate (ddl-auto: update), Lombok, Jakarta Validation
- Docker with docker-compose, eclipse-temurin:21-jre-alpine base images
