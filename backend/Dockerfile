FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY target/tingeso-backend.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]