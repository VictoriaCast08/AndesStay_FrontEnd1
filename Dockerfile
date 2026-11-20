# Etapa 1: Compilar Angular para producción
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servir estáticos con Nginx en el puerto 80
FROM nginx:alpine
COPY --from=build /app/dist/frontend-andesstay/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]