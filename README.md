# Parking Booking

Студенческий проект от Т-БАНК. Выполняли: Ляпин Дмитрий, Астрова Анна, Кильдяева Софья.

Веб-приложение для бронирования парковочных мест в офисах. Пользователь может просматривать и создавать бронирования, а администратор — управлять офисами, категориями парковочных мест, местами и пользователями.

## Технологии

- Frontend: React, Vite, Material UI
- Backend: Java 21, Spring Boot, Spring Security, JPA
- База данных: PostgreSQL 15
- Контейнеризация: Docker Compose

## Быстрый запуск

Требуются Docker и Docker Compose. Из корневой директории проекта выполните:

```bash
docker compose up --build
```

После запуска доступны:

- приложение: [http://localhost:3000](http://localhost:3000)
- REST API: `http://localhost:8080/api`
- PostgreSQL: `localhost:5432` (база `users`, пользователь `postgres`)

Для остановки контейнеров нажмите `Ctrl+C` или выполните:

```bash
docker compose down
```

## Структура

- `frontend/` — клиентское приложение;
- `backend/` — серверное приложение и API;
- `docs/Parking.yaml` — спецификация OpenAPI.

## Локальная разработка

Для фронтенда: `cd frontend && npm install && npm run dev`.

Для бэкенда требуется Java 21 и запущенный PostgreSQL; затем: `cd backend && ./gradlew bootRun`.
