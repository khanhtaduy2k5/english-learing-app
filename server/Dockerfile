# ── Stage 1: Dependency cache ─────────────────────────────────────────────────
FROM maven:3.9.4-eclipse-temurin-21 AS deps
WORKDIR /workspace
# Only copy pom.xml first → this layer is cached until pom.xml changes
COPY pom.xml ./
RUN mvn -B -DskipTests dependency:resolve dependency:resolve-plugins

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM deps AS build
# Copy source (invalidates only this layer when src changes)
COPY src ./src
# Build with layered JAR enabled for optimal Docker caching
RUN mvn -B -DskipTests package -Dspring-boot.repackage.layered=true

# ── Stage 3: Extract layers ───────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS extractor
WORKDIR /workspace
COPY --from=build /workspace/target/english-learning-app-0.0.1-SNAPSHOT.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# ── Stage 4: Runtime (smallest possible) ─────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl
# Copy layered JAR pieces — unchanged layers (deps) are cached by Docker
COPY --from=extractor /workspace/dependencies/ ./
COPY --from=extractor /workspace/spring-boot-loader/ ./
COPY --from=extractor /workspace/snapshot-dependencies/ ./
COPY --from=extractor /workspace/application/ ./
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
