# --- Stage 1: Build the JAR using Java 25 ---
FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app

# Install Maven manually to guarantee Java 25 compatibility
RUN apk add --no-cache curl tar && \
    curl -fsSL https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz | tar xzf - -C /opt && \
    ln -s /opt/apache-maven-3.9.9/bin/mvn /usr/bin/mvn

# Copy the project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# --- Stage 2: Run the Application using Java 25 ---
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy only the built JAR from the first stage
COPY --from=build /app/target/*.jar app.jar

# Expose the standard Spring Boot port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
