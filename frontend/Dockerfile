# Сборка фронта
FROM node:20 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Продакшн контейнер с nginx
FROM nginx:alpine

# Копируем сборку фронта
COPY --from=build /app/dist /usr/share/nginx/html

# Кастомный конфиг nginx
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]