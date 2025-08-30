FROM node:22 as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Create non-root user
RUN groupadd -r nginxuser && useradd -r -g nginxuser -s /bin/bash nginxuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
