# syntax=docker/dockerfile:1

# ---- Build stage: compile the Vite app to static assets ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . ./
RUN npm run build

# ---- Runtime stage: serve the static build with nginx ----
FROM nginx:alpine AS runtime

# SPA config listens on 3000 so the existing API gateway upstream (web:3000) is unchanged.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
