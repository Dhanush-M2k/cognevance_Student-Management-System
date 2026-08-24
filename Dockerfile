# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- Run stage (Render production image) ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Run as non-root, per Render's container best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --chown=appuser:appgroup --from=build /app/target/student-management-system-1.0.0.jar app.jar

# application-prod.properties already reads server.port=${PORT:8080},
# so Render's injected $PORT is picked up automatically once the prod
# profile is active - no extra port bridging needed here.
# DB_URL / DB_USERNAME / DB_PASSWORD must be set as Render environment
# variables (see application-prod.properties) - never baked into the image.
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
