FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy pom and mvnw to leverage Docker cache
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN mvn -B -DskipTests dependency:go-offline

# Copy sources and package
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar ./app.jar
EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app.jar"]
