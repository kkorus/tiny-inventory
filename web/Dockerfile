# Build static assets, then serve with nginx
FROM node:22-bookworm-slim AS build
WORKDIR /app
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
COPY server/package*.json ./server/
COPY web/package*.json ./web/
RUN npm ci
COPY web ./web
RUN npm run build -w web

FROM nginx:1.27-alpine
COPY --from=build /app/web/dist /usr/share/nginx/html
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
