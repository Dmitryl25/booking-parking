FROM gradle:8-jdk25 AS build

WORKDIR /app
COPY . .

RUN gradle build -x test

FROM openjdk:25

COPY --from=build /app/build/libs/*.jar app.jar

CMD ["java","-jar","app.jar"]