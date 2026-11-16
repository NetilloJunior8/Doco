# ==============================================================================
# DOCO ARCHIVAL STREETWEAR - PRODUCTION DOCKERFILE (RENDER / CLOUD DEPLOYMENT)
# ==============================================================================
# Multi-stage build: compiles with Maven + Java 23, runs with minimal JRE
# ------------------------------------------------------------------------------

# --- Stage 1: Build JAR ---
FROM maven:3.9.9-eclipse-temurin-23-alpine AS builder
WORKDIR /workspace

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Compile and package application
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Image ---
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Create directory for persistent/local SQLite storage
RUN mkdir -p /app/data

# Copy built artifact
COPY --from=builder /workspace/target/*.jar app.jar

# Configure default ports and profiles
ENV PORT=8080
ENV SPRING_PROFILE=sqlite
ENV SQLITE_PATH=/app/data/doco-catalog.db

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
