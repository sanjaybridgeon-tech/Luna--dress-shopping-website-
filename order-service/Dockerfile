# Stage 1: Build with Maven and JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy parent and module POMs for dependency resolution
COPY pom.xml .
COPY luna-gateway/pom.xml luna-gateway/
COPY product-service/pom.xml product-service/
COPY user-service/pom.xml user-service/
COPY order-service/pom.xml order-service/

# Copy order-service source code
COPY order-service/src order-service/src

# Package order-service without tests
RUN mvn clean package -pl order-service -am -DskipTests

# Stage 2: Production JRE 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root security group & user
RUN addgroup -S luna && adduser -S luna -G luna
USER luna

# Copy executable jar from builder stage
COPY --from=builder /app/order-service/target/*.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
