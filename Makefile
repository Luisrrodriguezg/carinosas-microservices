SERVICES := case-service people-service evidence-service task-service api-gateway
export JAVA_HOME ?= $(JAVA_HOME)

.PHONY: dev build clean stop frontend

## Start everything: build JARs, start Docker + frontend
dev: build
	cd frontend && npm install
	docker compose up --build -d
	@echo "Backend starting in Docker. Starting frontend..."
	cd frontend && npm run dev

## Build all service JARs
build:
	@for svc in $(SERVICES); do \
		echo "Building $$svc..."; \
		cd $$svc && ./mvnw clean package -DskipTests -q && cd ..; \
	done
	@echo "All services built."

## Start frontend dev server (run in a separate terminal)
frontend:
	cd frontend && npm install && npm run dev

## Stop all Docker containers
stop:
	docker compose down

## Clean all target/ directories
clean:
	@for svc in $(SERVICES); do \
		rm -rf $$svc/target; \
	done
	@echo "Cleaned all targets."
